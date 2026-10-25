import { GRID_BASE } from "./grid-base.js";
import { bad, lvl, ok, parseMap, pyRepr } from "../util.js";

/* ---------- L2: robot routes (grid DP) ---------- */
const ROUTE_MAPS = [
  ["r1", "Small floor", ["...","...","..."]],
  ["r2", "One shelf", ["....",".#..","....","...."]],
  ["r3", "Racks", [".....",".#.#.",".....","#.#..","....."]],
  ["r4", "Blocked in", ["..#","..#","##."]]
];
export const RoutesProblem = Object.assign({}, GRID_BASE, {
  id: "routes", tier: 2, tab: "Robot routes", pattern: "Dynamic programming", fname: "robot_routes.py", customKey: "aisle.customs.routes",
  title: "Count the routes", sig: "grid", path: false, editTools: ["shelf"], watch: [],
  brief: `<p>The robot starts in the top-left corner and must reach the bottom-right corner, moving only right or down. <code>grid[r][c]</code> is <code>1</code> for a shelf and <code>0</code> for floor.</p>
<p>Write <code>solve(grid)</code> and return how many different routes there are. Return <code>0</code> if the start or the end is a shelf.</p>`,
  show: `Name your table <code>dp</code> (a 2D list) or <code>memo</code> (a dict keyed by <code>(r, c)</code>) and its numbers fill in, cell by cell. Plain recursion without a memo re-reads cells many times, and the floor will show it.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw rack"></i>Shelf</span>`,
  starter: `def solve(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]

    # dp[r][c] = number of routes from the start to (r, c).
    # A shelf cell has 0 routes. Otherwise it's the routes
    # from above plus the routes from the left.

    return dp[rows - 1][cols - 1]
`,
  fixCorners(L){ L.start = [0, 0]; L.target = [L.grid.length - 1, L.grid[0].length - 1]; return L; },
  levels(){ return ROUTE_MAPS.map(([id, name, m]) => lvl(id, name, this.fixCorners(parseMap(m)))); },
  hidden(){
    const mk = (id, name, m) => lvl(id, name, this.fixCorners(parseMap(m)));
    return [mk("h1", "Start is a shelf", ["#..","...","..."]), mk("h2", "Single cell", ["."]), mk("h3", "One row", ["......"]),
      mk("h4", "Open 9 × 9 floor", Array(9).fill(".........")), mk("h5", "Racks on a 8 × 9 floor", [".........","..#...#..",".........","#...#....",".........",".#.....#.",".........","...#....."])];
  },
  case(L){ return {grid: L.grid}; },
  ref(L){ const G = L.grid, R = G.length, C = G[0].length, dp = Array.from({length:R}, () => Array(C).fill(0));
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){ if (G[r][c] === 1){ dp[r][c] = 0; continue; } if (!r && !c){ dp[r][c] = 1; continue; } dp[r][c] = (r ? dp[r-1][c] : 0) + (c ? dp[r][c-1] : 0); }
    return dp[R-1][C-1]; },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of routes.");
    if (ret !== n) return bad("Wrong count", "You counted " + ret + " route" + (ret === 1 ? "" : "s") + ", but there " + (n === 1 ? "is 1." : "are " + n + "."));
    return ok("Routes counted", "There " + (n === 1 ? "is 1 route." : "are " + n + " routes."));
  },
  budget(L){ return 4 * L.grid.length * L.grid[0].length + 6; },
  tip(run){ return run.dAt.some(Boolean) ? [] : ["dp"]; }
});
