import { GRID_BASE } from "./grid-base.js";
import { DIRS, bad, lvl, ok, parseMap, pyRepr } from "../util.js";

/* ---------- L1: shelf clusters (flood fill) ---------- */
const ISLAND_MAPS = [
  ["i1", "Three clusters", ["##..#...","##..#...","....##..","........","..###...","........"]],
  ["i2", "Scattered racks", ["#.#.#.#","..#....",".....##","#....##","##.#..."]],
  ["i3", "One big block", ["......",".####.",".####.",".#..#.",".####.","......"]],
  ["i4", "Winding rack", ["#####.","....#.","###.#.","#...#.","#####."]]
];
export const IslandProblem = Object.assign({}, GRID_BASE, {
  id: "islands", tier: 1, tab: "Shelf clusters", pattern: "Flood fill", fname: "shelf_clusters.py", customKey: "aisle.customs.islands",
  title: "Count the shelf clusters", sig: "grid", robot: false, path: false, editTools: ["shelf"], watch: ["count", "clusters", "islands", "groups", "total"],
  brief: `<p>Shelves that touch up, down, left or right belong to the same cluster. Diagonal doesn’t count. <code>grid[r][c]</code> is <code>1</code> for a shelf and <code>0</code> for floor.</p>
<p>Write <code>solve(grid)</code> and return how many separate clusters there are.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. Name your set <code>visited</code> to see each cluster get claimed, and a <code>count</code> variable shows in the header.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw visited"></i>Visited</span><span><i class="sw rack"></i>Shelf</span>`,
  starter: `def solve(grid):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0

    # Scan every cell. When you find a shelf you haven't
    # visited, that's a new cluster: count it, then flood
    # out (DFS or BFS) to mark the whole cluster visited.

    return count
`,
  levels(){ return ISLAND_MAPS.map(([id, name, m]) => lvl(id, name, Object.assign(parseMap(m), {start:[-1,-1], target:[-1,-1]}))); },
  hidden(){
    const mk = (id, name, m) => lvl(id, name, Object.assign(parseMap(m), {start:[-1,-1], target:[-1,-1]}));
    return [mk("h1", "Empty floor", ["....","....","...."]), mk("h2", "Wall to wall", ["###","###"]), mk("h3", "Checkerboard", ["#.#.#.",".#.#.#","#.#.#.",".#.#.#"]),
      mk("h4", "Diagonals don’t connect", ["#...","..#.",".#..","...#"]), mk("h5", "Single row", ["##.#..###.#"])];
  },
  case(L){ return {grid: L.grid}; },
  ref(L){
    const G = L.grid, R = G.length, C = G[0].length, seen = new Set(); let n = 0;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
      if (G[r][c] !== 1 || seen.has(r*C+c)) continue; n++;
      const st = [[r,c]]; seen.add(r*C+c);
      while (st.length){ const [a, b] = st.pop(); for (const [dr, dc] of DIRS){ const x = a+dr, y = b+dc; if (x>=0&&y>=0&&x<R&&y<C&&G[x][y]===1&&!seen.has(x*C+y)){ seen.add(x*C+y); st.push([x,y]); } } }
    }
    return n;
  },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of clusters.");
    if (ret !== n) return bad("Wrong count", "You counted " + ret + " cluster" + (ret === 1 ? "" : "s") + ", but there " + (n === 1 ? "is 1." : "are " + n + ".") + (ret > n ? " Some clusters were counted more than once." : " Some clusters were merged or missed."));
    return ok("Clusters counted", "There " + (n === 1 ? "is 1 cluster." : "are " + n + " clusters."));
  },
  budget(L){ return 6 * L.grid.length * L.grid[0].length + 10; },
  phaseExtra(w){ for (const k of ["count", "clusters", "islands", "groups", "total"]) if (w && typeof w[k] === "number") return ", count " + w[k]; return ""; },
  tip(run){ return run.vAt.some(Boolean) ? [] : ["visited"]; }
});
