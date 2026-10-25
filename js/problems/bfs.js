import { GRID_BASE, checkPath } from "./grid-base.js";
import { lvl, parseMap } from "../util.js";

/* ---------- L1: shortest path (BFS) ---------- */
const GRID_MAPS = [
  ["starter", "Starter aisle", ["S..#....",".#.#.##.",".#...#..",".####.#.","......#T",".##.#..."]],
  ["racks", "Rack rows", ["S...........",".##.##.##.#.",".##.##.##.#.","............",".##.##.##.#.",".##.##.##.#.","............",".##.##.##.#.",".##.##.##.#.","...........T"]],
  ["open", "Open floor", ["..........","..........","..........","..S.......","..........","..........","........T.",".........."]],
  ["snake", "The long way round", ["S.........#","#########.#","...........",".##########","...........","##########.","...........",".##########","..........T"]],
  ["walled", "No way through", ["S...#....",".##.#.##.","....#..#.",".##.#.#T.","....#....",".##.#.##.","....#...."]]
];
export const BfsProblem = Object.assign({}, GRID_BASE, {
  id: "grid", tier: 1, tab: "Shortest path", pattern: "BFS", fname: "shortest_path.py", codeKey: "aisle.code", customKey: "aisle.customs",
  title: "Get the robot to the target", sig: "grid, start, target", watch: [],
  brief: `<p><code>grid[r][c]</code> is <code>0</code> for open floor and <code>1</code> for a shelf. The robot moves up, down, left or right, one cell at a time.</p>
<p>Write <code>solve(grid, start, target)</code> and return the shortest path as a list of <code>(row, col)</code> cells, including start and target. Return <code>[]</code> if the target can’t be reached.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. Name your visited set <code>visited</code> and your queue <code>queue</code> to see them. Queue items like <code>((r, c), path)</code> work too. Then the robot drives the path you returned.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In queue</span><span><i class="sw rack"></i>Shelf</span>`,
  starter: `from collections import deque


def solve(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    queue = deque([start])
    visited = {start}

    # Your BFS here.
    # grid[r][c] == 1 means a shelf.
    # Return the path as a list of (row, col) cells,
    # from start to target. Return [] if unreachable.

    return []
`,
  levels(){ return GRID_MAPS.map(([id, name, m]) => lvl(id, name, parseMap(m))); },
  hidden(){
    const H = [];
    H.push(lvl("h1", "Target walled off", parseMap(["S.#..",".##..","#..#T","...#."])));
    const same = parseMap(["...","...","..."]); same.start = [1,1]; same.target = [1,1];
    H.push(lvl("h2", "Robot already on the target", same));
    H.push(lvl("h3", "One long corridor", parseMap(["S.........T"])));
    const big = parseMap(Array.from({length:12}, (_, r) => r === 0 ? "S..........." : r === 11 ? "...........T" : "............"));
    H.push(lvl("h4", "Big open floor", big));
    H.push(lvl("h5", "Dead ends everywhere", parseMap(["S.#......","#.#.####.","..#.#..#.",".##.#.##.","....#...T"])));
    return H;
  },
  check(L, ret){ return checkPath(L, ret, false); },
  budget(L){ return 5 * L.grid.length * L.grid[0].length + 10; }
});
