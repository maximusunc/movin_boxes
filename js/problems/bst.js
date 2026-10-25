import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L3: sorting tree check (BST validation) ---------- */
export const BstProblem = {
  id: "bst", tier: 3, tab: "Sorting tree", pattern: "Trees", fname: "sorting_tree.py", levelNoun: "trees",
  title: "Is the sorting tree valid?", sig: "root", input: "tree", view: "tree",
  brief: `<p>Packages are routed through a binary tree of sorting gates. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code> (missing children are <code>None</code>). The tree is valid only if every value in a node’s left subtree is smaller than the node, and every value in its right subtree is larger. No duplicates.</p>
<p>Write <code>solve(root)</code> and return <code>True</code> if the tree is valid, otherwise <code>False</code>.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Name your bounds <code>lo</code> and <code>hi</code>, or an iterative <code>stack</code>, to see them.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>On the stack</span>`,
  starter: `def solve(root):
    # Each node must fit between a lower and an upper bound
    # inherited from its ancestors, not just its parent.
    def check(node, lo, hi):
        if node is None:
            return True
        # ...
        return True

    return check(root, float("-inf"), float("inf"))
`,
  watch: ["stack","queue","q","node","cur","curr","prev","lo","hi","low","high","lower","upper","mn","mx"], panel: ["lo","hi","low","high","lower","upper","prev","stack"],
  editor: "random",
  levels(){ return [lvl("b1", "Neat tree", {tree:[8,4,12,2,6,10,14]}), lvl("b2", "Sneaky grandchild", {tree:[8,4,12,2,9,10,14]}), lvl("b3", "Lopsided", {tree:[5,3,null,2,4,1]}), lvl("b4", "Duplicate value", {tree:[5,5,7]})]; },
  hidden(){
    const rightChain = n => { let tree = [0]; for (let v = 1; v < n; v++) tree = tree.concat([null, v]); return tree; };
    return [lvl("h1", "Single node", {tree:[7]}), lvl("h2", "Empty tree", {tree:[]}), lvl("h3", "Deep violation", {tree:[10,5,15,null,null,6,20]}),
      lvl("h4", "Long valid chain", {tree:rightChain(24)}), lvl("h5", "Balanced and valid", {tree:[16,8,24,4,12,20,28,2,6,10,14,18,22,26,30]}),
      lvl("h6", "Equal right child", {tree:[3,1,3]})];
  },
  ref(L){
    // Rebuild with the same level-order rule as the harness.
    const vals = L.tree; if (!vals.length || vals[0] === null) return {valid: true, badNode: null};
    const nodes = vals.map((v, i) => v === null ? null : {id:i, v, l:null, r:null}); const q = [nodes[0]]; let i = 1;
    while (q.length && i < vals.length){ const c = q.shift(); if (i < vals.length){ c.l = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } if (i < vals.length){ c.r = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } }
    let badNode = null; const go = (n, lo, hi) => { if (!n || badNode !== null) return; if (!(n.v > lo && n.v < hi)){ badNode = n.id; return; } go(n.l, lo, n.v); go(n.r, n.v, hi); };
    go(nodes[0], -Infinity, Infinity); return {valid: badNode === null, badNode};
  },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const {valid, badNode} = this.ref(L);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== valid) return Object.assign(bad("Wrong answer", valid ? "This tree is valid, but you returned False." : "You returned True, but the node with value " + L.tree[badNode] + " breaks the rule against one of its ancestors, not just its parent."), {badNode: valid ? null : badNode});
    return ok("Correct", valid ? "The tree is valid." : "The tree is invalid: the node with value " + L.tree[badNode] + " is out of place.", {badNode: valid ? null : badNode});
  },
  budget(L){ return 7 * L.tree.filter(v => v !== null).length + 8; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  tip(){ return []; },
  random(L){
    // Build a random BST in heap positions, then write it in level order with gaps.
    const vals = [], n = ri(Math.random, 5, 11);
    for (let k = 0; k < n; k++){ const key = ri(Math.random, 1, 40); let i = 0; while (i < 63){ if (vals[i] == null){ vals[i] = key; break; } if (key === vals[i]) break; i = key < vals[i] ? 2*i + 1 : 2*i + 2; } }
    const res = [vals[0]], q = [0];
    while (q.length){ const i = q.shift(); [2*i+1, 2*i+2].forEach(c => { const v = vals[c] == null ? null : vals[c]; res.push(v); if (v !== null) q.push(c); }); }
    while (res.length && res[res.length - 1] === null) res.pop();
    if (Math.random() < .5 && res.length > 3){ const k = ri(Math.random, 1, res.length - 1); if (res[k] !== null) res[k] += ri(Math.random, 8, 20); }
    L.tree = res;
  }
};
