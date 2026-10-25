import { COL, ctx, drawRobot, rr } from "../canvas.js";
import { S } from "../state.js";
import { DIRS, fmt, same } from "../util.js";

export const isShelf1 = v => v === 1;
export function refBFS(L, isShelf = isShelf1){
  const R = L.grid.length, C = L.grid[0].length;
  const dist = Array.from({length:R}, () => Array(C).fill(-1));
  const par = Array.from({length:R}, () => Array(C).fill(null));
  const [sr, sc] = L.start; dist[sr][sc] = 0;
  const q = [[sr, sc]]; let h = 0;
  while (h < q.length){
    const [r, c] = q[h++];
    for (const [dr, dc] of DIRS){
      const nr = r+dr, nc = c+dc;
      if (nr<0||nc<0||nr>=R||nc>=C||isShelf(L.grid[nr][nc])||dist[nr][nc]!==-1) continue;
      dist[nr][nc] = dist[r][c]+1; par[nr][nc] = [r, c]; q.push([nr, nc]);
    }
  }
  const [tr, tc] = L.target; const d = dist[tr][tc];
  let path = null;
  if (d >= 0){ path = []; let cur = [tr, tc]; while (cur){ path.push(cur); cur = par[cur[0]][cur[1]]; } path.reverse(); }
  return {d, path, explored: q.length};
}
function refDijkstra(L){
  const R = L.grid.length, C = L.grid[0].length, INF = 1e9;
  const dist = Array.from({length:R}, () => Array(C).fill(INF));
  const par = Array.from({length:R}, () => Array(C).fill(null));
  const done = Array.from({length:R}, () => Array(C).fill(false));
  const [sr, sc] = L.start; dist[sr][sc] = 0;
  let explored = 0;
  for (;;){
    let best = INF, br = -1, bc = -1;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (!done[r][c] && dist[r][c] < best){ best = dist[r][c]; br = r; bc = c; }
    if (br < 0) break;
    done[br][bc] = true; explored++;
    if (br === L.target[0] && bc === L.target[1]) break;
    for (const [dr, dc] of DIRS){
      const nr = br+dr, nc = bc+dc;
      if (nr<0||nc<0||nr>=R||nc>=C||L.grid[nr][nc] < 0) continue;
      const nd = best + L.grid[nr][nc];
      if (nd < dist[nr][nc]){ dist[nr][nc] = nd; par[nr][nc] = [br, bc]; }
    }
  }
  const [tr, tc] = L.target; const d = dist[tr][tc] >= INF ? -1 : dist[tr][tc];
  let path = null;
  if (d >= 0){ path = []; let cur = [tr, tc]; while (cur){ path.push(cur); cur = par[cur[0]][cur[1]]; } path.reverse(); }
  return {d, path, explored};
}
const pathCost = (L, P) => P.slice(1).reduce((a, p) => a + L.grid[p[0]][p[1]], 0);
export function judgeGrid(L, path, wet){
  const isShelf = wet ? (v => v < 0) : isShelf1;
  const ref = wet ? refDijkstra(L) : refBFS(L);
  const R = L.grid.length, C = L.grid[0].length;
  const res = {ref, valid: 0, bad: null};
  if (path.length === 0){
    if (ref.d < 0) return Object.assign(res, {status:"pass", title:"Correct", text:"The target is walled off, and you returned an empty path."});
    return Object.assign(res, {status:"fail", title:"No path returned", text:"You returned [], but the target is reachable" + (wet ? " for a cost of " + ref.d + "." : " in " + ref.d + " moves.")});
  }
  const p0 = path[0];
  if (!same(p0, L.start))
    return Object.assign(res, {status:"fail", title:"Wrong starting cell", text:"The path should begin at the robot’s cell " + fmt(L.start) + ", but it begins at " + fmt(p0) + "."});
  for (let i = 1; i < path.length; i++){
    const a = path[i-1], b = path[i];
    const out = b[0]<0||b[1]<0||b[0]>=R||b[1]>=C;
    const man = Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
    let why = null;
    if (out) why = "Step " + i + " drives off the floor to " + fmt(b) + ".";
    else if (man === 0) why = "Step " + i + " stays put at " + fmt(b) + ". Each step should move one cell.";
    else if (man === 2 && a[0] !== b[0] && a[1] !== b[1]) why = "Step " + i + " moves diagonally from " + fmt(a) + " to " + fmt(b) + ". Only up, down, left and right are allowed.";
    else if (man !== 1) why = "Step " + i + " jumps from " + fmt(a) + " to " + fmt(b) + ", which isn’t a neighboring cell.";
    else if (isShelf(L.grid[b[0]][b[1]])) why = "Step " + i + " drives into the shelf at " + fmt(b) + ".";
    if (why){ res.valid = i-1; res.bad = {i}; return Object.assign(res, {status:"fail", title:"Robot crashed", text:why}); }
  }
  res.valid = path.length-1;
  const last = path[path.length-1];
  if (!same(last, L.target)){
    if (ref.d < 0) return Object.assign(res, {status:"fail", title:"Wrong ending", text:"The path ends at " + fmt(last) + ". The target can’t be reached, so return []."});
    return Object.assign(res, {status:"fail", title:"Stopped short", text:"The path ends at " + fmt(last) + ", not at the target " + fmt(L.target) + "."});
  }
  const moves = path.length-1;
  if (wet){
    const cost = pathCost(L, path); res.cost = cost;
    if (cost > ref.d){
      const fewest = refBFS(L, v => v < 0).d;
      const hint = moves === fewest ? " It takes the fewest moves, which is what BFS finds, but wet cells cost more. Pop the cheapest cell first." : "";
      return Object.assign(res, {status:"long", title:"Reached it, but not the cheapest", text:"Your path costs " + cost + ". The cheapest costs " + ref.d + "." + hint});
    }
    return Object.assign(res, {status:"pass", title:"Cheapest path found", text:"The robot reached the target for a cost of " + cost + " in " + moves + " moves, the cheapest possible."});
  }
  if (moves > ref.d) return Object.assign(res, {status:"long", title:"Valid, but not the shortest", text:"Your path takes " + moves + " moves. The shortest takes " + ref.d + ", so yours is " + (moves-ref.d) + " longer."});
  return Object.assign(res, {status:"pass", title:"Shortest path found", text:"The robot reached the target in " + moves + " moves, the minimum possible."});
}


