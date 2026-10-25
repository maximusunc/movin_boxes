import { GRID_BASE, checkPath } from "./grid-base.js";
import { lvl, mkRng, parseMap } from "../util.js";

/* ---------- L3: wet floor (Dijkstra) ---------- */
const WET_MAPS = [
  ["spill", "Spill in aisle 4", ["S...~~....","....~~..#.",".##.~~..#.",".#..~~....","....~~...T","..........",".........."]],
  ["flood", "Flooded shortcut", ["S~~~~~~~~T",".~~~~~~~~.",".#######..","..........",".~~~~~~~~.",".~~~~~~~~."]],
  ["puddles", "Puddles everywhere", ["S.~..#....","..~..#.~~.","~~~..#.~~.",".....#....","..#~~~~#..","..#~~~~#..","..#.....~T"]],
  ["leak", "Roof leak", ["S.#.......",".~#.####..",".~#....#..",".~###..#~~","..~~...#~T","........~."]]
];
export const WetProblem = Object.assign({}, GRID_BASE, {
  id: "wet", tier: 3, tab: "Wet floor", pattern: "Dijkstra", fname: "wet_floor.py", customKey: "aisle.customs.wet", wet: true,
  isShelf: v => v < 0, vals: {open: 1, shelf: -1, wet: 5}, editTools: ["shelf", "wet", "start", "target"], watch: [],
  title: "Find the cheapest route", sig: "grid, start, target",
  brief: `<p>Some aisles are wet, and the robot has to creep through them. <code>grid[r][c]</code> is the cost to drive into that cell: <code>1</code> for dry floor, <code>5</code> for a wet patch, <code>-1</code> for a shelf.</p>
<p>Write <code>solve(grid, start, target)</code> and return the cheapest path as a list of <code>(row, col)</code> cells. The start cell is free. Return <code>[]</code> if the target can’t be reached.</p>`,
  show: `Name your priority queue <code>heap</code> and your settled cells <code>visited</code>. Heap items like <code>(cost, r, c)</code> or <code>(cost, (r, c))</code> both work. A <code>dist</code> dict shows its costs in each cell’s corner.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Settled</span><span><i class="sw queue"></i>In heap</span><span><i class="sw wet"></i>Wet, cost 5</span><span><i class="sw rack"></i>Shelf</span>`,
  starter: `import heapq


def solve(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    dist = {start: 0}
    heap = [(0, start)]
    visited = set()

    # Dijkstra: always expand the cheapest cell next.
    # Return the cheapest path, or [] if unreachable.

    return []
`,
  levels(){ return WET_MAPS.map(([id, name, m]) => lvl(id, name, parseMap(m, true))); },
  hidden(){
    const H = [];
    H.push(lvl("h1", "Target behind shelves", parseMap(["S.~#.","~~.#.","..~#T"], true)));
    const same = parseMap(["...","...","..."], true); same.start = [1,1]; same.target = [1,1]; H.push(lvl("h2", "Robot already on the target", same));
    H.push(lvl("h3", "Wet everywhere", parseMap(["S~~~~","~~~~~","~~~~T"], true)));
    H.push(lvl("h4", "Long dry detour beats a short splash", parseMap(["S~T",".#.",".#.",".#.","..."], true)));
    const rng = mkRng(21), big = Array.from({length:11}, (_, r) => Array.from({length:12}, (_, c) => (r + c === 0 || (r === 10 && c === 11)) ? 1 : rng() < .15 ? -1 : rng() < .35 ? 5 : 1));
    H.push(lvl("h5", "Big mixed floor", {grid: big, start:[0,0], target:[10,11]}));
    return H;
  },
  check(L, ret){ return checkPath(L, ret, true); },
  budget(L){ return 10 * L.grid.length * L.grid[0].length + 10; },
  tip(run){ const m = []; if (!run.qAt.some(Boolean)) m.push("heap"); if (!run.dAt.some(Boolean)) m.push("dist"); return m; }
});
