import { GRID_BASE } from "./grid-base.js";
import { DIRS, bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L3: distance to the nearest dock (multi-source BFS) ---------- */
// "." floor (0), "#" shelf (1), "D" dock (2)
const parse = m => ({grid: m.map(row => [...row].map(ch => ch === "#" ? 1 : ch === "D" ? 2 : 0)), start: [-1, -1], target: [-1, -1]});
const EXIT_MAPS = [
  ["e1", "Two docks", ["D....", ".##..", "....D"]],
  ["e2", "Racks", ["D.#...", "..#.#.", "....#.", "##..#D"]],
  ["e3", "Closed room", ["D..#..", "...#.#", "...#.#", "...###"]]
];
export const ExitsProblem = Object.assign({}, GRID_BASE, {
  id: "exits", tier: 3, tab: "Nearest dock", pattern: "Multi-source BFS", fname: "nearest_dock.py", editor: "none",
  title: "How far is the nearest dock?", sig: "grid", robot: false, path: false, watch: [],
  cellFill: v => v === 2 ? "dock" : null, cellText: v => v === 2 ? "D" : null,
  brief: `<p><code>grid[r][c]</code> is <code>0</code> for open floor, <code>1</code> for a shelf and <code>2</code> for a loading dock. Pickers walk up, down, left or right and can’t walk through shelves.</p>
<p>Write <code>solve(grid)</code> and return a grid of the same size where each cell holds the fewest steps from that cell to any dock: <code>0</code> on a dock, and <code>-1</code> for shelves and for floor that can’t reach a dock.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. Name your distance grid <code>dist</code> to see the numbers fill in, and your queue <code>queue</code>. Starting a search from every cell separately reads the floor over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw queue"></i>In queue</span><span><i class="sw rack"></i>Shelf</span>`,
  levels(){ return EXIT_MAPS.map(([id, name, m]) => lvl(id, name, parse(m))); },
  hidden(){
    const mk = (id, name, m) => lvl(id, name, parse(m));
    return [mk("h1", "Just a dock", ["D"]), mk("h2", "No docks", ["...", ".#."]), mk("h3", "Docks everywhere", ["DD", "DD"]),
      mk("h4", "Long corridor", ["D.........."]),
      mk("h5", "Big floor", ["D....#....", ".##..#.##.", ".#...#..#.", ".#.###..#D", "......#...", "##.#..#.##", "...#....#.", "D..#.##..."]),
      mk("h6", "Open 9 × 9", ["D........", ".........", ".........", ".........", "....D....", ".........", ".........", ".........", "........D"])];
  },
  case(L){ return {grid: L.grid}; },
  ref(L){
    const G = L.grid, R = G.length, C = G[0].length, d = G.map(row => row.map(() => -1)), q = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (G[r][c] === 2){ d[r][c] = 0; q.push([r, c]); }
    for (let h = 0; h < q.length; h++){ const [r, c] = q[h]; for (const [dr, dc] of DIRS){ const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= R || nc >= C || G[nr][nc] === 1 || d[nr][nc] >= 0) continue; d[nr][nc] = d[r][c] + 1; q.push([nr, nc]); } }
    return d;
  },
  check(L, ret){
    const want = this.ref(L), R = want.length, C = want[0].length;
    if (!Array.isArray(ret) || ret.length !== R || ret.some(row => !Array.isArray(row) || row.length !== C)) return bad("Check the return value", "Return a grid with " + R + " rows of " + C + " numbers each. You returned " + pyRepr(ret).slice(0, 60) + ".");
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (ret[r][c] !== want[r][c])
      return bad("Wrong distance", "At (" + r + ", " + c + ") you have " + pyRepr(ret[r][c]) + ", but it should be " + want[r][c] + (want[r][c] < 0 ? (L.grid[r][c] === 1 ? " (it’s a shelf)." : " (no dock is reachable from there).") : "."));
    return ok("Distances mapped", "Every cell has the right distance to its nearest dock.");
  },
  budget(L){ return 8 * L.grid.length * L.grid[0].length + 10; },
  showRet(ret){ return Array.isArray(ret) ? "a " + ret.length + "-row distance grid" : pyRepr(ret); },
  tip(run){ return run.dAt.some(Boolean) ? [] : ["dist"]; }
});
