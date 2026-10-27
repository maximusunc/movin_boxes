import { GRID_BASE } from "./grid-base.js";
import { DIRS, bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L2: the leak spreads (multi-source BFS) ---------- */
// "." empty floor (0), "o" dry box (1), "w" wet box (2)
const parse = m => ({grid: m.map(row => [...row].map(ch => ch === "o" ? 1 : ch === "w" ? 2 : 0)), start: [-1, -1], target: [-1, -1]});
const LEAK_MAPS = [
  ["l1", "One leak", ["woo", "oo.", ".oo"]],
  ["l2", "Two leaks", ["w.oooo", "ooo..o", "o..ooo", "oooo.w"]],
  ["l3", "Cut off", ["woo.", "ooo.", "...o"]],
  ["l4", "Long aisle", ["wooooooo", "o.......", "oooooooo"]]
];
export const LeakProblem = Object.assign({}, GRID_BASE, {
  id: "leak", tier: 2, tab: "The leak spreads", pattern: "Multi-source BFS", fname: "leak_spreads.py", editor: "none",
  title: "How long until every box is wet?", sig: "grid", robot: false, path: false, watch: ["minutes", "time", "minute", "fresh", "dry"],
  isShelf: () => false, cellFill: v => v === 1 ? "box" : v === 2 ? "wet" : null,
  brief: `<p>A pipe burst over the storage floor. <code>grid[r][c]</code> is <code>0</code> for empty floor, <code>1</code> for a dry box and <code>2</code> for a box that’s already wet. Every minute, each wet box soaks every dry box right next to it (up, down, left or right). Empty floor stops the water.</p>
<p>Write <code>solve(grid)</code> and return how many minutes pass until no dry box is left, or <code>-1</code> if some box will never get wet.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that cell. Name your set of soaked cells <code>visited</code> and your queue <code>queue</code> to watch the water spread from every leak at once.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Checked</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In queue</span><span><i class="sw wet"></i>Wet box</span>`,
  phaseExtra(w){ for (const k of ["minutes", "time", "minute"]) if (w && typeof w[k] === "number") return ", minute " + w[k]; return ""; },
  levels(){ return LEAK_MAPS.map(([id, name, m]) => lvl(id, name, parse(m))); },
  hidden(){
    const mk = (id, name, m) => lvl(id, name, parse(m));
    return [mk("h1", "Nothing to soak", ["...", ".w."]), mk("h2", "Already all wet", ["ww", "ww"]), mk("h3", "Dry box, no leak", ["o.."]),
      mk("h4", "Empty floor", ["..", ".."]), mk("h5", "Leaks at both ends", ["wooooooooooow"]),
      mk("h6", "Big floor", ["oooooooooo", "o.o.oo.ooo", "ooowoooo.o", "o.oo..oooo", "oooooo.ooo", "oo.ooooowo", "oooo.ooooo", "o.oooo.ooo"])];
  },
  case(L){ return {grid: L.grid}; },
  ref(L){
    const G = L.grid, R = G.length, C = G[0].length, t = G.map(row => row.map(v => v === 2 ? 0 : -1));
    let q = []; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (G[r][c] === 2) q.push([r, c]);
    let mins = 0;
    while (q.length){
      const next = [];
      for (const [r, c] of q) for (const [dr, dc] of DIRS){ const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= R || nc >= C || G[nr][nc] !== 1 || t[nr][nc] >= 0) continue; t[nr][nc] = t[r][c] + 1; next.push([nr, nc]); }
      if (next.length) mins++;
      q = next;
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (G[r][c] === 1 && t[r][c] < 0) return -1;
    return mins;
  },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of minutes, or -1.");
    if (ret !== n) return bad("Wrong time", n < 0 ? "Some dry box isn’t connected to any leak, so the answer is -1, but you returned " + ret + "." : "You returned " + ret + ", but every box is wet after " + n + " minute" + (n === 1 ? "" : "s") + "." + (ret > n ? " Spread from every wet box at the same time, one ring per minute." : ""));
    return ok("Leak timed", n < 0 ? "Some boxes never get wet, so -1 is right." : n === 0 ? "No dry box needs soaking, so it takes 0 minutes." : "Every box is wet after " + n + " minute" + (n === 1 ? "" : "s") + ".");
  },
  budget(L){ return 8 * L.grid.length * L.grid[0].length + 10; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.qAt.some(Boolean) || run.vAt.some(Boolean) ? [] : ["queue"]; }
});
