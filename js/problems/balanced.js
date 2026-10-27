import { buildTree, chainOf, completeOf, countNodes, levelOrder, randomShape } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L2: is the tower balanced? (tree DFS returning heights) ---------- */
// [balanced?, id of the lowest gate that breaks the rule]
function balance(root){
  let badNode = null;
  const h = n => { if (!n) return 0; const a = h(n.l), b = h(n.r); if (Math.abs(a - b) > 1 && badNode === null) badNode = n.id; return 1 + Math.max(a, b); };
  h(root); return [badNode === null, badNode];
}
// A Fibonacci tree: as lopsided as a balanced tree can be.
function fibTree(h, next){ if (h <= 0) return null; const n = {v: next(), l: null, r: null}; if (h > 1){ n.l = fibTree(h - 1, next); n.r = fibTree(h - 2, next); } return n; }
export const BalancedProblem = {
  id: "balanced", tier: 2, tab: "Balanced tower", pattern: "Tree DFS", fname: "balanced_tower.py", levelNoun: "trees",
  title: "Is the tower balanced?", sig: "root", input: "tree", view: "tree",
  brief: `<p>A tree of sorting gates is <em>balanced</em> if, at every gate, the left and right subtrees differ in height by at most one floor. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root)</code> and return <code>True</code> if the whole tree is balanced, otherwise <code>False</code>. An empty tree is balanced.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Measuring the height again at every gate reads the lower gates many times over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["node", "cur", "stack"], panel: [],
  editor: "random",
  levels(){ return [lvl("b1", "Balanced", {tree:[3,9,20,null,null,15,7]}), lvl("b2", "Leaning too far", {tree:[1,2,2,3,3,null,null,4,4]}), lvl("b3", "Balanced at the root only", {tree:[1,2,3,4,null,null,5,6,null,null,7]})]; },
  hidden(){
    let k = 0; const fib = levelOrder(fibTree(9, () => ++k));
    return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "One gate", {tree:[1]}), lvl("h3", "Two-gate chain", {tree:[1,2]}), lvl("h4", "Three-gate chain", {tree:[1,null,2,null,3]}),
      lvl("h5", "Sixty-three gates, full", {tree:completeOf(63, i => i + 1)}), lvl("h6", "Lopsided but balanced", {tree:fib}), lvl("h7", "Long chain", {tree:chainOf(20, i => i, "l")})];
  },
  ref(L){ return balance(buildTree(L.tree)); },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const [want, badNode] = this.ref(L);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? "Every gate’s subtrees are within one floor of each other, so the tree is balanced." : "You returned True, but the gate with value " + L.tree[badNode] + " has subtrees more than one floor apart.");
    return ok("Correct", want ? "The tree is balanced." : "The tree isn’t balanced: the gate with value " + L.tree[badNode] + " leans too far.");
  },
  budget(L){ return 3 * countNodes(L.tree) + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 5, 11), () => ri(Math.random, 1, 40)); }
};
