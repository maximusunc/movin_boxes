import { buildTree, chainOf, completeOf, countNodes, height, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L1: how tall is the tower? (tree DFS) ---------- */
export const DepthProblem = {
  id: "depth", tier: 1, tab: "Tower height", pattern: "Tree DFS", fname: "tower_height.py", levelNoun: "trees",
  title: "How tall is the tower of gates?", sig: "root", input: "tree", view: "tree",
  brief: `<p>The sorting gates form a binary tree. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code> (missing children are <code>None</code>).</p>
<p>Write <code>solve(root)</code> and return how many floors the tower has: the number of gates on the longest route from the root down to a gate with no children. An empty tree has <code>0</code> floors.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. A recursive solution visits every gate exactly once.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  starter: `def solve(root):
    # An empty tree has no floors.
    if root is None:
        return 0

    # A tree is one floor (this gate) plus the taller of
    # its two subtrees. Ask each child the same question
    # by calling solve() on it.

    return 1
`,
  watch: ["node", "cur", "stack", "queue"], panel: [],
  editor: "random",
  levels(){ return [lvl("d1", "Three floors", {tree:[3,9,20,null,null,15,7]}), lvl("d2", "Leaning left", {tree:[1,2,null,3,null,4]}), lvl("d3", "Full tree", {tree:[1,2,3,4,5,6,7]})]; },
  hidden(){ return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "One gate", {tree:[5]}), lvl("h3", "Thirty gates in a zigzag", {tree:chainOf(30, k => k + 1, "zig")}),
    lvl("h4", "Thirty-one gates, full", {tree:completeOf(31, k => k + 1)}), lvl("h5", "Random forty", {tree:randomShape(seeded(7), 40, k => k % 50)})]; },
  ref(L){ return height(buildTree(L.tree)); },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of floors.");
    if (ret !== want) return bad("Wrong height", "The tower has " + want + " floor" + (want === 1 ? "" : "s") + ", but you returned " + ret + "." + (ret === want - 1 ? " Count gates, not the connections between them." : ""));
    return ok("Tower measured", want ? "The tower has " + want + " floor" + (want === 1 ? "" : "s") + "." : "An empty tree has no floors.");
  },
  budget(L){ return 3 * countNodes(L.tree) + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 4, 11), () => ri(Math.random, 1, 40)); }
};
