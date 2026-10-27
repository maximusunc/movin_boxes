import { bad, isIntArr, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: rebuild the sorting tree from two walk logs (tree construction) ---------- */
function levelOrder(pre, ino){
  // Rebuild in JS, then write level order with None gaps (trailing ones trimmed), like the harness.
  const pos = new Map(ino.map((v, i) => [v, i])); let k = 0;
  const build = (lo, hi) => { if (lo > hi) return null; const v = pre[k++], m = pos.get(v); const n = {v}; n.l = build(lo, m - 1); n.r = build(m + 1, hi); return n; };
  const root = build(0, ino.length - 1), out = [], q = [root];
  while (q.length){ const n = q.shift(); if (!n){ out.push(null); continue; } out.push(n.v); q.push(n.l, n.r); }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
function randomTree(rng, n){
  const vals = Array.from({length: n}, (_, i) => i + 1).sort(() => rng() - .5);
  const t = {v: vals[0], l: null, r: null};
  for (const v of vals.slice(1)){ let c = t; for (;;){ const side = rng() < .5 ? "l" : "r"; if (!c[side]){ c[side] = {v, l: null, r: null}; break; } c = c[side]; } }
  const pre = [], ino = []; const walk = n => { if (!n) return; pre.push(n.v); walk(n.l); ino.push(n.v); walk(n.r); }; walk(t);
  return {preorder: pre, inorder: ino};
}
export const BuildProblem = {
  id: "build", tier: 4, tab: "Rebuild the tree", pattern: "Tree construction", fname: "rebuild_tree.py", levelNoun: "logs",
  title: "Rebuild the sorting tree", sig: "preorder, inorder", input: "array", view: "array",
  brief: `<p>The sorting tree was wiped, but two inspection logs survived. <code>preorder</code> lists the gates in the order a pre-order walk visits them (node, left subtree, right subtree), and <code>inorder</code> in in-order (left subtree, node, right subtree). Every gate has a different number.</p>
<p>Write <code>solve(preorder, inorder)</code> and return the root of the rebuilt tree, made from <code>TreeNode(val, left=None, right=None)</code> nodes (the class is already defined for you).</p>`,
  show: `The boxes are the pre-order log, and each read drops a dot under it. Reading <code>inorder</code> doesn’t show up on the boxes, but it does count. When you return, the tree you built is written out in level order.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["i", "idx", "pre_idx", "index", "pos", "lo", "hi", "left", "right"], pointers: ["i", "idx", "pre_idx"], panel: ["index", "pos"], arrArg: 0, arrLabel2: "preorder",
  editor: "random",
  arrayOf: L => L.preorder, extraLabel: L => "inorder " + L.inorder.join(" "),
  levels(){ return [lvl("b1", "Small tree", {preorder:[3,9,20,15,7], inorder:[9,3,15,20,7]}), lvl("b2", "Leans left", {preorder:[4,3,2,1], inorder:[1,2,3,4]}), lvl("b3", "Full tree", {preorder:[8,4,2,6,12,10,14], inorder:[2,4,6,8,10,12,14]})]; },
  hidden(){ return [lvl("h1", "One gate", {preorder:[5], inorder:[5]}), lvl("h2", "No gates", {preorder:[], inorder:[]}), lvl("h3", "Leans right", {preorder:[1,2,3,4,5], inorder:[1,2,3,4,5]}),
    lvl("h4", "Forty random gates", randomTree(((s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; })(97), 40)),
    lvl("h5", "Sixty gates in a chain", {preorder: Array.from({length:60}, (_, i) => 60 - i), inorder: Array.from({length:60}, (_, i) => i + 1)})]; },
  case(L){ return {args:[L.preorder, L.inorder], arr:[0, 1]}; },
  check(L, ret){
    const want = L.preorder.length ? levelOrder(L.preorder, L.inorder) : [];
    if (ret === null) return want.length ? bad("No tree", "You returned None, but there are " + L.preorder.length + " gates.") : ok("Correct", "No gates, so no tree.");
    if (!ret || !Array.isArray(ret.tree)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the root TreeNode.");
    if (ret.cycle) return bad("Not a tree", "Your nodes link back to themselves.");
    if (ret.tree.length !== want.length || ret.tree.some((v, i) => v !== want[i])) return bad("Wrong tree", "In level order your tree is " + pyRepr(ret.tree.slice(0, 15)) + (ret.tree.length > 15 ? "…" : "") + ", but it should be " + pyRepr(want.slice(0, 15)) + (want.length > 15 ? "…" : "") + ".");
    return ok("Tree rebuilt", "Level order: " + (want.length <= 15 ? pyRepr(want) : "all " + L.preorder.length + " gates in place") + ".");
  },
  budget(L){ return 4 * L.preorder.length + 8; },
  showRet(ret){ return ret && ret.tree ? "tree " + pyRepr(ret.tree) : pyRepr(ret); },
  tip(){ return []; },
  random(L){ Object.assign(L, randomTree(Math.random, ri(Math.random, 4, 9))); }
};
