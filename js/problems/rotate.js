import { GRID_BASE } from "./grid-base.js";
import { bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L2: turn the floor plan (matrix rotation) ---------- */
const square = (n, f) => ({grid: Array.from({length:n}, (_, r) => Array.from({length:n}, (_, c) => f(r, c))), start:[-1,-1], target:[-1,-1]});
const turn = G => G.map((_, r) => G.map((__, c) => G[G.length - 1 - c][r]));
export const RotateProblem = Object.assign({}, GRID_BASE, {
  id: "rotate", tier: 2, tab: "Turn the plan", pattern: "Matrix", fname: "turn_the_plan.py",
  title: "Turn the floor plan a quarter turn", sig: "grid", robot: false, path: false, editor: "none", watch: ["out", "res", "result", "rotated", "n"],
  isShelf: () => false, cellText: v => v,
  brief: `<p>The floor plan is a square grid of bay numbers, <code>grid[r][c]</code>. The new building faces a different way, so the plan has to be turned 90° clockwise: the top row becomes the right-hand column, the left column becomes the top row, and so on.</p>
<p>Write <code>solve(grid)</code> and return the turned plan as a new list of lists. The input is read-only.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell, so you can see the order you copy cells in.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span>`,
  levels(){ return [lvl("t1", "3 × 3", square(3, (r, c) => r * 3 + c + 1)), lvl("t2", "4 × 4", square(4, (r, c) => r * 4 + c + 1)), lvl("t3", "2 × 2", square(2, (r, c) => (r * 2 + c + 1) * 11))]; },
  hidden(){ return [lvl("h1", "One bay", square(1, () => 7)), lvl("h2", "5 × 5", square(5, (r, c) => (r * 5 + c) * 3 % 41 + 1)), lvl("h3", "9 × 9", square(9, (r, c) => (r * 9 + c) * 7 % 97 + 1)), lvl("h4", "Repeated numbers", square(4, (r, c) => (r + c) % 3 + 1))]; },
  case(L){ return {grid: L.grid}; },
  check(L, ret){
    const want = turn(L.grid), n = want.length;
    if (!Array.isArray(ret) || ret.length !== n || ret.some(row => !Array.isArray(row) || row.length !== n)) return bad("Check the return value", "Return a new " + n + " × " + n + " grid. You returned " + pyRepr(ret).slice(0, 80) + ".");
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (ret[r][c] !== want[r][c]) return bad("Wrong turn", "Cell (" + r + ", " + c + ") of the turned plan should be " + want[r][c] + ", from grid[" + (n - 1 - c) + "][" + r + "], but yours is " + pyRepr(ret[r][c]) + "." + (ret[r][c] === L.grid[c][n - 1 - r] ? " That’s a counter-clockwise turn." : ""));
    return ok("Plan turned", n <= 4 ? "The top row now reads " + pyRepr(want[0]) + "." : "All " + n * n + " bays are in their new places.");
  },
  budget(L){ return 2 * L.grid.length * L.grid.length + 4; },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; }
});
