import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawIntervals, sizeIntervals } from "../views/intervals.js";

/* ---------- L2: dock schedule (intervals) ---------- */
export const DocksProblem = {
  id: "docks", tier: 2, tab: "Dock schedule", pattern: "Intervals", fname: "dock_schedule.py", levelNoun: "schedules",
  title: "How many loading docks?", sig: "trucks", input: "array", view: "intervals",
  brief: `<p>Each truck is <code>(arrive, leave)</code>. A truck needs a dock from <code>arrive</code> up to, but not including, <code>leave</code>, so a truck leaving at time 5 frees its dock for one arriving at 5.</p>
<p>Write <code>solve(trucks)</code> and return the fewest docks that serve every truck.</p>`,
  show: `Every read highlights that truck. A min-heap of leave times named <code>heap</code> shows as blue markers on the time axis: “this dock is busy until here.”`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Read</span><span><i class="sw queue"></i>Heap: busy until</span>`,
  starter: `import heapq


def solve(trucks):
    heap = []  # leave times of trucks currently at a dock

    # Handle trucks in order of arrival. Before docking one,
    # free every dock whose truck has already left.
    # The answer is the largest the heap ever gets.

    return 0
`,
  watch: ["heap", "ends", "active", "docks", "rooms", "busy", "count", "best", "ans", "res", "need", "i"], panel: ["heap", "ends", "active", "docks", "count", "best", "ans", "need"],
  editor: "random", arrArg: 0,
  levels(){ return [lvl("d1", "Morning rush", {trucks:[[0,30],[5,10],[15,20]]}), lvl("d2", "Back to back", {trucks:[[1,5],[5,9],[9,12],[2,6]]}), lvl("d3", "Busy afternoon", {trucks:[[1,4],[2,7],[3,5],[6,9],[8,12],[5,8],[10,13]]})]; },
  hidden(){
    const rng = mkRng(9), big = Array.from({length:50}, () => { const a = ri(rng, 0, 90); return [a, a + ri(rng, 1, 15)]; });
    return [lvl("h1", "One truck", {trucks:[[3,8]]}), lvl("h2", "Everyone at once", {trucks:[[0,5],[0,5],[0,5],[0,5]]}), lvl("h3", "Leave time equals next arrival", {trucks:[[0,2],[2,4],[4,6]]}), lvl("h4", "Unsorted input", {trucks:[[7,10],[2,4],[3,8],[1,2]]}), lvl("h5", "Fifty trucks", {trucks:big})];
  },
  ref(L){ const ev = []; L.trucks.forEach(([a, b]) => { ev.push([a, 1]); ev.push([b, -1]); }); ev.sort((x, y) => x[0] - y[0] || x[1] - y[1]); let cur = 0, best = 0, at = 0; ev.forEach(([tm, d]) => { cur += d; if (cur > best){ best = cur; at = tm; } }); return {best, at}; },
  case(L){ return {args:[L.trucks], arr:[0]}; },
  check(L, ret){
    const {best, at} = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of docks.");
    if (ret !== best) return Object.assign(bad("Wrong number of docks", "You said " + ret + ", but " + best + " dock" + (best === 1 ? " is" : "s are") + " needed: at time " + at + ", " + best + " trucks are docked at once." + (ret > best ? " Remember a truck leaving at time t frees its dock for one arriving at t." : "")), {ref: best, peakAt: at});
    return ok("Schedule works", best + " dock" + (best === 1 ? " is" : "s are") + " enough. The busiest moment is time " + at + ".", {ref: best, peakAt: at});
  },
  budget(L){ return 3 * L.trucks.length + 4; },
  size(w){ return sizeIntervals(w); }, draw(){ drawIntervals(); },
  tip(run){ return run.wAt.some(w => w && (w.heap || w.ends || w.active)) ? [] : ["heap"]; },
  random(L){ const n = ri(Math.random, 4, 9); L.trucks = Array.from({length:n}, () => { const a = ri(Math.random, 0, 16); return [a, a + ri(Math.random, 1, 6)]; }); }
};
