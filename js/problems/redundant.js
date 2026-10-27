import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L4: find the extra conveyor (union-find) ---------- */
function treePlusOne(rng, n){
  const edges = [];
  for (let v = 1; v < n; v++) edges.push([ri(rng, 0, v - 1), v]);
  let a = ri(rng, 0, n - 1), b = ri(rng, 0, n - 1); while (b === a || edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))){ a = ri(rng, 0, n - 1); b = ri(rng, 0, n - 1); }
  edges.push([a, b]);
  const perm = Array.from({length:n}, (_, i) => i).sort(() => rng() - .5);
  return edges.map(([x, y]) => rng() < .5 ? [perm[x], perm[y]] : [perm[y], perm[x]]).sort(() => rng() - .5);
}
export const RedundantProblem = {
  id: "redundant", tier: 4, tab: "Extra conveyor", pattern: "Union-find", fname: "extra_conveyor.py", levelNoun: "layouts",
  title: "Find the extra conveyor", sig: "n, belts", input: "array", view: "graph",
  brief: `<p>The warehouse has <code>n</code> sorting hubs, numbered <code>0</code> to <code>n - 1</code>. Each pair <code>(a, b)</code> in <code>belts</code> is a two-way conveyor between hubs <code>a</code> and <code>b</code>. The layout was meant to connect every hub with no loops, but exactly one extra conveyor was added, so now there is exactly one loop.</p>
<p>Write <code>solve(n, belts)</code> and return the conveyor to remove so that every hub is still connected with no loop. If several would work, return the one that appears last in <code>belts</code>.</p>`,
  show: `Every read of <code>belts[i]</code> lights up that conveyor. Name your union-find array <code>parent</code> to see each hub’s parent written under it.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw okring"></i>Returned conveyor</span>`,
  watch: ["parent", "par", "root", "leader", "rank", "size", "i", "a", "b"], panel: ["rank", "size"],
  editor: "random", directed: false, edgeArg: 1, graphOf: L => ({n: L.n, edges: L.belts}),
  nodeLabels: {names: ["parent", "par", "root", "leader"], prefix: "→ "},
  levels(){ return [lvl("u1", "Small loop", {n:3, belts:[[0,1],[0,2],[1,2]]}), lvl("u2", "Loop in the middle", {n:5, belts:[[0,1],[1,2],[2,3],[1,3],[3,4]]}), lvl("u3", "Big loop", {n:7, belts:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6]]})]; },
  hidden(){
    return [lvl("h1", "Two hubs, two belts", {n:2, belts:[[0,1],[1,0]]}), lvl("h2", "Loop closed by the first belt", {n:4, belts:[[2,3],[0,1],[1,2],[3,0]]}),
      lvl("h3", "Thirty hubs", {n:30, belts:treePlusOne(mkRng(31), 30)}), lvl("h4", "Forty hubs", {n:40, belts:treePlusOne(mkRng(41), 40)})];
  },
  ref(L){ const p = Array.from({length:L.n}, (_, i) => i), f = x => { while (p[x] !== x){ p[x] = p[p[x]]; x = p[x]; } return x; };
    for (let i = 0; i < L.belts.length; i++){ const [a, b] = L.belts[i], ra = f(a), rb = f(b); if (ra === rb) return i; p[ra] = rb; } return -1; },
  case(L){ return {args:[L.n, L.belts], arr:[1]}; },
  matchIndex(L, ret){ if (!isIntArr(ret, 2)) return -1; let k = -1; L.belts.forEach(([a, b], i) => { if ((a === ret[0] && b === ret[1]) || (a === ret[1] && b === ret[0])) k = i; }); return k; },
  check(L, ret){
    const i = this.ref(L), want = L.belts[i];
    if (!isIntArr(ret, 2)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the conveyor as an (a, b) pair.");
    const k = this.matchIndex(L, ret);
    if (k < 0) return bad("Not a conveyor", pyRepr(ret) + " isn’t one of the belts in the layout.");
    if (k !== i) return bad("Wrong conveyor", this.inLoop(L, k) ? "Removing " + pyRepr(ret) + " would also break the loop, but " + pyRepr(want) + " is the loop conveyor that appears last in belts." : pyRepr(ret) + " isn’t on the loop: removing it splits the hubs apart and the loop stays. The answer is " + pyRepr(want) + ".");
    return ok("Loop broken", "Removing " + pyRepr(want) + " leaves every hub connected with no loop.");
  },
  inLoop(L, k){ const p = Array.from({length:L.n}, (_, i) => i), f = x => { while (p[x] !== x) x = p[x]; return x; }; L.belts.forEach(([a, b], i) => { if (i !== k){ const ra = f(a), rb = f(b); if (ra !== rb) p[ra] = rb; } }); const r = f(0); return p.every((_, i) => f(i) === r); },
  retEdges(ret, L){ const k = this.matchIndex(L, ret); return k >= 0 ? new Set([k]) : null; },
  budget(L){ return 3 * L.belts.length + 4; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.parent || w.par || w.root || w.leader)) ? [] : ["parent"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.n = n; L.belts = treePlusOne(Math.random, n); }
};
