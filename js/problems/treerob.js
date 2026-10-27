import { buildTree, chainOf, completeOf, countNodes, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L4: inspect gates, never two neighbours (DP on trees) ---------- */
function best(root){ const go = n => { if (!n) return [0, 0]; const a = go(n.l), b = go(n.r); return [n.v + a[1] + b[1], Math.max(...a) + Math.max(...b)]; }; return Math.max(...go(root)); }
export const TreeRobProblem = {
  id: "treerob", tier: 4, tab: "Gate inspection", pattern: "DP on trees", fname: "gate_inspection.py", levelNoun: "trees",
  title: "Plan the night inspection", sig: "root", input: "tree", view: "tree",
  brief: `<p>Tonight’s inspector checks sorting gates, and each gate’s <code>node.val</code> is how many points that check earns. Checking a gate shuts it down for the night, so the inspector can’t also check a gate directly connected to it (its parent or either child). Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root)</code> and return the most points the inspector can earn. An empty tree earns <code>0</code>.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Plain recursion asks the same question about the same gates over and over, and the counts pile up. Try having each gate return two answers: the best with itself checked, and the best without.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["node", "memo", "dp", "cache"], panel: ["memo", "dp", "cache"],
  editor: "random",
  levels(){ return [lvl("i1", "Small tree", {tree:[3,2,3,null,3,null,1]}), lvl("i2", "Skip the root", {tree:[3,4,5,1,3,null,1]}), lvl("i3", "Skip two in a row", {tree:[4,1,null,2,null,3]})]; },
  hidden(){ return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "One gate", {tree:[7]}), lvl("h3", "Forty-gate chain", {tree:chainOf(40, i => (i * 13) % 20 + 1, "l")}),
    lvl("h4", "Sixty-three gates, full", {tree:completeOf(63, i => (i * 37) % 50 + 1)}), lvl("h5", "Random fifty", {tree:randomShape(seeded(3), 50, k => (k * 29) % 40 + 1)})]; },
  ref(L){ return best(buildTree(L.tree)); },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the most points.");
    if (ret !== want) return bad("Not the best plan", ret > want ? "You returned " + ret + ", but the best possible plan earns " + want + ". Some of your checks must be on neighbouring gates." : "The best plan earns " + want + " points, but you returned " + ret + ".");
    return ok("Best plan found", "The inspector earns " + want + " point" + (want === 1 ? "" : "s") + ".");
  },
  // A memoized solution may read a gate and its grandchildren several times (about 12 per gate).
  budget(L){ return 14 * countNodes(L.tree) + 10; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 5, 11), () => ri(Math.random, 1, 20)); }
};
