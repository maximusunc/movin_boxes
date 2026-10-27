import { COL, ctx, drawWatch, liveIndex, resultLine, rr } from "../canvas.js";
import { S } from "../state.js";

/* ---------- linked list (cart train) view ----------
   S.level.lists is an array of value lists; the harness numbers the nodes across all
   lists in order, and records every node.val / node.next read and every node.next write.
   Problems can set `pointers` (watched variable names that hold nodes). */
let chainGeo = null;
const POINTERS = ["head", "prev", "cur", "curr", "node", "nxt", "next_node", "tail", "slow", "fast", "dummy", "first", "second", "a", "b", "l1", "l2", "p", "q"];

function layout(lists){
  const pos = [], start = [];
  let id = 0;
  lists.forEach((vals, row) => { start.push(id); vals.forEach((v, col) => { pos[id] = {row, col, val: v, last: col === vals.length - 1}; id++; }); });
  return {pos, start, count: id};
}
export function sizeChain(w){
  const lists = S.level.lists, m = Math.max(1, ...lists.map(l => l.length));
  const W = Math.max(300, Math.min(w, 600)), pad = 12, gap = 24;
  const b = Math.max(22, Math.min(46, Math.floor((W - 2*pad - gap*(m - 1)) / m)));
  const rowH = b + 70, top = 34;
  chainGeo = {W, pad, gap, b, rowH, top, lay: layout(lists), rows: 2};
  chainGeo.panelY = top + lists.length*rowH;
  chainGeo.H = chainGeo.panelY + chainGeo.rows*30 + 30;
  return [W, chainGeo.H];
}
function curve(x1, y1, x2, y2, lift){
  const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - cy, x2 - cx);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 8*Math.cos(a - .45), y2 - 8*Math.sin(a - .45)); ctx.lineTo(x2 - 8*Math.cos(a + .45), y2 - 8*Math.sin(a + .45)); ctx.closePath(); ctx.fill();
}
export function drawChain(){
  if (!chainGeo) return;
  const g = chainGeo, lay = g.lay, b = g.b, n = lay.count;
  ctx.clearRect(0, 0, g.W, g.H);
  S.treeVals = lay.pos.map(p => p.val);
  const X = id => g.pad + lay.pos[id].col * (b + g.gap), Y = id => g.top + lay.pos[id].row * g.rowH + 18;
  // next pointers: start from the input order, then replay every write up to now
  const next = lay.pos.map((p, id) => p.last ? null : id + 1);
  const touched = new Uint16Array(n);
  const idx = liveIndex(); let cur = null, w = null;
  if (S.run){
    for (let i = 0; i <= idx; i++){
      const e = S.run.events[i]; if (e.k !== "node" || e.n < 0 || e.n >= n) continue;
      if (e.f === "s") next[e.n] = e.to != null && e.to >= 0 && e.to < n ? e.to : null;
      else touched[e.n]++;
    }
    if (idx >= 0){ w = S.run.wAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const final = S.run && S.run.hasRet && S.t >= S.run.E;
  ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = COL.muted;
  S.level.lists.forEach((l, row) => ctx.fillText((S.P.listLabels ? S.P.listLabels[row] : "train") + (l.length ? "" : " (empty)"), g.pad, g.top + row*g.rowH));
  // links
  for (let id = 0; id < n; id++){
    const to = next[id]; if (to == null) continue;
    const x1 = X(id) + b, y1 = Y(id) + b/2, x2 = X(to), y2 = Y(to) + b/2;
    const hot = cur && cur.n === id && cur.f === "s";
    ctx.strokeStyle = hot ? COL.flash : COL.ink; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = hot ? 3 : 1.6;
    const same = lay.pos[id].row === lay.pos[to].row;
    if (same && lay.pos[to].col === lay.pos[id].col + 1) curve(x1 + 2, y1, x2 - 2, y2, 0);
    else if (same) curve(X(id) + b/2, Y(id) - 2, X(to) + b/2, Y(to) - 2, 16 + Math.abs(lay.pos[to].col - lay.pos[id].col) * 6);
    else curve(X(id) + b/2, Y(id) + (lay.pos[to].row > lay.pos[id].row ? b + 2 : -2), X(to) + b/2, Y(to) + (lay.pos[to].row > lay.pos[id].row ? -2 : b + 2), 0);
  }
  // nodes
  for (let id = 0; id < n; id++){
    const x = X(id), y = Y(id);
    ctx.fillStyle = touched[id] ? COL.visited : COL.box; rr(x, y, b, b, 6); ctx.fill();
    ctx.strokeStyle = COL["box-edge"]; ctx.lineWidth = 1.5; rr(x + .75, y + .75, b - 1.5, b - 1.5, 6); ctx.stroke();
    if (cur && cur.n === id){ ctx.strokeStyle = COL.flash; ctx.lineWidth = 3.5; rr(x - 3, y - 3, b + 6, b + 6, 8); ctx.stroke(); }
    ctx.fillStyle = COL["box-ink"]; ctx.font = "700 " + Math.round(Math.min(18, b*.42)) + "px 'Barlow Condensed', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(lay.pos[id].val), x + b/2, y + b/2 + 1);
    if (next[id] == null){ ctx.fillStyle = COL.muted; ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.fillText("∅", x + b + 8, y + b/2); }
  }
  // pointer variables that hold a node
  if (w && !final){
    const used = {};
    for (const nm of (S.P.pointers || POINTERS)){
      const v = w[nm]; if (!v || typeof v !== "object" || v.n == null || v.n < 0 || v.n >= n) continue;
      const k = used[v.n] = (used[v.n] || 0) + 1, cx = X(v.n) + b/2, py = Y(v.n) + b + 8 + (k - 1)*13;
      ctx.fillStyle = COL.frontier; ctx.font = "700 11px Barlow, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText((k === 1 ? "▲ " : "") + nm, cx, py);
    }
  }
  drawWatch(g.pad, g.panelY, g.W - 2*g.pad, w, S.P.panel || [], g.rows);
  resultLine(g.pad, g.H - 14, g.W - 2*g.pad);
}
// For showRet: a returned list node arrives as {__ll: [values], ids, cycle}.
export function chainText(ret){
  if (ret && ret.__ll) return ret.__ll.length ? ret.__ll.join(" → ") + (ret.cycle ? " → … (loops)" : "") : "None";
  return null;
}
