import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { chainText } from "../views/chain.js";

/* ---------- L2: merge two sorted trains (linked list) ---------- */
const sortedRun = (rng, n, lo, hi) => Array.from({length: n}, () => ri(rng, lo, hi)).sort((a, b) => a - b);
export const MergeTwoProblem = {
  id: "mergetwo", tier: 2, tab: "Merge two trains", pattern: "Linked list", fname: "merge_two_trains.py", levelNoun: "yards",
  title: "Merge two sorted trains", sig: "a, b", input: "linked", view: "chain",
  brief: `<p>Two trains of carts are each sorted by cart number, smallest first. Each cart is a node with <code>node.val</code> and <code>node.next</code>; <code>a</code> and <code>b</code> are the first carts (or <code>None</code> for an empty train).</p>
<p>Write <code>solve(a, b)</code> that couples all the carts into one train sorted by number and returns its first cart. Re-use the existing carts by changing <code>node.next</code>; don’t build new ones. (A placeholder <code>ListNode(0)</code> to start from is fine.)</p>`,
  show: `Both trains are drawn, one per row. Every <code>node.next = …</code> redraws a coupling, so you can watch the merged train weave between the rows. Name your pointers <code>a</code>, <code>b</code> and <code>tail</code>.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["a", "b", "tail", "cur", "curr", "dummy", "head", "l1", "l2", "p", "q", "node"], pointers: ["a", "b", "tail", "cur", "curr", "l1", "l2", "p", "q", "node"],
  editor: "random", listLabels: ["train a", "train b"],
  levels(){ return [lvl("t1", "Two short trains", {lists:[[1,2,4],[1,3,4]]}), lvl("t2", "One runs ahead", {lists:[[1,2,3],[7,8,9,10]]}), lvl("t3", "Interleaved", {lists:[[2,5,8,11,14],[3,4,9,12]]})]; },
  hidden(){
    const rng = mkRng(83);
    return [lvl("h1", "Both empty", {lists:[[],[]]}), lvl("h2", "First empty", {lists:[[],[0,5]]}), lvl("h3", "Second empty", {lists:[[4],[]]}), lvl("h4", "All the same number", {lists:[[3,3,3],[3,3]]}),
      lvl("h5", "Thirty carts each", {lists:[sortedRun(rng, 30, 1, 90), sortedRun(rng, 30, 1, 90)]})];
  },
  case(L){ return {lists: L.lists}; },
  check(L, ret){
    const all = L.lists[0].concat(L.lists[1]), want = all.slice().sort((x, y) => x - y);
    if (ret === null) return all.length ? bad("Lost the carts", "You returned None, but there are " + all.length + " carts to couple.") : ok("Correct", "Both trains are empty, so there’s nothing to merge.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the first cart of the merged train, or None if both are empty.");
    if (ret.cycle) return bad("The train loops", "Following node.next from your head never reaches the end. Some cart still points back into the train.");
    if (ret.__ll.length !== want.length || ret.__ll.some((v, i) => v !== want[i])) return bad("Not sorted", "From your head the carts read " + chainText(ret) + ", but they should read " + (want.length <= 16 ? want.join(" → ") : "all " + want.length + " carts in order") + ".");
    if (new Set(ret.ids).size !== all.length || ret.ids.some(id => id < 0 || id >= all.length)) return bad("Built new carts", "The order is right, but these aren’t the original carts. Re-couple the existing carts with node.next.");
    return ok("Trains merged", "One train of " + want.length + " carts" + (want.length <= 16 ? ": " + want.join(" → ") : ", in order") + ".");
  },
  budget(L){ return 8 * (L.lists[0].length + L.lists[1].length) + 8; },
  showRet: chainText,
  tip(run){ return run.wAt.some(w => w && (w.tail || w.cur || w.curr)) ? [] : ["tail"]; },
  random(L){ L.lists = [sortedRun(Math.random, ri(Math.random, 2, 6), 1, 30), sortedRun(Math.random, ri(Math.random, 2, 6), 1, 30)]; }
};
