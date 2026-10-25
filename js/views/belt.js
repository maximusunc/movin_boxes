import { COL, ctx, rr } from "../canvas.js";
import { S } from "../state.js";
import { reduceMotion } from "../util.js";

function refWindow(L){
  let best = 0, at = null, l = 0, tot = 0;
  L.weights.forEach((w, r) => {
    tot += w;
    while (tot > L.limit && l <= r){ tot -= L.weights[l]; l++; }
    if (r - l + 1 > best){ best = r - l + 1; at = [l, r]; }
  });
  return {best, at};
}
export function judgeBelt(L, win){
  const ref = refWindow(L), n = L.weights.length;
  const res = {ref};
  if (win === null){
    if (ref.best === 0) return Object.assign(res, {status:"pass", title:"Correct", text:"Every package is over the limit, so None is right."});
    return Object.assign(res, {status:"fail", title:"Something fits", text:"You returned None, but a stretch of " + ref.best + " package" + (ref.best > 1 ? "s" : "") + " fits under the limit."});
  }
  const [i, j] = win;
  if (i < 0 || j >= n || i > j)
    return Object.assign(res, {status:"fail", title:"Not a real stretch", text:"(" + i + ", " + j + ") isn’t a valid stretch. Use 0 ≤ start ≤ end ≤ " + (n-1) + ", with end inclusive."});
  const sum = L.weights.slice(i, j+1).reduce((a, b) => a + b, 0);
  res.sum = sum;
  if (sum > L.limit) return Object.assign(res, {status:"fail", title:"Truck overloaded", text:"Packages " + i + " to " + j + " weigh " + sum + ", over the limit of " + L.limit + ". Remember that end is inclusive."});
  const len = j - i + 1;
  if (len < ref.best) return Object.assign(res, {status:"fail", title:"Fits, but not the longest", text:"Your stretch has " + len + " package" + (len > 1 ? "s" : "") + ". The longest that fits has " + ref.best + "."});
  return Object.assign(res, {status:"pass", title:"Longest stretch loaded", text:"Packages " + i + " to " + j + " weigh " + sum + " of " + L.limit + ", and no longer stretch fits."});
}
export const PICK = (w, names) => { for (const n of names) if (w[n] !== undefined && typeof w[n] === "number") return [n, w[n]]; return [null, null]; };
export function resolveWatch(w){
  if (!w) return {};
  let [ln, L] = PICK(w, ["left", "l", "start", "lo"]);
  let [rn, R] = PICK(w, ["right", "r", "end", "hi"]);
  if (rn === null){
    if (w.j !== undefined && typeof w.j === "number"){ R = w.j; rn = "j"; if (ln === null && typeof w.i === "number"){ L = w.i; ln = "i"; } }
    else if (typeof w.i === "number" && ln !== null){ R = w.i; rn = "i"; }
  }
  const [, sum] = PICK(w, ["total", "window_sum", "window", "curr", "cur", "current", "load", "s", "acc", "running"]);
  let best = null;
  for (const n of ["best", "best_len", "max_len", "longest", "ans", "res", "result"]){
    if (w[n] === undefined) continue;
    best = Array.isArray(w[n]) ? (w[n][1] - w[n][0] + 1) : w[n]; break;
  }
  return {L, R, sum, best};
}
let beltGeo = null;
export function sizeBelt(w){
    const n = S.level.weights.length, pad = 6, gap = 3;
    const b = Math.max(16, Math.floor(Math.min(58, (w - 2*pad - gap*(n-1)) / n)));
    const rowW = n*b + gap*(n-1) + 2*pad;
    const W = Math.max(rowW, Math.min(w, 520));
    const ox = Math.floor((W - (n*b + gap*(n-1))) / 2);
    const gaugeH = 30, boxTop = gaugeH + 18, baseY = boxTop + Math.round(b*1.5);
    beltGeo = {n, b, gap, ox, gaugeH, boxTop, baseY, W, H: baseY + 112};
    return [W, beltGeo.H];
  }

