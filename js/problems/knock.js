import { GRID_BASE } from "./grid-base.js";
import { DIRS, bad, lvl, ok, parseMap, pyRepr } from "../util.js";

/* ---------- L4: knock down shelves (BFS over extra state) ---------- */
const KNOCK_MAPS = [
  ["k1", "One wall", ["S.#...",".##.#.","..#.#.","###.#T","...#.."], 1],
  ["k2", "Short cut", ["S#....",".#.##.",".#..#.",".##.#.","....#T"], 1],
  ["k3", "Two walls", ["S..#..#..","...#..#..","...#..#..","...#..#.T"], 2],
  ["k4", "No knocks", ["S...#","###.#","....#",".####","....T"], 0]
];
const knocks = k => k + " knock" + (k === 1 ? "" : "s");
export const KnockProblem = Object.assign({}, GRID_BASE, {
  id: "knock", tier: 4, tab: "Knock down shelves", pattern: "BFS + state", fname: "knock_down.py", customKey: "aisle.customs.knock",
  title: "Knock down shelves", sig: "grid, start, target, k", path: false, watch: [],
  brief: `<p><code>grid[r][c]</code> is <code>0</code> for open floor and <code>1</code> for a shelf. The robot moves up, down, left or right, one cell at a time, and it may knock down and drive through at most <code>k</code> shelves on the way.</p>
<p>Write <code>solve(grid, start, target, k)</code> and return the fewest moves from <code>start</code> to <code>target</code>, or <code>-1</code> if the robot can’t get there even with <code>k</code> knocks.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. Name your visited set <code>visited</code> (states like <code>(r, c, knocks)</code> are fine) and your queue <code>queue</code> to watch the search spread.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In queue</span><span><i class="sw rack"></i>Shelf</span>`,
  levels(){ return KNOCK_MAPS.map(([id, name, m, k]) => lvl(id, name, Object.assign(parseMap(m), {k}))); },
  hidden(){
    const mk = (id, name, m, k) => lvl(id, name, Object.assign(parseMap(m), {k}));
    return [mk("h1", "Plain BFS, no knocks", ["S....",".###.",".#.#.",".#T#.","....."], 0),
      mk("h2", "Walled in two deep", ["S.....","......","...###","...###","...##T"], 1),
      mk("h3", "Plenty of knocks", ["S#####T"], 9), mk("h4", "Next door", ["ST"], 0),
      mk("h5", "Big floor, two knocks", ["S..#....#...","...#.##.#.#.","####.#..#.#.","...#.#.##.#.","##.#.#....#.",".#...####.#.",".#####...#..",".....#.#.###","####.#.#...#","......#..#.T"], 2)];
  },
  case(L){ return {grid: L.grid, start: L.start, target: L.target, args: [L.k]}; },
  ref(L){
    const G = L.grid, R = G.length, C = G[0].length, [sr, sc] = L.start, [tr, tc] = L.target;
    const seen = new Set([sr + "," + sc + ",0"]); let frontier = [[sr, sc, 0]];
    for (let d = 0; frontier.length; d++){
      const next = [];
      for (const [r, c, used] of frontier){
        if (r === tr && c === tc) return d;
        for (const [dr, dc] of DIRS){
          const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
          const u = used + (G[nr][nc] === 1 ? 1 : 0), key = nr + "," + nc + "," + u;
          if (u > L.k || seen.has(key)) continue;
          seen.add(key); next.push([nr, nc, u]);
        }
      }
      frontier = next;
    }
    return -1;
  },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of moves, or -1.");
    if (ret !== n) return bad("Wrong number of moves", n < 0 ? "You returned " + ret + ", but the target can’t be reached even with " + knocks(L.k) + ", so the answer is -1." : "You returned " + ret + ", but the fewest moves with at most " + knocks(L.k) + " is " + n + "." + (ret > n || ret < 0 ? " Reaching a cell with more knocks left is a different state from reaching it with fewer." : ""));
    return ok("Fewest moves found", n < 0 ? "The target can’t be reached, even with " + knocks(L.k) + "." : "The robot gets there in " + n + " moves with at most " + knocks(L.k) + ".");
  },
  budget(L){ return 6 * L.grid.length * L.grid[0].length * (L.k + 1) + 10; }
});
