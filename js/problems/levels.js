import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L2: sort the gates by floor (tree BFS) ---------- */
export const LevelsProblem = {
  id: "levels", tier: 2, tab: "Gates by floor", pattern: "Tree BFS", fname: "gates_by_floor.py", levelNoun: "trees",
  title: "List the gates floor by floor", sig: "root", input: "tree", view: "tree",
  brief: `<p>The sorting gates form a binary tree. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code> (missing children are <code>None</code>). The root is on the top floor, its children one floor down, and so on.</p>
<p>Write <code>solve(root)</code> and return the gate values floor by floor: a list of lists, top floor first, each floor listed left to right. Return <code>[]</code> for an empty tree.</p>`,
  show: `Every time your code reads a node, it lights up; a red ×2 means it was read more than once. Name your queue <code>queue</code> to see which gates are waiting, and your result <code>levels</code> to watch the floors fill in.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In the queue</span>`,
  watch: ["queue", "q", "level", "levels", "res", "result", "ans", "out", "row", "node", "cur", "curr"], panel: ["levels", "res", "result", "ans", "out", "level", "row"],
  editor: "random",
  levels(){ return [lvl("g1", "Three floors", {tree:[3,9,20,null,null,15,7]}), lvl("g2", "Full tree", {tree:[1,2,3,4,5,6,7]}), lvl("g3", "Leaning left", {tree:[8,4,null,2,6,1]})]; },
  hidden(){
    let chain = [0]; for (let v = 1; v < 20; v++) chain = chain.concat([v, null]);
    return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "Single gate", {tree:[42]}), lvl("h3", "Long left chain", {tree:chain}),
      lvl("h4", "Four full floors", {tree:Array.from({length:15}, (_, i) => i + 1)}), lvl("h5", "Gaps in the middle", {tree:[1,2,3,null,4,5,null,6,null,null,7]})];
  },
  ref(L){
    // Rebuild with the same level-order rule as the harness.
    const vals = L.tree; if (!vals.length || vals[0] === null) return [];
    const nodes = vals.map((v, i) => v === null ? null : {v, l:null, r:null}); const q = [nodes[0]]; let i = 1;
    while (q.length && i < vals.length){ const c = q.shift(); if (i < vals.length){ c.l = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } if (i < vals.length){ c.r = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } }
    const out = []; let cur = [nodes[0]];
    while (cur.length){ out.push(cur.map(n => n.v)); cur = cur.flatMap(n => [n.l, n.r].filter(Boolean)); }
    return out;
  },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(r => !Array.isArray(r))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of floors, each a list of values.");
    for (let k = 0; k < want.length; k++){
      const got = ret[k];
      if (!got) return bad("Missing floors", "The tree has " + want.length + " floors, but you returned " + ret.length + ". Floor " + k + " should be " + pyRepr(want[k]) + ".");
      if (got.length !== want[k].length || got.some((v, i) => v !== want[k][i])) return bad("Wrong floor", "Floor " + k + " should be " + pyRepr(want[k]) + " (left to right), but you have " + pyRepr(got) + ".");
    }
    if (ret.length > want.length) return bad("Too many floors", "The tree has " + want.length + " floor" + (want.length === 1 ? "" : "s") + ", but you returned " + ret.length + ".");
    return ok("Floors listed", want.length ? (want.length <= 4 ? pyRepr(want) + "." : "All " + want.length + " floors are right.") : "An empty tree has no floors.");
  },
  budget(L){ return 3 * L.tree.filter(v => v !== null).length + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.queue || w.q)) ? [] : ["queue"]; },
  random(L){
    // Grow a random tree in heap positions, then write it in level order with gaps.
    const filled = [], n = ri(Math.random, 5, 11);
    filled[0] = ri(Math.random, 1, 40);
    for (let k = 1; k < n; k++){ let i = 0; while (i < 63 && filled[i] != null) i = 2*i + 1 + (Math.random() < .5 ? 1 : 0); if (i < 63) filled[i] = ri(Math.random, 1, 40); }
    const res = [filled[0]], q = [0];
    while (q.length){ const i = q.shift(); [2*i+1, 2*i+2].forEach(c => { const v = filled[c] == null ? null : filled[c]; res.push(v); if (v !== null) q.push(c); }); }
    while (res.length && res[res.length - 1] === null) res.pop();
    L.tree = res;
  }
};
