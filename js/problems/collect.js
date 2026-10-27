import { GRID_BASE } from "./grid-base.js";
import { DIRS, bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L5: collect every package (BFS over cell + bitmask) ---------- */
// "." floor (0), "#" shelf (1), "P" package (2), "S" robot start (3)
const parse = m => ({grid: m.map(row => [...row].map(ch => ch === "#" ? 1 : ch === "P" ? 2 : ch === "S" ? 3 : 0)), start: [-1, -1], target: [-1, -1]});
const COLLECT_MAPS = [
  ["c1", "Three packages", ["S..#..", ".#.#P.", ".#...#", "P..#..", "##...P"]],
  ["c2", "Back and forth", ["P...S...P"]],
  ["c3", "Round the racks", ["S.#.P", "..#..", "P....", "..#..", "P.#.P"]],
  ["c4", "Out of reach", ["S..#P", "...##", "P...."]]
];
export const CollectProblem = Object.assign({}, GRID_BASE, {
  id: "collect", tier: 5, tab: "Collect them all", pattern: "BFS + bitmask", fname: "collect_all.py", editor: "none",
  title: "Pick up every package", sig: "grid", robot: false, path: false, watch: [],
  cellFill: v => v === 2 ? "target" : v === 3 ? "robot" : null, cellText: v => v === 2 ? "P" : v === 3 ? "S" : null,
  brief: `<p><code>grid[r][c]</code> is <code>0</code> for open floor, <code>1</code> for a shelf, <code>2</code> for a package and <code>3</code> for the robot’s starting cell. There are at most 6 packages. The robot moves up, down, left or right, and picks a package up just by driving onto its cell.</p>
<p>Write <code>solve(grid)</code> and return the fewest moves to pick up every package, in any order and ending anywhere, or <code>-1</code> if some package can’t be reached.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. A state is the robot’s cell plus which packages it holds, like <code>(r, c, mask)</code>: name your set <code>visited</code> and your queue <code>queue</code> to watch the search.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In queue</span><span><i class="sw rack"></i>Shelf</span>`,
  levels(){ return COLLECT_MAPS.map(([id, name, m]) => lvl(id, name, parse(m))); },
  hidden(){
    const mk = (id, name, m) => lvl(id, name, parse(m));
    return [mk("h1", "No packages", ["S..", "..."]), mk("h2", "Package next door", ["SP"]), mk("h3", "Walled-off package", ["S.#P", "..##"]),
      mk("h4", "Six packages", ["S...#..P", ".##.#.#.", ".P......", "...##.#P", "P#...P..", "...#.##.", ".#P.....", "........"]),
      mk("h5", "Long corridor", ["P.......S.......P", "#######.#########", "P...............P"])];
  },
  case(L){ return {grid: L.grid}; },
  ref(L){
    const G = L.grid, R = G.length, C = G[0].length, pk = new Map(); let s = null;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){ if (G[r][c] === 2) pk.set(r * C + c, pk.size); if (G[r][c] === 3) s = [r, c]; }
    const full = (1 << pk.size) - 1, start = pk.has(s[0] * C + s[1]) ? 1 << pk.get(s[0] * C + s[1]) : 0;
    if (start === full) return 0;
    const seen = new Set([s[0] + "," + s[1] + "," + start]); let frontier = [[s[0], s[1], start]];
    for (let d = 1; frontier.length; d++){
      const next = [];
      for (const [r, c, m] of frontier) for (const [dr, dc] of DIRS){
        const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= R || nc >= C || G[nr][nc] === 1) continue;
        const nm = pk.has(nr * C + nc) ? m | (1 << pk.get(nr * C + nc)) : m;
        if (nm === full) return d;
        const k = nr + "," + nc + "," + nm; if (seen.has(k)) continue; seen.add(k); next.push([nr, nc, nm]);
      }
      frontier = next;
    }
    return -1;
  },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of moves, or -1.");
    if (ret !== n) return bad("Wrong number of moves", n < 0 ? "Some package can’t be reached, so the answer is -1, but you returned " + ret + "." : "You returned " + ret + ", but the fewest moves to collect everything is " + n + "." + (ret > n ? " Visiting the nearest package next isn’t always best: search over (cell, packages held) states." : ""));
    return ok("Everything collected", n < 0 ? "A package is walled off, so -1 is right." : n === 0 ? "There’s nothing to pick up." : "The robot collects every package in " + n + " moves.");
  },
  budget(L){ const cells = L.grid.length * L.grid[0].length, p = L.grid.flat().filter(v => v === 2).length; return 6 * cells * (1 << p) + cells + 10; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ const m = []; if (!run.vAt.some(Boolean)) m.push("visited"); if (!run.qAt.some(Boolean)) m.push("queue"); return m; }
});