export function drawBelt(){
  if (!beltGeo) return;
  const g = beltGeo, L = S.level, n = L.weights.length, b = g.b;
  const maxW = Math.max(...L.weights, 1);
  const bx = i => g.ox + i*(b + g.gap);
  const bh = w => Math.round(b * (0.62 + 0.88 * Math.min(w, maxW) / maxW));
  ctx.clearRect(0, 0, g.W, g.H);

  // state at time t
  let idx = -1, reads = new Uint16Array(n), w = null, cur = null;
  if (S.run){
    idx = (S.t >= S.run.E ? S.run.E : Math.floor(S.t)) - 1;
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.i >= 0 && e.i < n) reads[e.i]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  const u = final ? Math.min(1, (S.t - S.run.E) / Math.max(1, S.run.S)) : 0;
  const ret = final ? S.run.ret : null;
  const v = S.run && S.run.verdict;

  // window (live) or returned window (final)
  let wl = null, wr = null, sum = null;
  if (final){
    if (ret && ret[0] >= 0 && ret[1] < n && ret[0] <= ret[1]){ wl = ret[0]; wr = ret[1]; sum = v.sum; }
  } else if (w){
    if (w.L != null && w.R != null){ wl = Math.max(0, Math.min(n-1, Math.min(w.L, w.R))); wr = Math.max(0, Math.min(n-1, Math.max(w.L, w.R))); }
    sum = w.sum != null ? w.sum : null;
  }
  const over = sum != null && sum > L.limit;

  // gauge
  const gx = g.ox, gw = n*b + g.gap*(n-1), gy = 4, gh = 22;
  ctx.fillStyle = COL.floor; rr(gx, gy, gw, gh, 5); ctx.fill();
  if (sum != null){
    const frac = Math.max(0, Math.min(1.25, sum / L.limit)) / 1.25;
    ctx.fillStyle = over ? COL.bad : COL.visited; rr(gx, gy, Math.max(4, gw*frac), gh, 5); ctx.fill();
  }
  const lx = gx + gw / 1.25;
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, gy - 2); ctx.lineTo(lx, gy + gh + 2); ctx.stroke();
  ctx.font = "600 13px Barlow, system-ui, sans-serif"; ctx.textBaseline = "middle";
  ctx.fillStyle = COL.ink; ctx.textAlign = "left";
  ctx.fillText(sum != null ? (final ? "Returned stretch " : "Window load ") + sum + " of " + L.limit : "Limit " + L.limit, gx + 8, gy + gh/2 + 1);
  ctx.textAlign = "right"; ctx.fillStyle = COL.muted;
  if (!over) ctx.fillText("over", gx + gw - 6, gy + gh/2 + 1);

  // window band behind the boxes
  if (wl != null){
    const x0 = bx(wl) - 3, x1 = bx(wr) + b + 3, y0 = g.boxTop - 6, y1 = g.baseY + 6;
    ctx.fillStyle = (final ? (v.status === "fail" ? COL.bad : COL.target) : (over ? COL.bad : COL.visited));
    ctx.globalAlpha = final ? .22 : (over ? .25 : .7); rr(x0, y0, x1 - x0, y1 - y0, 6); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = final ? (v.status === "fail" ? COL.bad : COL.target) : COL.frontier; ctx.lineWidth = 3;
    const tick = 8;
    ctx.beginPath();
    ctx.moveTo(x0 + tick, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x0 + tick, y1);
    ctx.moveTo(x1 - tick, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 - tick, y1);
    ctx.stroke();
  }

  // belt
  const beltY = g.baseY + 2;
  ctx.fillStyle = COL.belt; rr(g.ox - 6, beltY, gw + 12, 10, 5); ctx.fill();
  ctx.fillStyle = COL.roller;
  for (let x = g.ox; x <= g.ox + gw; x += Math.max(14, b/2)){ ctx.beginPath(); ctx.arc(x, beltY + 5, 2, 0, Math.PI*2); ctx.fill(); }

  // boxes
  for (let i = 0; i < n; i++){
    const wt = L.weights[i], h = bh(wt), x = bx(i);
    let lift = 0, shake = 0;
    if (final && wl != null && i >= wl && i <= wr){
      const e = reduceMotion() ? 1 : (1 - Math.pow(1 - u, 3));
      lift = (v.status === "fail" ? Math.sin(u*Math.PI) * .18 : .22) * b * e;
      if (v.status === "fail" && u > .3) shake = Math.sin(u*50) * 2 * (1-u);
    }
    const y = g.baseY - h - lift;
    ctx.fillStyle = COL.box; rr(x + shake, y, b, h, 3); ctx.fill();
    ctx.strokeStyle = COL["box-edge"]; ctx.lineWidth = 1.5; rr(x + shake + .75, y + .75, b - 1.5, h - 1.5, 3); ctx.stroke();
    ctx.fillStyle = COL["box-edge"]; ctx.fillRect(x + shake + b/2 - Math.max(2, b*.08)/2, y, Math.max(2, b*.08), Math.min(h*.35, 12));
    ctx.fillStyle = COL["box-ink"]; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.max(11, Math.min(18, Math.round(b*.38))) + "px 'Barlow Condensed', system-ui, sans-serif";
    ctx.fillText(String(wt), x + shake + b/2, y + h*.62);
    if (final && wl != null && i >= wl && i <= wr){
      ctx.strokeStyle = v.status === "fail" ? COL.bad : COL.target; ctx.lineWidth = 2.5; rr(x + shake - 1, y - 1, b + 2, h + 2, 4); ctx.stroke();
    }
    if (cur && cur.i === i){
      ctx.strokeStyle = COL.flash; ctx.lineWidth = 3.5; rr(x - 2.5, y - 2.5, b + 5, h + 5, 5); ctx.stroke();
    }
  }

  // index labels + read dots
  ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.fillStyle = COL.muted; ctx.textAlign = "center"; ctx.textBaseline = "top";
  const iy = beltY + 15;
  for (let i = 0; i < n; i++){
    const cx = bx(i) + b/2;
    ctx.fillStyle = COL.muted; ctx.fillText(String(i), cx, iy);
    const k = reads[i]; if (!k) continue;
    const per = Math.max(1, Math.floor((b - 2) / 7)), rows = 4, cap = per * rows;
    ctx.fillStyle = COL.ink;
    for (let d = 0; d < Math.min(k, cap); d++){
      const col = d % per, row = Math.floor(d / per);
      const dx = cx - (per - 1) * 3.5 + col * 7, dy = iy + 20 + row * 7;
      ctx.beginPath(); ctx.arc(dx, dy, 2.4, 0, Math.PI*2); ctx.fill();
    }
    if (k > cap){ ctx.fillStyle = COL.bad; ctx.font = "700 11px Barlow, system-ui, sans-serif"; ctx.fillText("+" + (k - cap), cx, iy + 20 + rows*7); ctx.font = "500 11px Barlow, system-ui, sans-serif"; }
  }

  // pointers
  if (!final && w){
    const py = g.H - 24;
    const marks = [];
    if (w.L != null && w.L >= 0 && w.L < n) marks.push([w.L, "L"]);
    if (w.R != null && w.R >= 0 && w.R < n) marks.push([w.R, "R"]);
    marks.forEach(([i, lab], m) => {
      const same2 = marks.length === 2 && marks[0][0] === marks[1][0];
      const cx = bx(i) + b/2 + (same2 ? (m ? 9 : -9) : 0);
      ctx.fillStyle = COL.frontier; ctx.beginPath(); ctx.moveTo(cx, py - 9); ctx.lineTo(cx - 7, py + 1); ctx.lineTo(cx + 7, py + 1); ctx.closePath(); ctx.fill();
      ctx.font = "700 13px Barlow, system-ui, sans-serif"; ctx.textBaseline = "top"; ctx.fillText(lab, cx, py + 4);
    });
  }
  // reference window when the answer was short or wrong
  if (final && S.t >= S.run.T && v.status !== "pass" && v.ref.at && !(ret && v.ref.best === (ret[1]-ret[0]+1) && v.status === "long")){
    const [a, c] = v.ref.at, py = g.H - 16, x0 = bx(a), x1 = bx(c) + b;
    ctx.setLineDash([6, 5]); ctx.strokeStyle = COL.target; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x0, py - 8); ctx.lineTo(x0, py); ctx.lineTo(x1, py); ctx.lineTo(x1, py - 8); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = COL.target; ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText("a longest stretch", (x0 + x1)/2, py + 2);
  }
}
