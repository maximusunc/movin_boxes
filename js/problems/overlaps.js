import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawIntervals, sizeIntervals } from "../views/intervals.js";

/* ---------- L3: cancel the fewest bookings (greedy interval scheduling) ---------- */
export const OverlapsProblem = {
  id: "overlaps", tier: 3, tab: "Cancel bookings", pattern: "Greedy intervals", fname: "cancel_bookings.py", levelNoun: "calendars",
  title: "Cancel the fewest bookings", sig: "bookings", input: "array", view: "intervals",
  brief: `<p>There’s only one loading bay, and crews have booked it as <code>(start, end)</code> slots. Two bookings clash if they overlap; a booking that ends at 5 doesn’t clash with one that starts at 5.</p>
<p>Write <code>solve(bookings)</code> and return the fewest bookings you have to cancel so that none of the rest clash.</p>`,
  show: `Every read highlights that booking. Keeping the booking that ends earliest leaves the most room for the rest. Name your last kept end time <code>end</code> and your tally <code>removed</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Read</span>`,
  watch: ["end", "last_end", "prev_end", "removed", "count", "cancel", "kept", "ans", "res"], panel: ["end", "last_end", "prev_end", "removed", "count", "cancel", "kept", "ans"], heapNames: [],
  editor: "random", intervalsOf: L => L.bookings,
  levels(){ return [lvl("o1", "One clash", {bookings:[[1,2],[2,3],[3,4],[1,3]]}), lvl("o2", "Triple booked", {bookings:[[1,2],[1,2],[1,2]]}), lvl("o3", "No clashes", {bookings:[[1,2],[2,3]]}), lvl("o4", "Long booking", {bookings:[[0,10],[1,3],[3,5],[5,7],[8,9]]})]; },
  hidden(){
    const rng = mkRng(33), big = Array.from({length:60}, () => { const a = ri(rng, 0, 200); return [a, a + ri(rng, 1, 15)]; });
    return [lvl("h1", "One booking", {bookings:[[2,6]]}), lvl("h2", "No bookings", {bookings:[]}), lvl("h3", "Nested", {bookings:[[1,100],[11,22],[1,11],[2,12]]}),
      lvl("h4", "Back to back with a long one", {bookings:[[0,2],[2,4],[4,6],[1,5],[6,8]]}), lvl("h5", "Sixty bookings", {bookings:big})];
  },
  ref(L){ const s = L.bookings.slice().sort((a, b) => a[1] - b[1]); let end = -Infinity, kept = 0; for (const [a, b] of s) if (a >= end){ kept++; end = b; } return L.bookings.length - kept; },
  case(L){ return {args:[L.bookings], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return how many bookings to cancel.");
    if (ret !== want) return bad("Wrong count", "The fewest cancellations is " + want + ", but you returned " + ret + "." + (ret > want ? " Touching bookings don’t clash, and keeping the one that ends first saves the most." : ""));
    return ok("Bay schedule fixed", want === 0 ? "Nothing clashes, so nothing needs cancelling." : "Cancel " + want + " booking" + (want === 1 ? "" : "s") + " and the rest fit.");
  },
  budget(L){ return 3 * L.bookings.length + 6; },
  size(w){ return sizeIntervals(w); }, draw(){ drawIntervals(); },
  tip(){ return []; },
  random(L){ const n = ri(Math.random, 4, 8); L.bookings = Array.from({length:n}, () => { const a = ri(Math.random, 0, 16); return [a, a + ri(Math.random, 1, 6)]; }); }
};
