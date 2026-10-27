import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L5: cheapest conveyor network (minimum spanning tree) ---------- */
function network(rng, n, m){
  const belts = [], seen = new Set(), add = (a, b) => { const k = Math.min(a, b) + "," + Math.max(a, b); if (a === b || seen.has(k)) return; seen.add(k); belts.push([a, b, ri(rng, 1, 40)]); };
  for (let v = 1; v < n; v++) add(ri(rng, 0, v - 1), v);
  while (belts.length < m) add(ri(rng, 0, n - 1), ri(rng, 0, n - 1));
  return belts.sort(() => rng() - .5);
}
export const MstProblem = {
  id: "mst", tier: 5, tab: "Cheapest network", pattern: "Minimum spanning tree", fname: "cheapest_network.py", levelNoun: "site plans",
  title: "Build the cheapest conveyor network", sig: "n, belts", input: "array", view: "graph",
  brief: `<p>A new warehouse has <code>n</code> hubs, numbered <code>0</code> to <code>n - 1</code>. Each <code>(a, b, cost)</code> in <code>belts</code> is a two-way conveyor that could be built between hubs <code>a</code> and <code>b</code> for <code>cost</code>. There may be several options between the same two hubs.</p>
<p>Write <code>solve(n, belts)</code> and return the lowest total cost of conveyors that connects every hub to every other, directly or through other hubs. Return <code>-1</code> if no choice of conveyors can connect them all.</p>`,
  show: `Every read of <code>belts[i]</code> lights up that conveyor, with its cost at the middle. Name a union-find array <code>parent</code> to see each hub’s parent under it. When your answer is right, a cheapest network is drawn in green.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw okring"></i>Cheapest network</span>`,
  watch: ["parent", "par", "root", "leader", "total", "cost", "used", "count", "i"], panel: ["total", "cost", "used", "count"],
  editor: "random", directed: false, edgeArg: 1, graphOf: L => ({n: L.n, edges: L.belts}),
  nodeLabels: {names: ["parent", "par", "root", "leader"], prefix: "→ "},
  levels(){ return [lvl("t1", "Four hubs", {n:4, belts:[[0,1,1],[1,2,4],[2,3,3],[0,3,7],[0,2,5]]}), lvl("t2", "Cheap detour", {n:5, belts:[[0,1,10],[0,2,1],[2,1,2],[1,3,6],[3,4,1],[2,4,9]]}), lvl("t3", "Stranded hub", {n:4, belts:[[0,1,3],[1,2,2],[0,2,1]]})]; },
  hidden(){
    return [lvl("h1", "One hub", {n:1, belts:[]}), lvl("h2", "Two hubs, no belts", {n:2, belts:[]}), lvl("h3", "Choices between the same hubs", {n:3, belts:[[0,1,9],[0,1,2],[1,2,5],[2,1,3],[0,2,8]]}),
      lvl("h4", "Two separate halves", {n:6, belts:[[0,1,1],[1,2,1],[3,4,1],[4,5,1]]}), lvl("h5", "Thirty hubs, seventy belts", {n:30, belts:network(mkRng(54), 30, 70)})];
  },
  ref(L){
    const p = Array.from({length:L.n}, (_, i) => i), f = x => { while (p[x] !== x){ p[x] = p[p[x]]; x = p[x]; } return x; };
    const order = L.belts.map((e, i) => i).sort((a, b) => L.belts[a][2] - L.belts[b][2]), used = new Set(); let cost = 0;
    for (const i of order){ const [a, b, c] = L.belts[i], ra = f(a), rb = f(b); if (ra !== rb){ p[ra] = rb; cost += c; used.add(i); } }
    return {cost: used.size === L.n - 1 ? cost : -1, used};
  },
  case(L){ return {args:[L.n, L.belts], arr:[1]}; },
  check(L, ret){
    const {cost} = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the total cost, or -1.");
    if (cost < 0) return ret === -1 ? ok("No network possible", "Some hubs can’t be reached by any conveyor, and you returned -1.") : bad("Can’t be connected", "No set of conveyors reaches every hub here, so the answer is -1, but you returned " + ret + ".");
    if (ret !== cost) return bad("Wrong cost", "The cheapest network costs " + cost + ", but you returned " + ret + "." + (ret === -1 ? " Every hub can be connected." : ret > cost ? " Some conveyor you counted isn’t needed, or a cheaper option exists." : " That’s too cheap to connect every hub."));
    return ok("Network planned", L.n === 1 ? "A single hub needs no conveyors." : "Connecting all " + L.n + " hubs costs " + cost + ".");
  },
  retEdges(ret, L){ const {cost, used} = this.ref(L); return ret === cost && cost >= 0 ? used : null; },
  budget(L){ return 4 * L.belts.length + 8; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.parent || w.par || w.root || w.leader)) ? [] : ["parent"]; },
  random(L){ const n = ri(Math.random, 4, 7); L.n = n; L.belts = network(Math.random, n, ri(Math.random, n, n + 4)); }
};
