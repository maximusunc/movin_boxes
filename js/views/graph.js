import { COL, ctx, drawWatch, liveIndex, resultLine } from "../canvas.js";
import { S } from "../state.js";

/* ---------- graph view ----------
   Problems describe their graph with optional hooks (defaults fit the task-order problem):
     graphOf(L) -> {n, edges}   edges are [a, b] or [a, b, weight]; default {n: L.n, edges: L.deps}
     edgeArg                    index of the solve() argument holding the edges (default 1)
     directed                   draw arrowheads (default true)
     retOrder                   treat the returned list as a visiting order (badges on nodes)
     retEdges(ret, L)           Set of edge indices to highlight in the final frame
     nodeLabels                 {names: [...watched vars], prefix: "in "} drawn under each node
*/
let graphGeo = null;
export function sizeGraph(w){
  const W = Math.max(300, Math.min(w, 520)), gh = Math.round(Math.min(W * .72, 330));
  graphGeo = {W, gh, rows: 3, panelY: gh + 8};
  graphGeo.H = graphGeo.panelY + graphGeo.rows*30 + 30;
  return [W, graphGeo.H];
}
function graphPos(n){
  const g = graphGeo, cx = g.W/2, cy = g.gh/2 + 4, R = Math.min(g.W, g.gh)/2 - 30;
  return Array.from({length:n}, (_, i) => [cx + R*Math.cos(-Math.PI/2 + i*2*Math.PI/n), cy + R*Math.sin(-Math.PI/2 + i*2*Math.PI/n)]);
}
function arrow(x1, y1, x2, y2, r){
  const a = Math.atan2(y2 - y1, x2 - x1), sx = x1 + Math.cos(a)*r, sy = y1 + Math.sin(a)*r, ex = x2 - Math.cos(a)*(r + 2), ey = y2 - Math.sin(a)*(r + 2);
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 9*Math.cos(a - .4), ey - 9*Math.sin(a - .4)); ctx.lineTo(ex - 9*Math.cos(a + .4), ey - 9*Math.sin(a + .4)); ctx.closePath(); ctx.fill();
}
export function drawGraph(){
  if (!graphGeo) return;
  const G = S.P.graphOf ? S.P.graphOf(S.level) : {n: S.level.n, edges: S.level.deps};
  const g = graphGeo, n = G.n, deps = G.edges, pos = graphPos(n), r = 17, arg = S.P.edgeArg != null ? S.P.edgeArg : 1, directed = S.P.directed !== false;
  ctx.clearRect(0, 0, g.W, g.H);
  const idx = liveIndex(); let cur = null, w = null; const reads = new Uint16Array(deps.length);
  if (S.run){
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.a === arg && e.i >= 0 && e.i < deps.length) reads[e.i]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  const picked = final && S.P.retEdges ? S.P.retEdges(S.run.ret, S.level) : null;
  deps.forEach(([a, b, wt], i) => {
    if (a < 0 || b < 0 || a >= n || b >= n) return;
    const hot = cur && cur.a === arg && cur.i === i, pick = picked && picked.has(i);
    ctx.strokeStyle = pick ? (S.run.verdict.status === "fail" ? COL.bad : COL.target) : hot ? COL.flash : reads[i] ? COL.ink : COL.muted; ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = pick || hot ? 3.5 : reads[i] ? 2 : 1.3; ctx.globalAlpha = pick || hot || reads[i] ? 1 : .6;
    if (directed) arrow(pos[a][0], pos[a][1], pos[b][0], pos[b][1], r);
    else { ctx.beginPath(); ctx.moveTo(pos[a][0], pos[a][1]); ctx.lineTo(pos[b][0], pos[b][1]); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (wt != null){
      const mx = (pos[a][0] + pos[b][0]) / 2, my = (pos[a][1] + pos[b][1]) / 2, t = String(wt);
      ctx.font = "600 11px Barlow, system-ui, sans-serif"; const tw = ctx.measureText(t).width + 8;
      ctx.fillStyle = COL.panel; ctx.fillRect(mx - tw/2, my - 8, tw, 16);
      ctx.fillStyle = pick ? ctx.strokeStyle : COL.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, mx, my + .5);
    }
  });
  const pick = names => { if (!w) return null; for (const nm of names) if (w[nm] !== undefined) return w[nm]; return null; };
  const listOf = v => Array.isArray(v) ? v : (v && v.__s) ? v.__s : (v && v.__d) ? v.__d.map(x => x[0]) : null;
  const order = final ? (S.P.retOrder && Array.isArray(S.run.ret) ? S.run.ret : []) : (listOf(pick(["order", "res", "result", "ans", "output"])) || []);
  const queue = final ? [] : (listOf(pick(["queue", "q", "ready", "stack", "frontier"])) || []);
  const labels = S.P.nodeLabels || {names: ["indeg", "indegree", "in_degree", "indegrees", "deg"], prefix: "in "};
  let indeg = final ? null : pick(labels.names);
  if (indeg && indeg.__d){ const arr = Array(n).fill(null); indeg.__d.forEach(([k, v]) => { if (typeof k === "number" && k >= 0 && k < n) arr[k] = v; }); indeg = arr; }
  const ordPos = new Map(); order.forEach((x, i) => { if (typeof x === "number" && !ordPos.has(x)) ordPos.set(x, i); });
  const inQ = new Set(queue.filter(x => typeof x === "number"));
  for (let i = 0; i < n; i++){
    const [x, y] = pos[i];
    ctx.fillStyle = ordPos.has(i) ? (final && S.run.verdict.status === "fail" ? COL.bad : COL.visited) : COL.box;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = inQ.has(i) ? COL.frontier : COL["box-edge"]; ctx.lineWidth = inQ.has(i) ? 3.5 : 1.5; ctx.stroke();
    ctx.fillStyle = COL["box-ink"]; ctx.font = "700 15px 'Barlow Condensed', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(i), x, y + 1);
    if (ordPos.has(i)){
      const bx = x + r*.8, by = y - r*.8;
      ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = COL.panel; ctx.font = "700 11px Barlow, system-ui, sans-serif"; ctx.fillText(String(ordPos.get(i) + 1), bx, by + .5);
    }
    if (Array.isArray(indeg) && typeof indeg[i] === "number"){
      ctx.fillStyle = COL.frontier; ctx.font = "700 11px Barlow, system-ui, sans-serif"; ctx.fillText(labels.prefix + indeg[i], x, y + r + 9);
    }
  }
  drawWatch(10, g.panelY, g.W - 20, w, S.P.panel || [], g.rows);
  resultLine(10, g.H - 14, g.W - 20);
}
