import { buildTree, chainOf, completeOf, countNodes, randomShape, seeded } from "./tree-util.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";
import { drawTree, sizeTree } from "../views/tree.js";

/* ---------- L2: what does the right-side camera see? (tree BFS) ---------- */
export const RightViewProblem = {
  id: "rightview", tier: 2, tab: "Right-side camera", pattern: "Tree BFS", fname: "right_camera.py", levelNoun: "trees",
  title: "What does the right-side camera see?", sig: "root", input: "tree", view: "tree",
  brief: `<p>A camera on the right wall looks at the tree of sorting gates from the side. On each floor it only sees the gate furthest to the right; everything else on that floor is hidden behind it. Each <code>node</code> has <code>node.val</code>, <code>node.left</code> and <code>node.right</code>.</p>
<p>Write <code>solve(root)</code> and return the values the camera sees, top floor first. Return <code>[]</code> for an empty tree.</p>`,
  show: `Every time your code reads a node, it lights up. Name your queue <code>queue</code> to see which gates are waiting, and your answer <code>res</code> to watch it grow.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Visited</span><span><i class="sw queue"></i>In the queue</span>`,
  watch: ["queue", "q", "res", "result", "ans", "out", "view", "node", "cur"], panel: ["res", "result", "ans", "out", "view"],
  editor: "random",
  levels(){ return [lvl("v1", "Right side hidden below", {tree:[1,2,3,null,5,null,4]}), lvl("v2", "Left side sticks out", {tree:[1,2,3,4]}), lvl("v3", "Full tree", {tree:[1,2,3,4,5,6,7]})]; },
  hidden(){ return [lvl("h1", "Empty tree", {tree:[]}), lvl("h2", "One gate", {tree:[8]}), lvl("h3", "Left chain", {tree:chainOf(15, i => i + 1, "l")}),
    lvl("h4", "Zigzag", {tree:chainOf(16, i => i * 3, "zig")}), lvl("h5", "Thirty-one gates, full", {tree:completeOf(31, i => i + 1)}),
    lvl("h6", "Random fifty", {tree:randomShape(seeded(23), 50, k => k + 1)})]; },
  ref(L){ const out = []; let cur = [buildTree(L.tree)].filter(Boolean); while (cur.length){ out.push(cur[cur.length - 1].v); cur = cur.flatMap(n => [n.l, n.r].filter(Boolean)); } return out; },
  case(L){ return {tree: L.tree}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of values, top floor first.");
    const i = want.findIndex((v, k) => ret[k] !== v);
    if (i >= 0) return bad("Wrong view", "On floor " + i + " the camera sees " + want[i] + ", but you have " + pyRepr(ret[i] === undefined ? null : ret[i]) + ".");
    if (ret.length !== want.length) return bad("Wrong number of floors", "The tree has " + want.length + " floor" + (want.length === 1 ? "" : "s") + ", but you returned " + ret.length + " values.");
    return ok("Camera view", want.length ? (want.length <= 10 ? "The camera sees " + pyRepr(want) + "." : "All " + want.length + " floors are right.") : "An empty tree shows nothing.");
  },
  budget(L){ return 4 * countNodes(L.tree) + 6; },
  size(w){ return sizeTree(w); }, draw(){ drawTree(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.queue || w.q)) ? [] : ["queue"]; },
  random(L){ L.tree = randomShape(Math.random, ri(Math.random, 5, 11), () => ri(Math.random, 1, 40)); }
};
