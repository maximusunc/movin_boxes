import { GRID_BASE } from "./grid-base.js";
import { bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L2: read the floor in a spiral (matrix simulation) ---------- */
const grid = (R, C, f) => Array.from({length:R}, (_, r) => Array.from({length:C}, (_, c) => f(r, c)));
export const SpiralProblem = Object.assign({}, GRID_BASE, {
  id: "spiral", tier: 2, tab: "Spiral sweep", pattern: "Matrix simulation", fname: "spiral_sweep.py",
  title: "Sweep the floor in a spiral", sig: "grid", robot: false, path: false, editor: "none", watch: ["top", "bottom", "left", "right", "res", "out", "result"],
  isShelf: () => false, cellText: v => v,
  brief: `<p>The cleaning robot sweeps a rectangular floor in a spiral: along the top row left to right, down the right side, back along the bottom, up the left side, and then the same again one ring further in. Each cell holds a tag number.</p>
<p>Write <code>solve(grid)</code> and return the tags in the order the robot reaches them.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell, so you can see the spiral being traced. Name your bounds <code>top</code>, <code>bottom</code>, <code>left</code> and <code>right</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span>`,
  levels(){ return [lvl("p1", "3 × 3", {grid: grid(3, 3, (r, c) => r*3 + c + 1), start:[-1,-1], target:[-1,-1]}), lvl("p2", "3 × 4", {grid: grid(3, 4, (r, c) => r*4 + c + 1), start:[-1,-1], target:[-1,-1]}), lvl("p3", "Tall 5 × 2", {grid: grid(5, 2, (r, c) => r*2 + c + 1), start:[-1,-1], target:[-1,-1]})]; },
  hidden(){ const g = (R, C) => ({grid: grid(R, C, (r, c) => (r*C + c) * 7 % 97 + 1), start:[-1,-1], target:[-1,-1]});
    return [lvl("h1", "One cell", g(1, 1)), lvl("h2", "One row", g(1, 6)), lvl("h3", "One column", g(6, 1)), lvl("h4", "8 × 9", g(8, 9)), lvl("h5", "2 × 7", g(2, 7))]; },
  case(L){ return {grid: L.grid}; },
  ref(L){ const G = L.grid, out = []; let t = 0, b = G.length - 1, l = 0, r = G[0].length - 1;
    while (t <= b && l <= r){ for (let c = l; c <= r; c++) out.push(G[t][c]); for (let k = t + 1; k <= b; k++) out.push(G[k][r]); if (t < b) for (let c = r - 1; c >= l; c--) out.push(G[b][c]); if (l < r) for (let k = b - 1; k > t; k--) out.push(G[k][l]); t++; b--; l++; r--; }
    return out; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of tags.");
    const i = want.findIndex((v, k) => ret[k] !== v);
    if (i >= 0 || ret.length !== want.length) return bad("Off the spiral", i >= 0 ? "Tag " + (i + 1) + " should be " + want[i] + ", but yours is " + pyRepr(ret[i]) + "." : "You returned " + ret.length + " tags, but the floor has " + want.length + ".");
    return ok("Floor swept", want.length <= 16 ? "The robot reads " + pyRepr(want) + "." : "All " + want.length + " tags in spiral order.");
  },
  budget(L){ return 2 * L.grid.length * L.grid[0].length + 4; },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; }
});
