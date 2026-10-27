import { buildTree, chainOf, completeOf, countNodes, levelOrder, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L3: the longest route between two gates (tree diameter) ---------- */
// Two long zigzagging arms hanging off the root: the longest route runs through it.
function twoArms(n){
  const root = {v: 0, l: null, r: null}; let a = null, b = null;
  for (let k = 1; k < n; k++){
    const nd = {v: k, l: null, r: null}, left = k % 2 === 1, i = Math.floor((k - 1) / 2);
    if (left){ if (!a) root.l = nd; else a[i % 2 ? "r" : "l"] = nd; a = nd; }
    else { if (!b) root.r = nd; else b[i % 2 ? "l" : "r"] = nd; b = nd; }
  }
  return levelOrder(root);
}
export const DiameterProblem = {
  id: "diameter", tier: 3, tab: "Longest route", pattern: "Tree DFS", fname: "longest_route.py", levelNoun: "trees",
  title: "Find the longest route between two gates", sig: "root", input: "tree", view: "tree",
  brief: `<p>The sorting gates form a binary tree, and a package can travel along any connection in either direction. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root)</code> and return the number of connections on the longest route between any two gates. The route doesn’t have to pass through the root. A tree with zero or one gate has a longest route of <code>0</code>.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Measuring heights again at every gate reads the lower gates many times. Name your running answer <code>best</code> to watch it grow.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["node", "cur", "stack", "best", "ans", "res", "diameter"], panel: ["best", "ans", "res", "diameter"],
  editor: "random",
  levels(){ return [lvl("r1", "Through the root", {tree:[1,2,3,4,5]}), lvl("r2", "Off to one side", {tree:[1,2,null,3,4,5,null,null,6,7,null,null,8]}), lvl("r3", "Single connection", {tree:[1,2]})]; },
  hidden(){ return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "One gate", {tree:[4]}), lvl("h3", "Long left chain", {tree:chainOf(40, i => i, "l")}),
    lvl("h4", "Two long arms", {tree:twoArms(50)}), lvl("h5", "Sixty-three gates, full", {tree:completeOf(63, i => i + 1)}),
    lvl("h6", "Random sixty", {tree:randomShape(seeded(5), 60, k => k)})]; },
  ref(L){ let best = 0; const h = n => { if (!n) return 0; const a = h(n.l), b = h(n.r); best = Math.max(best, a + b); return 1 + Math.max(a, b); }; h(buildTree(L.tree)); return best; },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of connections.");
    if (ret !== want) return bad("Wrong length", "The longest route has " + want + " connection" + (want === 1 ? "" : "s") + ", but you returned " + ret + "." + (ret === want + 1 ? " Count connections, not gates." : ""));
    return ok("Longest route found", "The longest route has " + want + " connection" + (want === 1 ? "" : "s") + ".");
  },
  budget(L){ return 5 * countNodes(L.tree) + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 5, 11), () => ri(Math.random, 1, 40)); }
};
