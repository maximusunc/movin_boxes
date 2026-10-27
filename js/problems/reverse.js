import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { chainText } from "../views/chain.js";

/* ---------- L1: turn the train around (linked list) ---------- */
export const ReverseProblem = {
  id: "reverse", tier: 1, tab: "Turn the train", pattern: "Linked list", fname: "turn_the_train.py", levelNoun: "trains",
  title: "Turn the cart train around", sig: "head", input: "linked", view: "chain",
  brief: `<p>A tugger pulls a train of carts. Each cart is a node with <code>node.val</code> (its cart number) and <code>node.next</code> (the cart behind it, or <code>None</code> for the last cart). You get <code>head</code>, the first cart, or <code>None</code> for an empty train.</p>
<p>Write <code>solve(head)</code> that re-couples the carts so the train runs in the opposite order, and returns the new first cart. Re-use the carts by changing <code>node.next</code>; don’t build new ones.</p>`,
  show: `Every time your code reads a cart it turns green, and every <code>node.next = …</code> redraws that coupling. Variables that hold a cart (<code>prev</code>, <code>cur</code>, <code>nxt</code>) show as labels under it.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  starter: `def solve(head):
    prev = None
    cur = head

    # Walk down the train. For each cart, remember the
    # cart behind it, point it back at prev instead,
    # then step prev and cur forward one cart.
    # When cur runs off the end, prev is the new head.

    return head
`,
  watch: ["prev", "cur", "curr", "head", "nxt", "next_node", "node", "tmp", "temp"], pointers: ["prev", "cur", "curr", "nxt", "next_node", "node", "tmp", "temp", "head"],
  editor: "random", listLabels: ["train"],
  levels(){ return [lvl("r1", "Five carts", {lists:[[1,2,3,4,5]]}), lvl("r2", "Two carts", {lists:[[7,3]]}), lvl("r3", "Long haul", {lists:[[4,8,15,16,23,42,7,9]]})]; },
  hidden(){
    return [lvl("h1", "Empty train", {lists:[[]]}), lvl("h2", "Single cart", {lists:[[9]]}), lvl("h3", "Repeated numbers", {lists:[[2,2,1,2]]}),
      lvl("h4", "Sixty carts", {lists:[Array.from({length:60}, (_, i) => (i * 37) % 100)]})];
  },
  case(L){ return {lists: L.lists}; },
  check(L, ret){
    const vals = L.lists[0], want = vals.slice().reverse();
    if (ret === null) return vals.length ? bad("Lost the train", "You returned None, but the train has " + vals.length + " carts.") : ok("Correct", "An empty train stays empty.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the new first cart (a node), or None for an empty train.");
    if (ret.cycle) return bad("The train loops", "Following node.next from your head never reaches the end. Some cart still points forward: set the old head’s next to None.");
    if (ret.__ll.length !== want.length || ret.__ll.some((v, i) => v !== want[i])) return bad("Wrong order", "From your head the carts read " + chainText(ret) + ", but the turned-around train is " + want.join(" → ") + ".");
    const ids = vals.map((_, i) => vals.length - 1 - i);
    if (ret.ids.some((id, i) => id !== ids[i])) return ok("Correct, with new carts", "The order is right, but you built new carts. Try re-coupling the existing ones with node.next.");
    return ok("Train turned around", want.length ? "The train now runs " + (want.length <= 12 ? want.join(" → ") : "in reverse, all " + want.length + " carts") + "." : "An empty train stays empty.");
  },
  budget(L){ return 4 * L.lists[0].length + 4; },
  showRet: chainText,
  tip(run){ return run.wAt.some(w => w && (w.prev || w.cur || w.curr)) ? [] : ["prev and cur"]; },
  random(L){ L.lists = [Array.from({length: ri(Math.random, 3, 9)}, () => ri(Math.random, 1, 50))]; }
};
