import { S } from "../state.js";
import { buildTree, chainOf, completeOf, countNodes, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L4: where do two routes meet in any tree? (lowest common ancestor) ---------- */
function lca(root, p, q){ const go = n => { if (!n) return null; if (n.v === p || n.v === q) return n; const a = go(n.l), b = go(n.r); return a && b ? n : a || b; }; const r = go(root); return r ? r.v : null; }
const valsOf = t => t.filter(v => v !== null);
export const LcaTreeProblem = {
  id: "lcatree", tier: 4, tab: "Meeting gate", pattern: "Tree DFS", fname: "meeting_gate.py", levelNoun: "trees",
  title: "Where do two routes meet in any tree?", sig: "root, p, q", input: "tree", view: "tree",
  brief: `<p>The sorting gates form a binary tree, but not a sorted one: values can be anywhere. Every gate has a different value. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root, p, q)</code> and return the value of the lowest gate that has both gate <code>p</code> and gate <code>q</code> in its subtree: their lowest common ancestor. Both values are in the tree, and a gate counts as its own ancestor.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. One walk of the tree is enough: each gate reports whether it found <code>p</code> or <code>q</code> below it.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span>`,
  watch: ["node", "cur", "stack"], panel: [],
  editor: "random",
  levels(){ return [lvl("m1", "Split at the root", {tree:[3,5,1,6,2,0,8,null,null,7,4], args:[5,1]}), lvl("m2", "One above the other", {tree:[3,5,1,6,2,0,8,null,null,7,4], args:[5,4]}), lvl("m3", "Deep in the left", {tree:[3,5,1,6,2,0,8,null,null,7,4], args:[7,6]})]; },
  hidden(){ const full = completeOf(63, i => i * 7 % 101), chain = chainOf(40, i => i + 100, "zig"), rnd = randomShape(seeded(11), 60, k => k * 3 + 1), rv = valsOf(rnd);
    return [lvl("h1", "Only the root", {tree:[1], args:[1,1]}), lvl("h2", "Root and child", {tree:[1,2], args:[1,2]}), lvl("h3", "Two leaves far apart", {tree:full, args:[full[31], full[62]]}),
      lvl("h4", "Neighbouring leaves", {tree:full, args:[full[45], full[46]]}), lvl("h5", "Down a zigzag", {tree:chain, args:[120, 139]}), lvl("h6", "Random sixty", {tree:rnd, args:[rv[37], rv[52]]})]; },
  ref(L){ return lca(buildTree(L.tree), L.args[0], L.args[1]); },
  case(L){ return {tree: L.tree, args: L.args}; },
  check(L, ret){
    const want = this.ref(L), [p, q] = L.args;
    if (ret && typeof ret === "object" && ret.node !== undefined) return bad("Return the value", "You returned a node. Return its value instead: node.val.");
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the value of the meeting gate.");
    if (ret !== want) return bad("Wrong gate", "The lowest gate above both " + p + " and " + q + " is " + want + ", but you returned " + ret + ".");
    return ok("Routes meet", "Gates " + p + " and " + q + " meet at gate " + want + ".");
  },
  budget(L){ return 5 * countNodes(L.tree) + 10; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  phaseExtra(){ return ", p = " + S.level.args[0] + ", q = " + S.level.args[1]; },
  tip(){ return []; },
  random(L){ const n = ri(Math.random, 6, 11), vals = []; while (vals.length < n){ const x = ri(Math.random, 0, 40); if (!vals.includes(x)) vals.push(x); }
    L.tree = randomShape(Math.random, n, k => vals[k]); L.args = [vals[ri(Math.random, 0, n - 1)], vals[ri(Math.random, 0, n - 1)]]; }
};
