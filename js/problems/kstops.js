import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L4: cheapest delivery with at most k stops (Bellman-Ford) ---------- */
function routes(rng, n, m){
  const out = [], seen = new Set();
  for (let tries = 0; out.length < m && tries < m * 40; tries++){ const a = ri(rng, 0, n - 1), b = ri(rng, 0, n - 1), key = a + "," + b; if (a === b || seen.has(key)) continue; seen.add(key); out.push([a, b, ri(rng, 1, 50)]); }
  return out;
}
export const KStopsProblem = {
  id: "kstops", tier: 4, tab: "At most k stops", pattern: "Bellman-Ford", fname: "k_stops.py", levelNoun: "route maps",
  title: "Cheapest delivery with at most k stops", sig: "n, routes, src, dst, k", input: "array", view: "graph",
  brief: `<p>There are <code>n</code> hubs, numbered <code>0</code> to <code>n - 1</code>. Each <code>(a, b, cost)</code> in <code>routes</code> is a one-way delivery from hub <code>a</code> to hub <code>b</code>. A parcel has to get from <code>src</code> to <code>dst</code>, and the driver allows at most <code>k</code> stops at hubs in between.</p>
<p>Write <code>solve(n, routes, src, dst, k)</code> and return the cheapest total cost, or <code>-1</code> if no route has <code>k</code> or fewer stops.</p>`,
  show: `Every read of <code>routes[i]</code> lights up that arrow, with its cost in the middle. Name your cost list <code>dist</code> (or <code>cost</code>) to see the best price for each hub written under it, round by round.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>In queue</span>`,
  watch: ["dist", "cost", "costs", "best", "prices", "prev", "heap", "queue", "q"], panel: ["heap"],
  editor: "random", edgeArg: 1, graphOf: L => ({n: L.n, edges: L.routes}),
  nodeLabels: {names: ["dist", "cost", "costs", "best", "prices"], prefix: ""},
  levels(){ return [
    lvl("k1", "One stop allowed", {n:4, routes:[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src:0, dst:3, k:1}),
    lvl("k2", "Cheaper with more stops", {n:3, routes:[[0,1,100],[1,2,100],[0,2,500]], src:0, dst:2, k:1}),
    lvl("k3", "Direct only", {n:3, routes:[[0,1,100],[1,2,100],[0,2,500]], src:0, dst:2, k:0}),
    lvl("k4", "Out of reach", {n:4, routes:[[0,1,5],[1,2,5],[2,3,5]], src:0, dst:3, k:1})
  ]; },
  hidden(){
    return [lvl("h1", "No routes", {n:2, routes:[], src:0, dst:1, k:3}), lvl("h2", "Long cheap chain", {n:6, routes:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[0,5,20]], src:0, dst:5, k:4}),
      lvl("h3", "Chain one stop too long", {n:6, routes:[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[0,5,20]], src:0, dst:5, k:3}),
      lvl("h4", "Thirty hubs, k = 4", {n:30, routes:routes(mkRng(101), 30, 80), src:0, dst:17, k:4}),
      lvl("h5", "Thirty hubs, k = 1", {n:30, routes:routes(mkRng(102), 30, 90), src:3, dst:21, k:1})];
  },
  ref(L){
    let d = Array(L.n).fill(Infinity); d[L.src] = 0;
    for (let i = 0; i <= L.k; i++){ const nd = d.slice(); for (const [a, b, c] of L.routes) if (d[a] + c < nd[b]) nd[b] = d[a] + c; d = nd; }
    return d[L.dst] === Infinity ? -1 : d[L.dst];
  },
  case(L){ return {args:[L.n, L.routes, L.src, L.dst, L.k], arr:[1]}; },
  check(L, ret){
    const c = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the cheapest cost, or -1.");
    if (ret !== c) return bad("Wrong cost", c < 0 ? "No route from " + L.src + " to " + L.dst + " has " + L.k + " or fewer stops, so the answer is -1, but you returned " + ret + "." : "You returned " + ret + ", but the cheapest delivery with at most " + L.k + " stop" + (L.k === 1 ? "" : "s") + " costs " + c + "." + (ret >= 0 && ret < c ? " That route uses too many stops." : ""));
    return ok("Cheapest delivery", c < 0 ? "No route fits within " + L.k + " stop" + (L.k === 1 ? "" : "s") + ", so -1 is right." : "The parcel gets there for " + c + ".");
  },
  budget(L){ return 2 * (L.k + 2) * L.routes.length + 10; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.dist || w.cost || w.costs || w.best || w.prices)) ? [] : ["dist"]; },
  random(L){ const n = ri(Math.random, 4, 7); L.n = n; L.routes = routes(Math.random, n, ri(Math.random, n + 1, n + 5)); L.src = 0; L.dst = n - 1; L.k = ri(Math.random, 0, 2); }
};
