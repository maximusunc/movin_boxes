import { COL, ctx, drawWatch, liveIndex, resultLine, rr } from "../canvas.js";
import { S } from "../state.js";

/* ---------- intervals view ---------- */
let ivGeo = null;
export function sizeIntervals(w){
  const tr = S.level.trucks, n = tr.length;
  const W = Math.max(300, Math.min(w, 600)), pad = 10;
  const rowH = Math.max(16, Math.min(26, Math.floor(220 / Math.max(1, n))));
  const axisY = 30, top = 44;
  ivGeo = {W, pad, rowH, axisY, top, n, panelY: top + n*rowH + 16, rows: 3};
  ivGeo.H = ivGeo.panelY + ivGeo.rows*30 + 30;
  return [W, ivGeo.H];
}
export function drawIntervals(){
  if (!ivGeo) return;
  const g = ivGeo, tr = S.level.trucks, n = tr.length;
  ctx.clearRect(0, 0, g.W, g.H);
  const maxT = Math.max(...tr.map(x => x[1]), 1), x0 = g.pad + 34, x1 = g.W - g.pad - 6;
  const tx = v => x0 + v / maxT * (x1 - x0);
  const idx = liveIndex(); let cur = null, w = null; const reads = new Uint16Array(n);
  if (S.run){
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.a === 0 && e.i >= 0 && e.i < n) reads[e.i]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  // axis
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, g.axisY); ctx.lineTo(x1, g.axisY); ctx.stroke();
  const step = maxT <= 12 ? 1 : maxT <= 30 ? 5 : 10;
  ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.fillStyle = COL.muted; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  for (let v = 0; v <= maxT; v += step){ ctx.beginPath(); ctx.moveTo(tx(v), g.axisY - 4); ctx.lineTo(tx(v), g.axisY); ctx.stroke(); ctx.fillText(String(v), tx(v), g.axisY - 6); }
  ctx.textAlign = "left"; ctx.fillText("time", g.pad, g.axisY - 6);
  // busy-until markers from a heap of end times
  if (w && !(S.run && S.t >= S.run.E)) for (const nm of ["heap", "ends", "active", "docks", "rooms", "busy"]){
    const v = w[nm]; if (!Array.isArray(v)) continue;
    v.forEach(x => { const val = Array.isArray(x) ? x[0] : x; if (typeof val !== "number") return; const X = tx(Math.max(0, Math.min(maxT, val)));
      ctx.fillStyle = COL.frontier; ctx.beginPath(); ctx.moveTo(X, g.axisY + 2); ctx.lineTo(X - 5, g.axisY + 10); ctx.lineTo(X + 5, g.axisY + 10); ctx.closePath(); ctx.fill(); });
    break;
  }
  for (let i = 0; i < n; i++){
    const [a, b2] = tr[i], y = g.top + i*g.rowH;
    ctx.fillStyle = COL.muted; ctx.font = "500 11px Barlow, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    ctx.fillText("#" + i, x0 - 8, y + g.rowH/2);
    ctx.fillStyle = reads[i] ? COL.visited : COL.box; rr(tx(a), y + 2, Math.max(4, tx(b2) - tx(a)), g.rowH - 4, 4); ctx.fill();
    ctx.strokeStyle = COL["box-edge"]; ctx.lineWidth = 1; rr(tx(a) + .5, y + 2.5, Math.max(3, tx(b2) - tx(a) - 1), g.rowH - 5, 4); ctx.stroke();
    if (cur && cur.a === 0 && cur.i === i){ ctx.strokeStyle = COL.flash; ctx.lineWidth = 3; rr(tx(a) - 2, y, Math.max(8, tx(b2) - tx(a) + 4), g.rowH, 5); ctx.stroke(); }
    if (g.rowH >= 18){ ctx.fillStyle = COL["box-ink"]; ctx.font = "600 11px Barlow, system-ui, sans-serif"; ctx.textAlign = "left"; if (tx(b2) - tx(a) > 34) ctx.fillText(a + "–" + b2, tx(a) + 5, y + g.rowH/2 + 1); }
  }
  // final: show the busiest moment
  if (S.run && S.run.hasRet && S.t >= S.run.E && S.run.verdict.peakAt != null){
    const X = tx(S.run.verdict.peakAt);
    ctx.strokeStyle = COL.target; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, g.axisY); ctx.lineTo(X, g.top + n*g.rowH); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = COL.target; ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = X > g.W/2 ? "right" : "left"; ctx.textBaseline = "top";
    ctx.fillText("busiest: " + S.run.verdict.ref + " trucks at time " + S.run.verdict.peakAt, X + (X > g.W/2 ? -6 : 6), g.top + n*g.rowH + 2);
  }
  drawWatch(g.pad, g.panelY + 8, g.W - 2*g.pad, w, S.P.panel || [], g.rows);
  resultLine(g.pad, g.H - 14, g.W - 2*g.pad);
}
