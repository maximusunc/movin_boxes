import { S } from "../state.js";
import { bad, isIntArr, pyRepr } from "../util.js";
import { drawGrid, isShelf1, judgeGrid } from "../views/grid.js";

/* ---------- shared grid problem pieces ---------- */
export function checkPath(L, ret, wet){
  if (!Array.isArray(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the path as a list of (row, col) cells, or [] if the target can’t be reached.");
  for (let i = 0; i < ret.length; i++) if (!isIntArr(ret[i], 2)) return bad("Check the return value", "Item " + i + " of the path is " + pyRepr(ret[i]) + ". Each step should be a (row, col) pair.");
  return judgeGrid(L, ret, wet);
}
export const GRID_BASE = {
  view: "grid", input: "grid", editor: "grid", levelNoun: "floors",
  isShelf: isShelf1, vals: {open: 0, shelf: 1}, robot: true, path: true,
  size(w){
    const R = S.level.grid.length, C = S.level.grid[0].length;
    const maxH = Math.max(240, window.innerHeight * (window.innerWidth >= 900 ? 0.62 : 0.5));
    S.cell = Math.max(16, Math.floor(Math.min(w / C, maxH / R, 54)));
    return [C * S.cell, R * S.cell];
  },
  draw(){ drawGrid(); },
  cellAt(x, y){
    const c = Math.floor(x / S.cell), r = Math.floor(y / S.cell);
    if (r < 0 || c < 0 || r >= S.level.grid.length || c >= S.level.grid[0].length) return null;
    return [r, c];
  },
  case(L){ return {grid: L.grid, start: L.start, target: L.target}; },
  finalTicks(run){ return this.path ? run.verdict.valid + (run.verdict.bad ? 1 : 0) : 1; },
  finalRate(sp){ return this.path ? Math.max(4, Math.min(sp, 14)) : 1.4; },
  tip(run){
    const m = [];
    if (!run.vAt.some(Boolean)) m.push("visited");
    if (this.path && !run.qAt.some(Boolean)) m.push(this.wet ? "heap" : "queue");
    return m;
  }
};
