import { GRID_BASE } from "./grid-base.js";
import { bad, lvl, mkRng, ok, pyRepr } from "../util.js";

/* ---------- L3: the next generation of crates (Game of Life simulation) ---------- */
const at = (...rows) => ({grid: rows.map(r => [...r].map(ch => ch === "#" ? 1 : 0)), start:[-1,-1], target:[-1,-1]});
function step(G){
  const R = G.length, C = G[0].length;
  return G.map((row, r) => row.map((v, c) => {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){ if (!dr && !dc) continue; const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < R && y < C) n += G[x][y]; }
    return (v === 1 && (n === 2 || n === 3)) || (v === 0 && n === 3) ? 1 : 0;
  }));
}
const randomGrid = (rng, R, C) => ({grid: Array.from({length:R}, () => Array.from({length:C}, () => rng() < .35 ? 1 : 0)), start:[-1,-1], target:[-1,-1]});
export const LifeProblem = Object.assign({}, GRID_BASE, {
  id: "life", tier: 3, tab: "Next generation", pattern: "Simulation", fname: "next_generation.py",
  title: "Which crates survive the night?", sig: "grid", robot: false, path: false, editor: "none", watch: ["count", "n", "live", "out", "res", "nxt", "new"],
  isShelf: () => false, cellFill: v => v === 1 ? "box" : null,
  brief: `<p>The night shift follows an odd rule for crates on the floor, <code>grid[r][c] == 1</code> for a crate and <code>0</code> for empty floor. Every cell looks at its eight neighbors (including diagonals; cells past the edge count as empty):</p>
<p>A crate with fewer than two or more than three neighboring crates is cleared away. A crate with two or three stays. An empty cell with exactly three neighboring crates gets a new one. Everything changes at once, based on the old floor.</p>
<p>Write <code>solve(grid)</code> and return the floor after one night as a new list of lists. The input is read-only.</p>`,
  show: `Crates are drawn as boxes. Every <code>grid[r][c]</code> read lights up that cell, so you can see each neighborhood being counted.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span>`,
  levels(){ return [lvl("l1", "Blinker", at(".....", "..#..", "..#..", "..#..", ".....")), lvl("l2", "Glider", at(".#....", "..#...", "###...", "......", "......")), lvl("l3", "Crowded corner", at("###.", "###.", "....", "...#"))]; },
  hidden(){ return [lvl("h1", "One cell, one crate", at("#")), lvl("h2", "Empty floor", at("....", "....")), lvl("h3", "A stable block", at("....", ".##.", ".##.", "....")),
    lvl("h4", "One row", at("##.###.#")), lvl("h5", "Random 10 × 12 floor", randomGrid(mkRng(71), 10, 12)), lvl("h6", "Full 4 × 5 floor", at("#####", "#####", "#####", "#####"))]; },
  case(L){ return {grid: L.grid}; },
  check(L, ret){
    const want = step(L.grid), R = want.length, C = want[0].length;
    if (!Array.isArray(ret) || ret.length !== R || ret.some(row => !Array.isArray(row) || row.length !== C)) return bad("Check the return value", "Return a new floor with the same shape, " + R + " rows of " + C + " cells. You returned " + pyRepr(ret).slice(0, 80) + ".");
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (ret[r][c] !== want[r][c]){
      let n = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){ if (!dr && !dc) continue; const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < R && y < C) n += L.grid[x][y]; }
      return bad("Wrong cell", "Cell (" + r + ", " + c + ") " + (L.grid[r][c] ? "has a crate" : "is empty") + " with " + n + " neighboring crate" + (n === 1 ? "" : "s") + ", so it should become " + want[r][c] + ", but you have " + pyRepr(ret[r][c]) + ".");
    }
    const live = want.flat().filter(Boolean).length;
    return ok("Night simulated", live + " crate" + (live === 1 ? "" : "s") + " on the floor by morning.");
  },
  budget(L){ return 10 * L.grid.length * L.grid[0].length + 10; },
  showRet(ret){ return Array.isArray(ret) && ret.every(Array.isArray) ? ret.map(r => r.join("")).join(" / ") : pyRepr(ret); },
  tip(){ return []; }
});
