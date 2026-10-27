import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: where does the loop start? (Floyd’s cycle detection) ---------- */
export const LoopStartProblem = {
  id: "loopstart", tier: 3, tab: "Loop start", pattern: "Fast & slow pointers", fname: "loop_start.py", levelNoun: "trains",
  title: "Find where the loop starts", sig: "head", input: "linked", view: "chain",
  brief: `<p>The last cart of a train may be coupled back onto one of the earlier carts, making a loop. You get <code>head</code>, the first cart (or <code>None</code>).</p>
<p>Write <code>solve(head)</code> and return the cart the loop starts at: the one the last cart couples back to. Return <code>None</code> if the train has an end. Don’t re-couple any carts. Bonus: use only constant extra memory.</p>`,
  show: `The arrow from the last cart shows where the loop starts. Name your pointers <code>slow</code> and <code>fast</code> to watch them meet inside the loop, then send one back to the head and step both one cart at a time.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["slow", "fast", "cur", "curr", "node", "head", "ptr", "p", "q", "seen", "visited"], pointers: ["slow", "fast", "cur", "curr", "node", "ptr", "p", "q", "head"],
  editor: "random", listLabels: ["train"],
  levels(){ return [lvl("s1", "Loops to cart 1", {lists:[[3,2,0,4]], cycles:[1]}), lvl("s2", "Long tail, short loop", {lists:[[1,2,3,4,5,6,7,8]], cycles:[5]}), lvl("s3", "No loop", {lists:[[4,8,1,9]], cycles:[-1]}), lvl("s4", "Loops to the start", {lists:[[5,6,7,8,9]], cycles:[0]})]; },
  hidden(){
    const long = Array.from({length:60}, (_, i) => (i * 11) % 40);
    return [lvl("h1", "Empty train", {lists:[[]], cycles:[-1]}), lvl("h2", "One cart coupled to itself", {lists:[[1]], cycles:[0]}), lvl("h3", "One cart, no loop", {lists:[[1]], cycles:[-1]}),
      lvl("h4", "Same numbers everywhere", {lists:[[2,2,2,2,2,2]], cycles:[3]}), lvl("h5", "Sixty carts, loop starts at 59", {lists:[long], cycles:[59]}),
      lvl("h6", "Sixty carts, loop starts at 1", {lists:[long], cycles:[1]}), lvl("h7", "Sixty carts, no loop", {lists:[long], cycles:[-1]})];
  },
  case(L){ return {lists: L.lists, cycles: L.cycles}; },
  check(L, ret){
    const n = L.lists[0].length, pos = n && L.cycles[0] >= 0 ? L.cycles[0] : -1;
    if (ret === null) return pos >= 0 ? bad("Missed the loop", "You returned None, but the last cart couples back to cart " + pos + ".") : ok("Correct", "The train has an end, so there’s no loop.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the cart where the loop starts (a node), or None.");
    const id = ret.ids[0];
    if (pos < 0) return bad("There’s no loop", "This train has an end, so return None.");
    if (id < 0 || id >= n) return bad("Not a cart from the train", "Return one of the train’s own carts, not a new one.");
    if (id !== pos) return bad("Wrong cart", "You returned cart " + id + " (number " + L.lists[0][id] + "), but the loop starts at cart " + pos + " (number " + L.lists[0][pos] + ")." + (L.lists[0][id] === L.lists[0][pos] ? " They have the same number, so compare carts with is, not their values." : ""));
    return ok("Loop found", "The loop starts at cart " + pos + " (number " + L.lists[0][pos] + ").");
  },
  budget(L){ return 10 * L.lists[0].length + 10; },
  showRet(ret){ return ret && ret.__ll ? "cart " + ret.ids[0] + " (number " + ret.__ll[0] + ")" : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.slow || w.fast)) ? [] : ["slow and fast"]; },
  random(L){ const n = ri(Math.random, 3, 9); L.lists = [Array.from({length: n}, () => ri(Math.random, 1, 50))]; L.cycles = [Math.random() < .75 ? ri(Math.random, 0, n - 1) : -1]; }
};
