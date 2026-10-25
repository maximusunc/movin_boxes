import { COL, ctx, drawWatch, liveIndex, resultLine, rr } from "../canvas.js";
import { S } from "../state.js";

/* ---------- array view ---------- */
let arrGeo = null;
export function sizeArray(w){
  const vals = S.P.arrayOf(S.level), n = vals.length, pad = 6, gap = 4;
  const W = Math.max(300, Math.min(w, 600));
  const b = Math.max(18, Math.floor(Math.min(52, (W - 2*pad - gap*(n-1)) / Math.max(1, n))));
  const rowW = n*b + gap*(n-1), ox = Math.floor((W - rowW) / 2);
  const rows = 3, y0 = 26;
  arrGeo = {n, b, gap, ox, W, y0, rows, panelY: y0 + b + 74, rowW};
  arrGeo.H = arrGeo.panelY + rows*30 + 30;
  return [W, arrGeo.H];
}
export function drawArray(){
  if (!arrGeo) return;
  const g = arrGeo, vals = S.P.arrayOf(S.level), n = vals.length, b = g.b;
  ctx.clearRect(0, 0, g.W, g.H);
  const idx = liveIndex();
  const reads = new Uint16Array(n); let cur = null, w = null;
  if (S.run){
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.a === S.P.arrArg && e.i >= 0 && e.i < n) reads[e.i]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  const bx = i => g.ox + i*(b + g.gap);
  ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = COL.muted;
  ctx.fillText(S.P.arrLabel2 || "input", g.ox, 10);
  if (S.P.extraLabel){ ctx.textAlign = "right"; ctx.fillStyle = COL.ink; ctx.fillText(S.P.extraLabel(S.level), g.ox + g.rowW, 10); }
  // marked indices (e.g. a stack of indices)
  const marked = new Set();
  if (w && S.P.markLists) for (const nm of S.P.markLists){ const v = w[nm]; const items = Array.isArray(v) ? v : (v && v.__s) ? v.__s : null; if (items) items.forEach(x => { if (typeof x === "number" && x >= 0 && x < n) marked.add(x); }); }
  const hi = final && S.P.highlight ? S.P.highlight(S.run.ret, S.level) : null;
  for (let i = 0; i < n; i++){
    const x = bx(i), y = g.y0;
    ctx.fillStyle = COL.box; rr(x, y, b, b, 4); ctx.fill();
    ctx.strokeStyle = COL["box-edge"]; ctx.lineWidth = 1.5; rr(x + .75, y + .75, b - 1.5, b - 1.5, 4); ctx.stroke();
    if (marked.has(i) && !final){ ctx.strokeStyle = COL.frontier; ctx.lineWidth = 3; rr(x - 1.5, y - 1.5, b + 3, b + 3, 5); ctx.stroke(); }
    if (hi && hi.has(i)){ ctx.strokeStyle = S.run.verdict.status === "fail" ? COL.bad : COL.target; ctx.lineWidth = 3; rr(x - 2, y - 2, b + 4, b + 4, 6); ctx.stroke(); }
    if (cur && cur.a === S.P.arrArg && cur.i === i){ ctx.strokeStyle = COL.flash; ctx.lineWidth = 3.5; rr(x - 3, y - 3, b + 6, b + 6, 6); ctx.stroke(); }
    const txt = Array.isArray(vals[i]) ? vals[i].join("–") : String(vals[i]);
    let fs = Math.max(10, Math.min(18, Math.round(b * .4)));
    ctx.font = "700 " + fs + "px 'Barlow Condensed', system-ui, sans-serif";
    while (ctx.measureText(txt).width > b - 4 && fs > 9){ fs--; ctx.font = "700 " + fs + "px 'Barlow Condensed', system-ui, sans-serif"; }
    ctx.fillStyle = COL["box-ink"]; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(txt, x + b/2, y + b/2 + 1);
    ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.fillStyle = COL.muted; ctx.textBaseline = "top";
    ctx.fillText(String(i), x + b/2, y + b + 4);
    const k = reads[i];
    if (k){
      const per = Math.max(1, Math.floor((b - 2) / 7)), cap = per * 2;
      ctx.fillStyle = COL.ink;
      for (let d = 0; d < Math.min(k, cap); d++){ ctx.beginPath(); ctx.arc(x + b/2 - (per - 1)*3.5 + (d % per)*7, y + b + 22 + Math.floor(d / per)*7, 2.3, 0, Math.PI*2); ctx.fill(); }
      if (k > cap){ ctx.fillStyle = COL.bad; ctx.font = "700 11px Barlow, system-ui, sans-serif"; ctx.fillText("+" + (k - cap), x + b/2, y + b + 34); }
    }
  }
  // pointers
  if (w && !final){
    const py = g.y0 + b + 52, used = {};
    for (const nm of (S.P.pointers || [])){
      const v = w[nm]; if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v >= n) continue;
      const k = used[v] = (used[v] || 0) + 1;
      const cx = bx(v) + b/2 + (k - 1) * 14 - (k > 1 ? 7 : 0);
      ctx.fillStyle = COL.frontier; ctx.beginPath(); ctx.moveTo(cx, py - 8); ctx.lineTo(cx - 6, py); ctx.lineTo(cx + 6, py); ctx.closePath(); ctx.fill();
      ctx.font = "700 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(nm, cx, py + 2);
    }
  }
  drawWatch(g.ox, g.panelY, Math.max(g.rowW, 280), w, S.P.panel || [], g.rows);
  resultLine(g.ox, g.H - 14, g.W - 2*g.ox);
}
