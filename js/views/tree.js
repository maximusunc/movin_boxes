import { COL, ctx, drawWatch, liveIndex, resultLine } from "../canvas.js";
import { S } from "../state.js";

/* ---------- tree view ---------- */
let treeGeo = null;
function treeLayout(vals){
  const nodes = [];
  vals.forEach((v, i) => { if (v !== null) nodes[i] = {id:i, val:v, l:null, r:null, depth:0}; });
  // rebuild links exactly like the harness does (level order with gaps)
  const q = []; let i = 1;
  if (nodes[0]) q.push(nodes[0]);
  while (q.length && i < vals.length){
    const cur = q.shift();
    if (i < vals.length){ if (nodes[i]){ cur.l = nodes[i]; nodes[i].depth = cur.depth + 1; q.push(nodes[i]); } i++; }
    if (i < vals.length){ if (nodes[i]){ cur.r = nodes[i]; nodes[i].depth = cur.depth + 1; q.push(nodes[i]); } i++; }
  }
  let k = 0; const walk = nd => { if (!nd) return; walk(nd.l); nd.ord = k++; walk(nd.r); };
  walk(nodes[0]);
  return {nodes: nodes.filter(Boolean), count: k, depth: Math.max(0, ...nodes.filter(Boolean).map(n => n.depth))};
}
export function sizeTree(w){
  const lay = treeLayout(S.level.tree);
  const W = Math.max(300, Math.min(w, 600)), levH = 54, top = 26;
  treeGeo = {W, lay, levH, top, th: top + (lay.depth + 1)*levH, rows: 3};
  treeGeo.panelY = treeGeo.th + 4; treeGeo.H = treeGeo.panelY + treeGeo.rows*30 + 30;
  return [W, treeGeo.H];
}
export function drawTree(){
  if (!treeGeo) return;
  const g = treeGeo, lay = g.lay, pad = 22;
  ctx.clearRect(0, 0, g.W, g.H);
  S.treeVals = []; lay.nodes.forEach(nd => S.treeVals[nd.id] = nd.val);
  const X = nd => pad + (lay.count <= 1 ? (g.W - 2*pad)/2 : nd.ord * (g.W - 2*pad) / (lay.count - 1));
  const Y = nd => g.top + nd.depth * g.levH + 16;
  const r = Math.max(13, Math.min(18, (g.W - 2*pad) / Math.max(1, lay.count) / 2 - 1));
  const idx = liveIndex(); let cur = null, w = null; const touched = new Uint16Array(S.level.tree.length);
  if (S.run){
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (e.k === "node" && e.f === "v") touched[e.n]++; }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  ctx.strokeStyle = COL.muted; ctx.lineWidth = 1.5;
  lay.nodes.forEach(nd => { [nd.l, nd.r].forEach(ch => { if (!ch) return; ctx.beginPath(); ctx.moveTo(X(nd), Y(nd)); ctx.lineTo(X(ch), Y(ch)); ctx.stroke(); }); });
  const held = new Set();
  if (w && !final) for (const nm of ["stack", "queue", "q", "node", "cur", "curr", "prev"]){
    const v = w[nm]; const items = Array.isArray(v) ? v : (v ? [v] : []);
    items.forEach(x => { if (x && x.n !== undefined) held.add(x.n); if (Array.isArray(x)) x.forEach(y => { if (y && y.n !== undefined) held.add(y.n); }); });
  }
  const bad = final && S.run.verdict.badNode != null ? S.run.verdict.badNode : null;
  lay.nodes.forEach(nd => {
    const x = X(nd), y = Y(nd);
    ctx.fillStyle = touched[nd.id] ? COL.visited : COL.box; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = held.has(nd.id) ? COL.frontier : COL["box-edge"]; ctx.lineWidth = held.has(nd.id) ? 3.5 : 1.5; ctx.stroke();
    if (cur && cur.n === nd.id){ ctx.strokeStyle = COL.flash; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI*2); ctx.stroke(); }
    if (bad === nd.id){ ctx.strokeStyle = COL.bad; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, Math.PI*2); ctx.stroke(); }
    ctx.fillStyle = COL["box-ink"]; ctx.font = "700 " + Math.round(r*.95) + "px 'Barlow Condensed', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(nd.val), x, y + 1);
    if (touched[nd.id] > 1){ ctx.fillStyle = COL.bad; ctx.font = "700 10px Barlow, system-ui, sans-serif"; ctx.fillText("×" + touched[nd.id], x + r + 6, y - r + 2); }
  });
  if (bad != null && S.t >= S.run.T){ ctx.fillStyle = COL.bad; ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("this node breaks the sorting rule", 10, 6); }
  drawWatch(10, g.panelY, g.W - 20, w, S.P.panel || [], g.rows);
  resultLine(10, g.H - 14, g.W - 20);
}

/* =====================================================================
   Problems, by tier
   ===================================================================== */
