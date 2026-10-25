import { COL, ctx, rr } from "../canvas.js";
import { S } from "../state.js";
import { PICK } from "./belt.js";

export const minutesAt = (L, k) => L.orders.reduce((a, p) => a + Math.ceil(p / k), 0);
export function refSpeed(L){
  let lo = 1, hi = Math.max(...L.orders), probes = 0;
  while (lo < hi){ const mid = (lo + hi) >> 1; probes++; if (minutesAt(L, mid) <= L.minutes) hi = mid; else lo = mid + 1; }
  return {k: lo, probes: probes + 1};
}
export function judgeSpeed(L, k){
  const ref = refSpeed(L), res = {ref};
  if (k < 1) return Object.assign(res, {status:"fail", title:"Robot can’t move", text:"Speed " + k + " isn’t possible. The robot needs a speed of at least 1."});
  const need = minutesAt(L, k); res.need = need;
  if (need > L.minutes) return Object.assign(res, {status:"fail", title:"Shift runs over", text:"At speed " + k + " the robot needs " + need + " minutes, but the shift is " + L.minutes + "."});
  if (k > ref.k) return Object.assign(res, {status:"fail", title:"Finishes, but not the slowest", text:"Speed " + k + " finishes in " + need + " minutes, but speed " + ref.k + " also finishes. Look for the smallest speed that works."});
  return Object.assign(res, {status:"pass", title:"Slowest safe speed found", text:"Speed " + k + " finishes in " + need + " of " + L.minutes + " minutes" + (k > 1 ? ", and speed " + (k - 1) + " would run over." : ".")});
}
export function resolveSpeed(w){
  if (!w) return {};
  const [, lo] = PICK(w, ["lo", "low", "left", "l"]);
  const [, hi] = PICK(w, ["hi", "high", "right", "r"]);
  const [, mid] = PICK(w, ["mid", "m", "k", "speed", "guess"]);
  return {lo, hi, mid};
}
let speedGeo = null;
export function sizeSpeed(w){
    const n = S.level.orders.length, pad = 8, gap = 6;
    const W = Math.max(300, Math.min(w, 560));
    const b = Math.max(22, Math.floor(Math.min(64, (W - 2*pad - gap*(n-1)) / n)));
    const rowW = n*b + gap*(n-1);
    const ox = Math.floor((W - rowW) / 2);
    const lineY = 62, barTop = 148, barH = 104;
    speedGeo = {n, b, gap, ox, W, pad, lineY, barTop, barH, H: barTop + barH + 66, rowW};
    return [W, speedGeo.H];
  }

