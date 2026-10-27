import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { chainText } from "../views/chain.js";

/* ---------- L4: re-couple the train (linked list) ---------- */
// Original positions in re-coupled order: 0, n-1, 1, n-2, ...
const order = n => { const out = []; for (let i = 0, j = n - 1; i <= j; i++, j--){ out.push(i); if (i !== j) out.push(j); } return out; };
export const ReorderProblem = {
  id: "reorder", tier: 4, tab: "Re-couple train", pattern: "Linked list", fname: "recouple_train.py", levelNoun: "trains",
  title: "Re-couple the train", sig: "head", input: "linked", view: "chain",
  brief: `<p>A train of carts runs <code>L0 → L1 → L2 → … → Ln</code>. Each cart is a node with <code>node.val</code> and <code>node.next</code>. To balance the load, the yard wants it re-coupled as <code>L0 → Ln → L1 → Ln-1 → L2 → …</code>: first cart, last cart, second cart, second-to-last, and so on.</p>
<p>Write <code>solve(head)</code> that re-couples the existing carts by changing <code>node.next</code> (don’t build new carts) and returns the first cart. <code>head</code> is <code>None</code> for an empty train.</p>`,
  show: `Every cart your code touches turns green, and every <code>node.next = …</code> redraws that coupling. Variables holding carts (<code>slow</code>, <code>fast</code>, <code>prev</code>, <code>cur</code>, <code>first</code>, <code>second</code>) show as labels under them.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["head", "slow", "fast", "mid", "prev", "cur", "curr", "nxt", "first", "second", "tmp", "tmp1", "tmp2", "tail", "node"],
  pointers: ["slow", "fast", "mid", "prev", "cur", "curr", "nxt", "first", "second", "tmp", "tmp1", "tmp2", "tail", "node", "head"],
  editor: "random", listLabels: ["train"],
  levels(){ return [lvl("o1", "Four carts", {lists:[[1,2,3,4]]}), lvl("o2", "Five carts", {lists:[[1,2,3,4,5]]}), lvl("o3", "Long train", {lists:[[10,20,30,40,50,60,70,80]]})]; },
  hidden(){
    return [lvl("h1", "Empty train", {lists:[[]]}), lvl("h2", "One cart", {lists:[[5]]}), lvl("h3", "Two carts", {lists:[[1,2]]}), lvl("h4", "Three carts", {lists:[[1,2,3]]}),
      lvl("h5", "Sixty carts", {lists:[Array.from({length:60}, (_, i) => (i * 7) % 50)]})];
  },
  case(L){ return {lists: L.lists}; },
  check(L, ret){
    const vals = L.lists[0], ids = order(vals.length), want = ids.map(i => vals[i]);
    const show = a => a.length <= 12 ? a.join(" → ") : "in the right order, all " + a.length + " carts";
    if (ret === null) return vals.length ? bad("Lost the train", "You returned None, but the train has " + vals.length + " carts.") : ok("Correct", "An empty train stays empty.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the first cart (a node), or None for an empty train.");
    if (ret.cycle) return bad("The train loops", "Following node.next from your head never reaches the end. The new last cart still points at another cart: set its next to None.");
    if (ret.__ll.length !== want.length || ret.__ll.some((v, i) => v !== want[i])) return bad("Wrong order", "From your head the carts read " + chainText(ret) + ", but they should read " + want.join(" → ") + ".");
    if (ret.ids.some((id, i) => id !== ids[i])) return bad("Built new carts", "The order is right, but these aren’t the original carts. Re-couple the existing carts with node.next.");
    return ok("Train re-coupled", "The train now runs " + show(want) + ".");
  },
  budget(L){ return 8 * L.lists[0].length + 8; },
  showRet: chainText,
  tip(run){ return run.wAt.some(w => w && (w.slow || w.fast || w.prev || w.cur || w.curr || w.first || w.second)) ? [] : ["slow and fast"]; },
  random(L){ L.lists = [Array.from({length: ri(Math.random, 4, 9)}, () => ri(Math.random, 1, 50))]; }
};
