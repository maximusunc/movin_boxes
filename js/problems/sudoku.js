import { GRID_BASE } from "./grid-base.js";
import { S } from "../state.js";
import { bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L5: fill the slotting board (Sudoku / backtracking) ---------- */
const board = (rows, br, bc) => ({grid: rows.map(r => [...r].map(ch => ch === "." ? 0 : +ch)), start:[-1,-1], target:[-1,-1], br, bc});
function solveRef(G, br, bc){
  const n = G.length, g = G.map(r => r.slice());
  const okAt = (r, c, d) => { for (let k = 0; k < n; k++) if (g[r][k] === d || g[k][c] === d) return false;
    const r0 = r - r % br, c0 = c - c % bc; for (let i = 0; i < br; i++) for (let j = 0; j < bc; j++) if (g[r0 + i][c0 + j] === d) return false; return true; };
  const go = () => { for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!g[r][c]){ for (let d = 1; d <= n; d++) if (okAt(r, c, d)){ g[r][c] = d; if (go()) return true; g[r][c] = 0; } return false; } return true; };
  return go() ? g : null;
}
export const SudokuProblem = Object.assign({}, GRID_BASE, {
  id: "sudoku", tier: 5, tab: "Slotting board", pattern: "Backtracking", fname: "slotting_board.py",
  title: "Fill the slotting board", sig: "grid, box_rows, box_cols", robot: false, path: false, editor: "none",
  isShelf: () => false,
  cellText(v, r, c){
    if (v) return v;
    const ret = S.run && S.run.hasRet && S.t >= S.run.E ? S.run.ret : null;
    return Array.isArray(ret) && Array.isArray(ret[r]) && typeof ret[r][c] === "number" && ret[r][c] ? ret[r][c] : "";
  },
  cellFill(v){ return v ? "box" : null; },
  watch: [],
  brief: `<p>The slotting board is an <code>n × n</code> grid (4 × 4 or 6 × 6) split into boxes of <code>box_rows × box_cols</code> slots. Every row, every column and every box must hold each product code from <code>1</code> to <code>n</code> exactly once. <code>grid[r][c]</code> is the code already slotted there, or <code>0</code> for an empty slot.</p>
<p>Write <code>solve(grid, box_rows, box_cols)</code> and return the completed board as a list of rows. Every puzzle has exactly one answer. You may fill <code>grid</code> in place and return it.</p>`,
  show: `The tan tiles are the codes that were already slotted. Every read lights up its slot and every write turns the slot green, so you can see the search fill in codes and back out of dead ends. When you return, your codes appear in the empty slots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span><span><i class="sw visited"></i>Written</span>`,
  levels(){ return [
    lvl("s1", "4 × 4 board", board(["...4","1.3.",".14.",".3.."], 2, 2)),
    lvl("s2", "6 × 6 board", board([".....4","21..5.","5321..","..6...",".214..",".6..2."], 2, 3)),
    lvl("s3", "Nearly full 4 × 4", board(["12.4","34.2","21.3","4.21"], 2, 2))
  ]; },
  hidden(){ return [
    lvl("h1", "Already full", board(["1234","3412","2143","4321"], 2, 2)),
    lvl("h2", "Sparse 4 × 4", board(["...4",".3..","..1.","2..."], 2, 2)),
    lvl("h3", "6 × 6 board", board(["..325.","......","1.....",".6.132","...6..","..1.25"], 2, 3)),
    lvl("h4", "Sparse 6 × 6 board", board(["3..2..","....64","...64.",".....3","......","53...1"], 2, 3))
  ]; },
  case(L){ return {grid: L.grid, args: [L.br, L.bc]}; },
  check(L, ret){
    const n = L.grid.length;
    if (!Array.isArray(ret) || ret.length !== n || ret.some(r => !Array.isArray(r) || r.length !== n)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the board as a list of " + n + " rows of " + n + " codes.");
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++){
      const v = ret[r][c];
      if (!Number.isInteger(v) || v < 1 || v > n) return bad("Empty or bad slot", "Slot " + pyRepr([r, c]) + " holds " + pyRepr(v) + ". Every slot needs a code from 1 to " + n + ".");
      if (L.grid[r][c] && L.grid[r][c] !== v) return bad("Moved a given code", "Slot " + pyRepr([r, c]) + " started as " + L.grid[r][c] + ", but you changed it to " + v + ".");
    }
    const dup = (cells, what) => { const s = new Set(); for (const [r, c] of cells){ if (s.has(ret[r][c])) return bad("Repeated code", what + " holds code " + ret[r][c] + " twice."); s.add(ret[r][c]); } return null; };
    for (let k = 0; k < n; k++){
      const e = dup(Array.from({length:n}, (_, j) => [k, j]), "Row " + k) || dup(Array.from({length:n}, (_, j) => [j, k]), "Column " + k); if (e) return e;
    }
    for (let r0 = 0; r0 < n; r0 += L.br) for (let c0 = 0; c0 < n; c0 += L.bc){
      const cells = []; for (let i = 0; i < L.br; i++) for (let j = 0; j < L.bc; j++) cells.push([r0 + i, c0 + j]);
      const e = dup(cells, "The box starting at " + pyRepr([r0, c0])); if (e) return e;
    }
    return ok("Board filled", "Every row, column and box holds each code from 1 to " + n + " once.");
  },
  ref(L){ return solveRef(L.grid, L.br, L.bc); },
  showRet(ret){ return Array.isArray(ret) ? "board with " + ret.length + " rows" : pyRepr(ret); },
  tip(){ return []; }
});
