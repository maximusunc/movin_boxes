import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: does the train loop? (fast and slow pointers) ---------- */
export const LoopProblem = {
  id: "loop", tier: 2, tab: "Looping train", pattern: "Fast & slow pointers", fname: "looping_train.py", levelNoun: "trains",
  title: "Does the train loop back?", sig: "head", input: "linked", view: "chain",
  brief: `<p>Someone may have coupled the last cart of a train back onto one of the earlier carts, so following <code>node.next</code> would go round forever. You get <code>head</code>, the first cart (or <code>None</code>).</p>
<p>Write <code>solve(head)</code> and return <code>True</code> if the train loops, otherwise <code>False</code>. Try to use only constant extra memory.</p>`,
  show: `The arrow from the last cart shows where it couples back to. Name two pointers <code>slow</code> and <code>fast</code> to watch them chase each other round the loop.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["slow", "fast", "cur", "curr", "node", "head", "seen", "visited"], pointers: ["slow", "fast", "cur", "curr", "node", "head"],
  editor: "random", listLabels: ["train"],
  levels(){ return [lvl("l1", "Loops to cart 1", {lists:[[3,2,0,4]], cycles:[1]}), lvl("l2", "Straight train", {lists:[[1,2,3,4,5]], cycles:[-1]}), lvl("l3", "Loops to the start", {lists:[[7,1,5,8,2,6]], cycles:[0]})]; },
  hidden(){ const long = Array.from({length:60}, (_, i) => i);
    return [lvl("h1", "Empty train", {lists:[[]], cycles:[-1]}), lvl("h2", "One cart, no loop", {lists:[[1]], cycles:[-1]}), lvl("h3", "One cart coupled to itself", {lists:[[1]], cycles:[0]}),
      lvl("h4", "Sixty carts, loop at the end", {lists:[long], cycles:[59]}), lvl("h5", "Sixty carts, no loop", {lists:[long], cycles:[-1]}), lvl("h6", "Repeated numbers", {lists:[[2,2,2,2]], cycles:[2]})]; },
  case(L){ return {lists: L.lists, cycles: L.cycles}; },
  check(L, ret){
    const want = L.lists[0].length > 0 && L.cycles[0] >= 0;
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? "The last cart couples back to cart " + L.cycles[0] + ", so the train loops." : "This train ends, so it doesn’t loop.");
    return ok("Correct", want ? "The train loops back to cart " + L.cycles[0] + "." : "The train has an end, so there’s no loop.");
  },
  budget(L){ return 8 * L.lists[0].length + 8; },
  tip(run){ return run.wAt.some(w => w && (w.slow || w.fast)) ? [] : ["slow and fast"]; },
  random(L){ const n = ri(Math.random, 3, 9); L.lists = [Array.from({length: n}, () => ri(Math.random, 1, 50))]; L.cycles = [Math.random() < .6 ? ri(Math.random, 0, n - 1) : -1]; }
};
