import { S } from "../state.js";
import { balancedKeys, bstOf, buildTree, height } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L3: the k-th lightest gate (BST in-order with an early stop) ---------- */
const inorder = n => n ? [...inorder(n.l), n.v, ...inorder(n.r)] : [];
const nth = k => k + (k % 10 === 1 && k % 100 !== 11 ? "st" : k % 10 === 2 && k % 100 !== 12 ? "nd" : k % 10 === 3 && k % 100 !== 13 ? "rd" : "th");
export const KthProblem = {
  id: "kth", tier: 3, tab: "K-th lightest", pattern: "Binary search tree", fname: "kth_lightest.py", levelNoun: "trees",
  title: "Find the k-th lightest gate", sig: "root, k", input: "tree", view: "tree",
  brief: `<p>The sorting gates form a binary search tree: every value in a gate’s left subtree is smaller, and every value in its right subtree is larger. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root, k)</code> and return the <code>k</code>-th smallest value in the tree, counting from 1. <code>k</code> is always between 1 and the number of gates. Stop as soon as you’ve found it: don’t visit the rest of the tree.</p>`,
  show: `Every time your code reads a node, it lights up. An in-order walk that stops at the k-th gate leaves most of a big tree untouched. Name an iterative stack <code>stack</code> to see it outlined.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>On the stack</span>`,
  watch: ["stack", "node", "cur", "curr", "k", "count", "n"], panel: ["k", "count", "n"],
  editor: "random",
  levels(){ return [lvl("k1", "Third lightest", {tree:[5,3,6,2,4,null,null,1], args:[3]}), lvl("k2", "The lightest", {tree:[8,4,12,2,6,10,14], args:[1]}), lvl("k3", "The heaviest", {tree:[8,4,12,2,6,10,14], args:[7]})]; },
  hidden(){ const big = bstOf(balancedKeys(1, 63)), chain = bstOf(Array.from({length:30}, (_, i) => i + 1));
    return [lvl("h1", "One gate", {tree:[7], args:[1]}), lvl("h2", "Sixty-three gates, k = 2", {tree:big, args:[2]}), lvl("h3", "Sixty-three gates, k = 5", {tree:big, args:[5]}),
      lvl("h4", "Sixty-three gates, k = 40", {tree:big, args:[40]}), lvl("h5", "Right chain, k = 3", {tree:chain, args:[3]}), lvl("h6", "Left chain, the heaviest", {tree:bstOf(Array.from({length:25}, (_, i) => 25 - i)), args:[25]})]; },
  ref(L){ return inorder(buildTree(L.tree))[L.args[0] - 1]; },
  case(L){ return {tree: L.tree, args: L.args}; },
  check(L, ret){
    const want = this.ref(L), k = L.args[0];
    if (ret && typeof ret === "object" && ret.node !== undefined) return bad("Return the value", "You returned a node. Return its value instead: node.val.");
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the k-th smallest value.");
    if (ret !== want) return bad("Wrong gate", "The " + nth(k) + " smallest value is " + want + ", but you returned " + ret + ".");
    return ok("Found it", "The " + nth(k) + " smallest value is " + want + ".");
  },
  // Walk down the left spine, then step through k gates in order.
  budget(L){ return 4 * (height(buildTree(L.tree)) + L.args[0]) + 10; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  phaseExtra(){ return ", k = " + S.level.args[0]; },
  tip(){ return []; },
  random(L){ const keys = [], n = ri(Math.random, 6, 11); while (keys.length < n){ const x = ri(Math.random, 1, 40); if (!keys.includes(x)) keys.push(x); } L.tree = bstOf(keys); L.args = [ri(Math.random, 1, n)]; }
};
