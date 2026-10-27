import { S } from "../state.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L3: where do the two routes meet? (BST lowest common ancestor) ---------- */
// Rebuild the tree with the same level-order rule as the harness.
function buildTree(vals){
  if (!vals.length || vals[0] === null) return null;
  const nodes = vals.map((v, i) => v === null ? null : {id:i, v, l:null, r:null}), q = [nodes[0]]; let i = 1;
  while (q.length && i < vals.length){ const c = q.shift(); if (i < vals.length){ c.l = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } if (i < vals.length){ c.r = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } }
  return nodes[0];
}
const height = n => n ? 1 + Math.max(height(n.l), height(n.r)) : 0;
// Level-order list (with gaps) for a BST built by inserting keys in order.
function bstOf(keys){
  const root = {v: keys[0], l: null, r: null};
  keys.slice(1).forEach(k => { let n = root; for (;;){ const side = k < n.v ? "l" : "r"; if (!n[side]){ n[side] = {v: k, l: null, r: null}; break; } n = n[side]; } });
  const out = [], q = [root];
  while (q.length){ const n = q.shift(); out.push(n ? n.v : null); if (n){ q.push(n.l); q.push(n.r); } }
  while (out[out.length - 1] === null) out.pop();
  return out;
}
const balanced = (lo, hi) => { const keys = [], go = (a, b) => { if (a > b) return; const m = (a + b) >> 1; keys.push(m); go(a, m - 1); go(m + 1, b); }; go(lo, hi); return keys; };
export const LcaProblem = {
  id: "lca", tier: 3, tab: "Routes meet", pattern: "Binary search tree", fname: "routes_meet.py", levelNoun: "trees",
  title: "Where do the two routes meet?", sig: "root, p, q", input: "tree", view: "tree",
  brief: `<p>Packages are routed through a binary search tree of sorting gates: every value in a gate’s left subtree is smaller than the gate, and every value in its right subtree is larger. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>. A package for gate <code>p</code> and one for gate <code>q</code> start at <code>root</code> and travel together until their routes split.</p>
<p>Write <code>solve(root, p, q)</code> and return the value of the last gate both routes pass through: the lowest common ancestor of <code>p</code> and <code>q</code>. Both values are in the tree, and a gate counts as its own ancestor.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Name the gate you’re standing on <code>node</code> (or <code>cur</code>) to see it outlined. Searching the whole tree lights up far more gates than the two routes need.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>Current gate</span>`,
  watch: ["node", "cur", "curr", "stack"], panel: [],
  editor: "random",
  levels(){ return [lvl("a1", "Split at the root", {tree:[8,4,12,2,6,10,14], args:[2,10]}), lvl("a2", "Split lower down", {tree:[20,10,30,5,15,25,35,3,7,12,17], args:[3,17]}), lvl("a3", "One is the other’s ancestor", {tree:[6,2,8,0,4,7,9,null,null,3,5], args:[2,5]}), lvl("a4", "Deep on one side", {tree:[6,2,8,0,4,7,9,null,null,3,5], args:[3,5]})]; },
  hidden(){
    const chain = Array.from({length:24}, (_, i) => i), big = bstOf(balanced(1, 31));
    return [lvl("h1", "p is an ancestor of q", {tree:[50,30,70,20,40,60,80], args:[30,40]}), lvl("h2", "p equals q", {tree:[5,3,8,1,4], args:[4,4]}),
      lvl("h3", "Only the root", {tree:[9], args:[9,9]}), lvl("h4", "Thirty-one gates, deep split", {tree:big, args:[29,31]}),
      lvl("h5", "Thirty-one gates, split at the root", {tree:big, args:[1,31]}), lvl("h6", "Long chain", {tree:bstOf(chain), args:[20,23]})];
  },
  ref(L){ let n = buildTree(L.tree); const [p, q] = L.args; while (n){ if (p < n.v && q < n.v) n = n.l; else if (p > n.v && q > n.v) n = n.r; else return n.v; } return null; },
  case(L){ return {tree: L.tree, args: L.args}; },
  check(L, ret){
    const want = this.ref(L), [p, q] = L.args;
    if (ret && typeof ret === "object" && ret.node !== undefined) return bad("Return the value", "You returned a node. Return its value instead: node.val.");
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the value of the meeting gate.");
    if (ret !== want) return bad("Wrong gate", "The routes to " + p + " and " + q + " last share gate " + want + ", but you returned " + ret + ".");
    return ok("Routes meet", "The routes to " + p + " and " + q + " split after gate " + want + ".");
  },
  // One root-to-leaf walk, reading each gate’s value a few times plus one child.
  budget(L){ return 6 * (height(buildTree(L.tree)) + 1) + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  phaseExtra(){ return ", p = " + S.level.args[0] + ", q = " + S.level.args[1]; },
  tip(){ return []; },
  random(L){
    const keys = [], n = ri(Math.random, 6, 11); while (keys.length < n){ const k = ri(Math.random, 1, 40); if (!keys.includes(k)) keys.push(k); }
    L.tree = bstOf(keys); const a = keys[ri(Math.random, 0, n - 1)], b = keys[ri(Math.random, 0, n - 1)]; L.args = [Math.min(a, b), Math.max(a, b)];
  }
};
