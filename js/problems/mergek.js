import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { chainText } from "../views/chain.js";

/* ---------- L5: merge k sorted trains (heap) ---------- */
const sortedRun = (rng, n, lo, hi) => Array.from({length: n}, () => ri(rng, lo, hi)).sort((a, b) => a - b);
const total = L => L.lists.reduce((a, l) => a + l.length, 0);
export const MergeKProblem = {
  id: "mergek", tier: 5, tab: "Merge k trains", pattern: "Heap", fname: "merge_k_trains.py", levelNoun: "yards",
  title: "Merge every sorted train", sig: "heads", input: "linked", view: "chain",
  brief: `<p>The yard has <code>k</code> trains, each sorted by cart number, smallest first. <code>heads</code> is a list of their first carts (an empty train is <code>None</code>). Each cart is a node with <code>node.val</code> and <code>node.next</code>.</p>
<p>Write <code>solve(heads)</code> that couples every cart into one train sorted by number and returns its first cart, or <code>None</code> if there are no carts. Aim for <code>O(N log k)</code> for <code>N</code> carts in total.</p>`,
  show: `Each train is one row. Every <code>node.next = …</code> redraws a coupling. Name your heap <code>heap</code> to see which carts are waiting, and your last cart <code>tail</code>.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["heap", "pq", "tail", "cur", "curr", "node", "dummy"], pointers: ["tail", "cur", "curr", "node"], panel: ["heap", "pq"],
  editor: "random", listLabels: Array.from({length: 64}, (_, i) => "train " + i),
  levels(){ return [lvl("k1", "Three trains", {lists:[[1,4,5],[1,3,4],[2,6]]}), lvl("k2", "One empty train", {lists:[[2,9],[],[1,5,7],[3]]}), lvl("k3", "Five short trains", {lists:[[10,40],[20,50],[5,35,60],[15],[25,30]]})]; },
  hidden(){
    const rng = mkRng(77);
    return [lvl("h1", "No trains", {lists:[]}), lvl("h2", "Only empty trains", {lists:[[],[]]}), lvl("h3", "One train", {lists:[[1,2,3]]}),
      lvl("h4", "Ten trains, eighty carts", {lists:Array.from({length:10}, () => sortedRun(rng, 8, 1, 99))}),
      lvl("h5", "Sixty-four short trains", {lists:Array.from({length:64}, () => sortedRun(rng, 4, 1, 400))})];
  },
  case(L){ return {lists: L.lists, as_list: true}; },
  check(L, ret){
    const all = [].concat(...L.lists), want = all.slice().sort((x, y) => x - y);
    if (ret === null) return all.length ? bad("Lost the carts", "You returned None, but there are " + all.length + " carts.") : ok("Correct", "No carts, so nothing to merge.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the first cart of the merged train.");
    if (ret.cycle) return bad("The train loops", "Following node.next from your head never reaches the end.");
    if (ret.__ll.length !== want.length || ret.__ll.some((v, i) => v !== want[i])) return bad("Not sorted", "From your head the carts read " + chainText(ret).slice(0, 120) + ", but they should read " + (want.length <= 16 ? want.join(" → ") : "all " + want.length + " carts in order") + ".");
    if (new Set(ret.ids).size !== all.length || ret.ids.some(id => id < 0)) return ok("Correct, with new carts", "The order is right, but you built new carts. Re-coupling the existing ones saves memory.");
    return ok("Trains merged", "One train of " + want.length + " carts, in order.");
  },
  // A heap does about 4 reads per cart; merging trains in pairs (divide and conquer) about 5 per cart per round.
  budget(L){ const k = Math.max(1, L.lists.length); return total(L) * (5 * Math.ceil(Math.log2(k)) + 6) + 4 * k + 10; },
  showRet: chainText,
  tip(run){ return run.wAt.some(w => w && (w.heap || w.pq)) ? [] : ["heap"]; },
  random(L){ L.lists = Array.from({length: ri(Math.random, 2, 5)}, () => sortedRun(Math.random, ri(Math.random, 1, 4), 1, 40)); }
};