export function drawSpeed(){
  if (!speedGeo) return;
  const g = speedGeo, L = S.level, n = L.orders.length, maxK = Math.max(...L.orders, 1);
  ctx.clearRect(0, 0, g.W, g.H);
  let idx = -1, reads = new Uint16Array(n), w = null, cur = null;
  if (S.run){
    idx = (S.t >= S.run.E ? S.run.E : Math.floor(S.t)) - 1;
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.i >= 0 && e.i < n) reads[e.i]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  const v = S.run && S.run.verdict;
  const showK = final ? (Number.isInteger(S.run.ret) ? S.run.ret : null) : (w && Number.isInteger(w.mid) && w.mid >= 1 ? w.mid : null);

  // speed gauge
  const x0 = g.pad + 10, x1 = g.W - g.pad - 10, ly = g.lineY;
  const kx = k => x0 + (Math.max(1, Math.min(maxK, k)) - 1) / Math.max(1, maxK - 1) * (x1 - x0);
  ctx.font = "600 13px Barlow, system-ui, sans-serif"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COL.ink; ctx.textAlign = "left"; ctx.fillText("Speed", x0 - 10, 16);
  ctx.textAlign = "right"; ctx.fillStyle = COL.muted; ctx.fillText("packages per minute", x1 + 10, 16);
  // range band
  if (!final && w && w.lo != null && w.hi != null){
    const a = kx(Math.min(w.lo, w.hi)), b2 = kx(Math.max(w.lo, w.hi));
    ctx.fillStyle = COL.visited; ctx.globalAlpha = .75; rr(a - 6, ly - 14, Math.max(12, b2 - a + 12), 28, 8); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = COL.frontier; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(a - 6 + 6, ly - 14); ctx.lineTo(a - 6, ly - 14); ctx.lineTo(a - 6, ly + 14); ctx.lineTo(a, ly + 14);
    ctx.moveTo(b2 + 6 - 6, ly - 14); ctx.lineTo(b2 + 6, ly - 14); ctx.lineTo(b2 + 6, ly + 14); ctx.lineTo(b2, ly + 14); ctx.stroke();
    ctx.fillStyle = COL.frontier; ctx.font = "700 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText("lo " + w.lo, a, ly + 18); if (Math.abs(b2 - a) > 30 || w.lo !== w.hi) ctx.fillText("hi " + w.hi, b2, ly + 18 + (Math.abs(b2 - a) < 34 ? 13 : 0));
  }
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x1, ly); ctx.stroke();
  const step = maxK <= 12 ? 1 : maxK <= 30 ? 5 : 10;
  ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.fillStyle = COL.muted; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  for (let k = 1; k <= maxK; k++){
    const major = k === 1 || k === maxK || k % step === 0;
    ctx.strokeStyle = COL.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(kx(k), ly - (major ? 6 : 3)); ctx.lineTo(kx(k), ly); ctx.stroke();
    if (major && !(k !== maxK && maxK - k < step * .6)) ctx.fillText(String(k), kx(k), ly - 8);
  }
  // tested speeds so far
  if (S.run){
    const seen = new Map();
    const upto = final ? S.run.E - 1 : idx;
    for (let i = 0; i <= upto; i++){ const m = S.run.probeAt[i]; if (m != null && Number.isInteger(m) && m >= 1 && m <= maxK) seen.set(m, true); }
    seen.forEach((_, k) => {
      ctx.fillStyle = minutesAt(L, k) <= L.minutes ? COL.target : COL.bad;
      ctx.beginPath(); ctx.arc(kx(k), ly, 4.5, 0, Math.PI*2); ctx.fill();
    });
  }
  // current / returned speed marker
  if (showK != null){
    const X = kx(showK), ok = minutesAt(L, Math.max(1, showK)) <= L.minutes;
    ctx.fillStyle = final ? (ok && v.status !== "fail" ? COL.target : COL.bad) : COL.flash;
    ctx.beginPath(); ctx.moveTo(X, ly - 5); ctx.lineTo(X - 8, ly - 19); ctx.lineTo(X + 8, ly - 19); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, ly, 7, 0, Math.PI*2); ctx.stroke();
  }

  // aisles
  const bx = i => g.ox + i*(g.b + g.gap);
  const k = showK != null ? Math.max(1, showK) : null;
  const need = k != null ? minutesAt(L, k) : null;
  // minutes gauge
  const gy = 106, gh = 22, gx = g.ox, gw = g.rowW;
  ctx.fillStyle = COL.floor; rr(gx, gy, gw, gh, 5); ctx.fill();
  const maxMin = Math.max(L.minutes * 1.25, 1);
  if (need != null){
    const over = need > L.minutes;
    ctx.fillStyle = over ? COL.bad : COL.visited; rr(gx, gy, Math.max(4, gw * Math.min(1, need / maxMin)), gh, 5); ctx.fill();
  }
  const lx = gx + gw * (L.minutes / maxMin);
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, gy - 2); ctx.lineTo(lx, gy + gh + 2); ctx.stroke();
  ctx.font = "600 13px Barlow, system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = COL.ink;
  ctx.fillText(need != null ? "At speed " + k + ": " + need + " of " + L.minutes + " min" : "Shift: " + L.minutes + " min", gx + 8, gy + gh/2 + 1);

  const maxO = Math.max(...L.orders, 1);
  for (let i = 0; i < n; i++){
    const x = bx(i), p = L.orders[i], h = Math.max(10, Math.round(g.barH * p / maxO)), base = g.barTop + g.barH + 8;
    // shelf upright
    ctx.fillStyle = COL.rack; rr(x, base - h, g.b, h, 3); ctx.fill();
    // minute bands: each band is one minute of picking at speed k
    if (k != null){
      const mins = Math.ceil(p / k), bandH = h / mins;
      ctx.strokeStyle = COL.beam; ctx.lineWidth = 2;
      if (mins <= 40) for (let m = 1; m < mins; m++){ const y = base - m*bandH; ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + g.b - 2, y); ctx.stroke(); }
      else { ctx.fillStyle = COL.beam; ctx.globalAlpha = .5; rr(x, base - h, g.b, h, 3); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.fillStyle = COL.ink; ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(mins + " min", x + g.b/2, base + 18);
    }
    const fs = Math.max(12, Math.min(17, Math.round(g.b*.34))), inside = h >= fs + 8;
    ctx.fillStyle = inside ? COL.panel : COL.ink; ctx.font = "700 " + fs + "px 'Barlow Condensed', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = inside ? "top" : "bottom";
    ctx.fillText(String(p), x + g.b/2, inside ? base - h + 3 : base - h - 3);
    if (cur && cur.i === i){ ctx.strokeStyle = COL.flash; ctx.lineWidth = 3.5; rr(x - 3, base - h - 3, g.b + 6, h + 6, 5); ctx.stroke(); }
    ctx.fillStyle = COL.muted; ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.textBaseline = "top"; ctx.fillText("aisle " + i, x + g.b/2, base + 3);
    // reads as a count
    if (reads[i]){ ctx.fillStyle = COL.muted; ctx.fillText(reads[i] + (reads[i] === 1 ? " read" : " reads"), x + g.b/2, base + 34); }
  }
  ctx.fillStyle = COL.belt; ctx.fillRect(g.ox - 6, g.barTop + g.barH + 8, g.rowW + 12, 3);
}


/* =====================================================================
   Generic views: arrays, intervals, task graphs, trees
   ===================================================================== */
