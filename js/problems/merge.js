import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawIntervals, sizeIntervals } from "../views/intervals.js";

/* ---------- L2: merge booked slots (sorting + intervals) ---------- */
export const MergeProblem = {
  id: "merge", tier: 2, tab: "Merge bookings", pattern: "Sorting", fname: "merge_bookings.py", levelNoun: "calendars",
  title: "Merge the forklift bookings", sig: "bookings", input: "array", view: "intervals",
  brief: `<p>Crews book the forklift as <code>(start, end)</code> time slots. Slots that overlap or touch (one ends exactly when the next starts) should become a single booking.</p>
<p>Write <code>solve(bookings)</code> and return the merged bookings as a list of <code>(start, end)</code> pairs, sorted by start time.</p>`,
  show: `Every read highlights that booking. When your code returns, the merged bookings appear in a strip under the input, so gaps and overlaps are easy to spot.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Read</span><span><i class="sw okring"></i>Merged result</span>`,
  starter: `def solve(bookings):
    merged = []
    # Sort by start time. Then each booking either
    # overlaps the last merged one (extend its end)
    # or starts a new merged booking.
    return merged
`,
  watch: ["merged", "res", "result", "out", "ans", "cur", "start", "end", "i"], panel: ["merged", "res", "result", "out", "ans", "cur"], heapNames: [],
  editor: "random", intervalsOf: L => L.bookings, retBars: true,
  levels(){ return [lvl("m1", "Morning", {bookings:[[1,3],[2,6],[8,10],[15,18]]}), lvl("m2", "Touching slots", {bookings:[[1,4],[4,5],[7,9]]}), lvl("m3", "Out of order", {bookings:[[9,12],[1,3],[2,4],[6,8],[11,15]]}), lvl("m4", "One inside another", {bookings:[[2,14],[3,5],[6,7],[16,18]]})]; },
  hidden(){
    const rng = mkRng(21), big = Array.from({length:50}, () => { const a = ri(rng, 0, 190); return [a, a + ri(rng, 0, 6)]; });
    return [lvl("h1", "One booking", {bookings:[[5,7]]}), lvl("h2", "No bookings", {bookings:[]}), lvl("h3", "All the same slot", {bookings:[[2,3],[2,3],[2,3]]}),
      lvl("h4", "Zero-length slots", {bookings:[[1,1],[1,2],[4,4]]}), lvl("h5", "Fifty bookings", {bookings:big}), lvl("h6", "Nested chain", {bookings:[[1,10],[2,9],[3,8],[11,12]]})];
  },
  ref(L){ const s = L.bookings.map(x => x.slice()).sort((a, b) => a[0] - b[0]), out = []; for (const [a, b] of s){ const last = out[out.length - 1]; if (last && a <= last[1]) last[1] = Math.max(last[1], b); else out.push([a, b]); } return out; },
  case(L){ return {args:[L.bookings], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => !isIntArr(x, 2))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of (start, end) pairs.");
    const show = a => a.length <= 8 ? pyRepr(a) : a.length + " bookings";
    if (ret.length !== want.length || ret.some((x, i) => x[0] !== want[i][0] || x[1] !== want[i][1])){
      const i = want.findIndex((x, k) => !ret[k] || ret[k][0] !== x[0] || ret[k][1] !== x[1]);
      return bad("Not merged correctly", "Expected " + show(want) + ", but got " + show(ret) + "." + (i >= 0 && i < want.length ? " The first difference is booking " + i + ": it should be " + pyRepr(want[i]) + "." : ""));
    }
    return ok("Bookings merged", want.length ? "The forklift has " + want.length + " booking" + (want.length === 1 ? "" : "s") + ": " + show(want) + "." : "No bookings, so nothing to merge.");
  },
  budget(L){ return 3 * L.bookings.length + 4; },
  size(w){ return sizeIntervals(w); }, draw(){ drawIntervals(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.merged || w.res || w.result || w.out || w.ans)) ? [] : ["merged"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.bookings = Array.from({length:n}, () => { const a = ri(Math.random, 0, 18); return [a, a + ri(Math.random, 1, 5)]; }); }
};
