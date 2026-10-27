import { buildTree, chainOf, completeOf, countNodes, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L5: the most valuable route (maximum path sum) ---------- */
function best(root){ let b = -Infinity; const go = n => { if (!n) return 0; const a = Math.max(0, go(n.l)), c = Math.max(0, go(n.r)); b = Math.max(b, n.v + a + c); return n.v + Math.max(a, c); }; go(root); return b; }
export const PathSumProblem = {
  id: "pathsum", tier: 5, tab: "Best route", pattern: "Tree DFS", fname: "best_route.py", levelNoun: "trees",
  title: "Find the most valuable route", sig: "root", input: "tree", view: "tree",
  brief: `<p>Each sorting gate’s <code>node.val</code> is the profit (or, if negative, the cost) of sending a package through it. A route is any path between two gates along the tree’s connections that visits each gate at most once. It can be a single gate, and it doesn’t have to pass through the root. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>, and the tree has at least one gate.</p>
<p>Write <code>solve(root)</code> and return the largest total value of any route.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Name your running answer <code>best</code> to see it update.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["node", "best", "ans", "res", "stack"], panel: ["best", "ans", "res"],
  editor: "random",
  levels(){ return [lvl("p1", "Small tree", {tree:[1,2,3]}), lvl("p2", "Skip the root", {tree:[-10,9,20,null,null,15,7]}), lvl("p3", "Mixed values", {tree:[5,4,8,11,null,13,4,7,2,null,null,null,1]})]; },
  hidden(){ return [lvl("h1", "One costly gate", {tree:[-3]}), lvl("h2", "All costs", {tree:[-2,-1,-3]}), lvl("h3", "Best route is one gate", {tree:[-5,-9,4,-1,null,-8,-7]}),
    lvl("h4", "Long zigzag", {tree:chainOf(40, i => (i * 17) % 21 - 8, "zig")}), lvl("h5", "Sixty-three gates", {tree:completeOf(63, i => (i * 37) % 41 - 18)}),
    lvl("h6", "Random sixty", {tree:randomShape(seeded(19), 60, k => (k * 23) % 31 - 14)})]; },
  ref(L){ return best(buildTree(L.tree)); },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the route’s total value.");
    if (ret !== want) return bad("Not the best route", "The most valuable route is worth " + want + ", but you returned " + ret + "." + (ret > want ? " A route can’t branch: below its top gate it continues down one side only." : ""));
    return ok("Best route found", "The most valuable route is worth " + want + ".");
  },
  budget(L){ return 5 * countNodes(L.tree) + 10; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 5, 11), () => ri(Math.random, -15, 20)); }
};