export function drawGrid(){
  const G = S.level.grid, R = G.length, C = G[0].length, s = S.cell, shelf = S.P.isShelf, wet = S.P.id === "wet";
  const inb = (r, c) => r >= 0 && c >= 0 && r < R && c < C;
  let idx = -1, reads = null, writes = null, vis = null, que = null, cur = null, dst = null;
  if (S.run){
    idx = Math.min(Math.floor(S.t), S.run.E) - 1;
    if (S.t >= S.run.E) idx = S.run.E - 1;
    reads = new Uint16Array(R*C); writes = new Uint8Array(R*C);
    for (let i = 0; i <= idx; i++){ const e = S.run.events[i]; if (!inb(e.r, e.c)) continue; if (e.k === "read") reads[e.r*C+e.c]++; else writes[e.r*C+e.c] = 1; }
    if (idx >= 0){ vis = S.run.vAt[idx]; que = S.run.qAt[idx]; if (S.run.dAt) dst = S.run.dAt[idx]; if (S.t < S.run.E) cur = S.run.events[idx]; }
  }
  const visSet = new Uint8Array(R*C);
  if (vis) for (const p of vis) if (inb(p[0], p[1])) visSet[p[0]*C+p[1]] = 1;
  if (writes) for (let i = 0; i < writes.length; i++) if (writes[i]) visSet[i] = 1;

  ctx.fillStyle = COL.floor; ctx.fillRect(0, 0, C*s, R*s);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
    const k = r*C+c;
    if (shelf(G[r][c])) continue;
    if (visSet[k]){ ctx.fillStyle = COL.visited; ctx.fillRect(c*s, r*s, s, s); }
    else if (reads && reads[k]){ ctx.fillStyle = COL.checked; ctx.fillRect(c*s, r*s, s, s); }
    if (wet && G[r][c] > 1){
      ctx.fillStyle = COL.wet; ctx.globalAlpha = visSet[k] || (reads && reads[k]) ? .7 : 1;
      ctx.beginPath(); ctx.ellipse(c*s + s*.5, r*s + s*.52, s*.4, s*.3, -.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c*s + s*.3, r*s + s*.3, s*.16, s*.12, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (wet){
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "600 " + Math.max(9, Math.round(s*.24)) + "px Barlow, system-ui, sans-serif";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
      if (shelf(G[r][c]) || G[r][c] <= 1) continue;
      ctx.fillStyle = COL.ink; ctx.globalAlpha = .85;
      ctx.fillText(String(G[r][c]), c*s + s*.08, r*s + s*.06);
    }
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = COL.seam; ctx.lineWidth = 1; ctx.beginPath();
  for (let r = 1; r < R; r++){ ctx.moveTo(0, r*s+.5); ctx.lineTo(C*s, r*s+.5); }
  for (let c = 1; c < C; c++){ ctx.moveTo(c*s+.5, 0); ctx.lineTo(c*s+.5, R*s); }
  ctx.stroke();
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
    if (!shelf(G[r][c])) continue;
    const x = c*s, y = r*s, p = Math.max(2, s*.08);
    ctx.fillStyle = COL.rack; rr(x+p, y+p, s-2*p, s-2*p, Math.max(2, s*.08)); ctx.fill();
    ctx.fillStyle = COL.beam; const bh = Math.max(2, s*.07);
    ctx.fillRect(x+p, y+s*.33-bh/2, s-2*p, bh); ctx.fillRect(x+p, y+s*.66-bh/2, s-2*p, bh);
    if (visSet[r*C+c]){ ctx.fillStyle = COL.visited; ctx.globalAlpha = .7; rr(x+p, y+p, s-2*p, s-2*p, Math.max(2, s*.08)); ctx.fill(); ctx.globalAlpha = 1; }
    else if (reads && reads[r*C+c]){ ctx.fillStyle = COL.checked; ctx.globalAlpha = .45; rr(x+p, y+p, s-2*p, s-2*p, Math.max(2, s*.08)); ctx.fill(); ctx.globalAlpha = 1; }
  }
  const [sr, sc] = S.level.start, [tr, tc] = S.level.target;
  if (S.P.robot){
  ctx.setLineDash([Math.max(3, s*.12), Math.max(2, s*.08)]);
  ctx.strokeStyle = COL.dock; ctx.lineWidth = Math.max(1.5, s*.05);
  rr(sc*s+s*.12, sr*s+s*.12, s*.76, s*.76, s*.12); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = COL.target; rr(tc*s+s*.16, tr*s+s*.16, s*.68, s*.68, s*.1); ctx.fill();
  ctx.strokeStyle = COL.floor; ctx.lineWidth = Math.max(1.5, s*.06);
  ctx.beginPath(); ctx.moveTo(tc*s+s*.16, tr*s+s*.16); ctx.lineTo(tc*s+s*.84, tr*s+s*.84); ctx.moveTo(tc*s+s*.84, tr*s+s*.16); ctx.lineTo(tc*s+s*.16, tr*s+s*.84); ctx.stroke();
  ctx.strokeStyle = COL.target; ctx.lineWidth = Math.max(1.5, s*.05); rr(tc*s+s*.16, tr*s+s*.16, s*.68, s*.68, s*.1); ctx.stroke();
  }

  if (que && S.t < S.run.E){
    ctx.strokeStyle = COL.frontier; ctx.lineWidth = Math.max(2, s*.08);
    for (const p of que) if (inb(p[0], p[1])){ const i = ctx.lineWidth/2 + 1; rr(p[1]*s+i, p[0]*s+i, s-2*i, s-2*i, s*.1); ctx.stroke(); }
  }
  if (dst && S.t < S.run.E){
    ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.font = "700 " + Math.max(10, Math.round(s*.3)) + "px 'Barlow Condensed', system-ui, sans-serif";
    ctx.fillStyle = COL.ink;
    for (const [r, c, d] of dst){ if (!inb(r, c) || (r === S.level.start[0] && c === S.level.start[1] && d === 0)) continue; ctx.fillText(String(Math.round(d*10)/10), c*s + s - s*.08, r*s + s - s*.04); }
  }
  if (cur && inb(cur.r, cur.c)){
    ctx.strokeStyle = COL.flash; ctx.lineWidth = Math.max(3, s*.12);
    const i = ctx.lineWidth/2; rr(cur.c*s+i, cur.r*s+i, s-2*i, s-2*i, s*.12); ctx.stroke();
  }

  let rpos = [sr, sc], heading = 0, shake = 0, crashAt = null;
  if (S.P.path && S.run && S.run.hasRet && S.run.verdict && S.run.verdict.ref && S.t >= S.run.E && Array.isArray(S.run.ret)){
    const P = S.run.ret, v = S.run.verdict;
    const u = Math.min(S.t - S.run.E, S.run.S), k = Math.floor(u), f = u - k;
    const drawn = Math.min(k + (k < v.valid ? f : 0), v.valid);
    ctx.strokeStyle = COL.robot; ctx.lineWidth = Math.max(3, s*.14); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.globalAlpha = .55; ctx.beginPath(); ctx.moveTo(P[0][1]*s+s/2, P[0][0]*s+s/2);
    for (let i = 1; i <= Math.floor(drawn); i++) ctx.lineTo(P[i][1]*s+s/2, P[i][0]*s+s/2);
    const fl = Math.floor(drawn), fr = drawn - fl;
    if (fr > 0 && P[fl+1]) ctx.lineTo((P[fl][1] + (P[fl+1][1]-P[fl][1])*fr)*s+s/2, (P[fl][0] + (P[fl+1][0]-P[fl][0])*fr)*s+s/2);
    ctx.stroke(); ctx.globalAlpha = 1;
    if (P.length && k < v.valid){
      const a = P[k], b = P[k+1];
      rpos = [a[0] + (b[0]-a[0])*f, a[1] + (b[1]-a[1])*f]; heading = Math.atan2(b[0]-a[0], b[1]-a[1]);
    } else if (v.bad && k === v.valid && u < S.run.S){
      const a = P[v.valid], b = P[v.bad.i];
      let dr = b[0]-a[0], dc = b[1]-a[1]; const m = Math.hypot(dr, dc) || 1; dr /= m; dc /= m;
      const push = f < .5 ? f*2*.42 : (1-f)*2*.42;
      rpos = [a[0] + dr*push, a[1] + dc*push]; heading = Math.atan2(dr, dc);
      if (f > .45) shake = Math.sin(f*40) * .06 * (1-f);
      crashAt = b;
    } else if (P.length){
      const last = P[Math.min(v.valid, P.length-1)]; rpos = last.slice();
      if (v.valid > 0){ const pr = P[v.valid-1]; heading = Math.atan2(last[0]-pr[0], last[1]-pr[1]); }
      if (v.bad) crashAt = P[v.bad.i];
    }
    if (S.t >= S.run.T && v.status !== "pass" && v.ref.path && !(wet && v.cost === v.ref.d)){
      ctx.setLineDash([s*.15, s*.15]); ctx.strokeStyle = COL.target; ctx.lineWidth = Math.max(2, s*.07);
      ctx.beginPath(); v.ref.path.forEach((p, i) => { const X = p[1]*s+s/2, Y = p[0]*s+s/2; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    if (crashAt && (S.t >= S.run.T || (k === v.valid && f > .4))){
      const [cr, cc] = crashAt;
      const X = Math.max(0, Math.min(C-1, cc))*s + s/2, Y = Math.max(0, Math.min(R-1, cr))*s + s/2, z = s*.22;
      ctx.strokeStyle = COL.bad; ctx.lineWidth = Math.max(3, s*.1); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(X-z, Y-z); ctx.lineTo(X+z, Y+z); ctx.moveTo(X+z, Y-z); ctx.lineTo(X-z, Y+z); ctx.stroke();
    }
  }
  if (S.P.robot) drawRobot(rpos[0] + shake, rpos[1] + shake, heading);
}
