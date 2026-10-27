import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { chainText } from "../views/chain.js";

/* ---------- L2: uncouple the n-th cart from the end (two pointers on a list) ---------- */
export const NthEndProblem = {
  id: "nthend", tier: 2, tab: "Nth from the end", pattern: "Two pointers", fname: "nth_from_end.py", levelNoun: "trains",
  title: "Uncouple the n-th cart from the end", sig: "head, n", input: "linked", view: "chain",
  brief: `<p>A cart near the back of the train needs repairs. Counting from the end, it’s cart number <code>n</code> (so <code>n = 1</code> is the last cart). <code>head</code> is the first cart, and <code>1 ≤ n ≤</code> the number of carts.</p>
<p>Write <code>solve(head, n)</code> that uncouples that cart, re-couples the train around it, and returns the first cart (or <code>None</code> if no carts are left). Try doing it in one pass down the train.</p>`,
  show: `Every <code>node.next = …</code> redraws a coupling. Two pointers named <code>fast</code> and <code>slow</code> (or <code>lead</code> and <code>trail</code>) that walk <code>n</code> carts apart show as labels under the carts.`,
  legend: `<span><i class="sw flash"></i>Touching now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["fast", "slow", "lead", "trail", "cur", "curr", "prev", "dummy", "head", "node", "length", "count"], pointers: ["fast", "slow", "lead", "trail", "cur", "curr", "prev", "node", "head"], panel: ["length", "count"],
  editor: "random", listLabels: ["train"],
  levels(){ return [lvl("e1", "Second from the end", {lists:[[1,2,3,4,5]], n:2}), lvl("e2", "The last cart", {lists:[[6,7,8]], n:1}), lvl("e3", "The first cart", {lists:[[9,4,7,2]], n:4})]; },
  hidden(){
    const long = Array.from({length:60}, (_, i) => (i * 13) % 70);
    return [lvl("h1", "Only cart", {lists:[[5]], n:1}), lvl("h2", "Two carts, remove the first", {lists:[[1,2]], n:2}), lvl("h3", "Two carts, remove the last", {lists:[[1,2]], n:1}),
      lvl("h4", "Sixty carts, n = 17", {lists:[long], n:17}), lvl("h5", "Sixty carts, n = 60", {lists:[long], n:60})];
  },
  case(L){ return {lists: L.lists, args:[L.n]}; },
  check(L, ret){
    const vals = L.lists[0], k = vals.length - L.n, ids = vals.map((_, i) => i).filter(i => i !== k), want = ids.map(i => vals[i]);
    if (ret === null) return want.length ? bad("Lost the train", "You returned None, but " + want.length + " cart" + (want.length === 1 ? " is" : "s are") + " still in the train.") : ok("Correct", "The only cart was uncoupled, so the train is empty.");
    if (!ret || !ret.__ll) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the first cart, or None if no carts are left.");
    if (ret.cycle) return bad("The train loops", "Following node.next from your head never reaches the end.");
    if (ret.__ll.length !== want.length || ret.ids.some((id, i) => id !== ids[i])){
      return bad("Wrong cart uncoupled", "Cart " + L.n + " from the end is cart " + k + " (number " + vals[k] + "). From your head the train reads " + chainText(ret) + ", but it should read " + (want.length <= 14 ? want.join(" → ") : want.length + " carts with cart " + k + " gone") + ".");
    }
    return ok("Cart uncoupled", "Cart " + k + " (number " + vals[k] + ") is out, and the train is re-coupled around it.");
  },
  budget(L){ return 6 * L.lists[0].length + 8; },
  showRet: chainText,
  tip(run){ return run.wAt.some(w => w && (w.fast || w.slow || w.lead || w.trail || w.cur || w.curr || w.prev)) ? [] : ["fast and slow"]; },
  random(L){ const n = ri(Math.random, 3, 9); L.lists = [Array.from({length: n}, () => ri(Math.random, 1, 50))]; L.n = ri(Math.random, 1, n); }
};
