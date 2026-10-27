import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L5: critical conveyors (bridges, Tarjan) ---------- */
function layout(rng, n, extra){
  const out = [], seen = new Set(), add = (a, b) => { const k = Math.min(a, b) + "," + Math.max(a, b); if (a === b || seen.has(k)) return false; seen.add(k); out.push(rng() < .5 ? [a, b] : [b, a]); return true; };
  for (let v = 1; v < n; v++) add(ri(rng, 0, v - 1), v);
  for (let tries = 0, k = 0; k < extra && tries < extra * 40; tries++) if (add(ri(rng, 0, n - 1), ri(rng, 0, n - 1))) k++;
  return out.sort(() => rng() - .5);
}
const key = (a, b) => Math.min(a, b) + "," + Math.max(a, b);
export const BridgesProblem = {
  id: "bridges", tier: 5, tab: "Critical conveyors", pattern: "Bridges (Tarjan)", fname: "critical_conveyors.py", levelNoun: "layouts",
  title: "Which conveyors can’t fail?", sig: "n, belts", input: "array", view: "graph",
  brief: `<p>The warehouse has <code>n</code> hubs, numbered <code>0</code> to <code>n - 1</code>, all connected. Each <code>(a, b)</code> in <code>belts</code> is a two-way conveyor, and no two conveyors join the same pair of hubs. A conveyor is critical if losing it would cut some hubs off from the others.</p>
<p>Write <code>solve(n, belts)</code> and return every critical conveyor as an <code>(a, b)</code> pair, in any order and either way round.</p>`,
  show: `Every read of <code>belts[i]</code> lights up that conveyor. Name your discovery times <code>disc</code> and low-links <code>low</code> to see them under each hub. Removing each conveyor and searching again reads every belt once per conveyor.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw okring"></i>Returned conveyors</span>`,
  watch: ["disc", "tin", "low", "visited", "res", "result", "bridges", "out", "ans"], panel: ["res", "result", "bridges", "out", "ans"],
  editor: "random", directed: false, edgeArg: 1, graphOf: L => ({n: L.n, edges: L.belts}),
  nodeLabels: {names: ["low", "disc", "tin"], prefix: ""},
  levels(){ return [
    lvl("c1", "One weak link", {n:4, belts:[[0,1],[1,2],[2,0],[1,3]]}),
    lvl("c2", "Two loops and a bridge", {n:6, belts:[[0,1],[1,2],[2,0],[2,3],[3,4],[4,5],[5,3]]}),
    lvl("c3", "A chain", {n:5, belts:[[0,1],[1,2],[2,3],[3,4]]}),
    lvl("c4", "No weak links", {n:5, belts:[[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]]})
  ]; },
  hidden(){
    return [lvl("h1", "One hub", {n:1, belts:[]}), lvl("h2", "Two hubs", {n:2, belts:[[1,0]]}), lvl("h3", "Star", {n:6, belts:[[0,1],[0,2],[0,3],[0,4],[0,5]]}),
      lvl("h4", "Thirty hubs, forty-five belts", {n:30, belts:layout(mkRng(121), 30, 16)}), lvl("h5", "Thirty hubs, forty belts", {n:30, belts:layout(mkRng(122), 30, 11)})];
  },
  ref(L){
    const g = Array.from({length: L.n}, () => []); L.belts.forEach(([a, b], i) => { g[a].push([b, i]); g[b].push([a, i]); });
    const disc = Array(L.n).fill(-1), low = Array(L.n).fill(0), out = new Set(); let t = 0;
    const dfs = (x, pe) => { disc[x] = low[x] = t++; for (const [y, i] of g[x]){ if (i === pe) continue; if (disc[y] < 0){ dfs(y, i); low[x] = Math.min(low[x], low[y]); if (low[y] > disc[x]) out.add(i); } else low[x] = Math.min(low[x], disc[y]); } };
    for (let s = 0; s < L.n; s++) if (disc[s] < 0) dfs(s, -1);
    return out;
  },
  indexOf(L){ const m = new Map(); L.belts.forEach(([a, b], i) => m.set(key(a, b), i)); return m; },
  case(L){ return {args:[L.n, L.belts], arr:[1]}; },
  check(L, ret){
    const want = this.ref(L), idx = this.indexOf(L);
    if (!Array.isArray(ret) || ret.some(x => !isIntArr(x, 2))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of (a, b) pairs.");
    const got = new Set();
    for (const [a, b] of ret){
      const i = idx.get(key(a, b));
      if (i === undefined) return bad("Not a conveyor", pyRepr([a, b]) + " isn’t one of the belts.");
      if (got.has(i)) return bad("Listed twice", "The conveyor " + pyRepr([a, b]) + " appears more than once.");
      if (!want.has(i)) return bad("Not critical", "Losing " + pyRepr([a, b]) + " doesn’t cut anyone off: it’s part of a loop.");
      got.add(i);
    }
    const miss = [...want].find(i => !got.has(i));
    if (miss !== undefined) return bad("Missed one", "Losing " + pyRepr(L.belts[miss]) + " would cut some hubs off, but it isn’t in your list." + (want.size > 1 ? " There are " + want.size + " critical conveyors." : ""));
    return ok("Critical conveyors found", want.size ? want.size + " conveyor" + (want.size === 1 ? " is" : "s are") + " critical." : "Every conveyor is on a loop, so none is critical.");
  },
  retEdges(ret, L){ if (!Array.isArray(ret)) return null; const idx = this.indexOf(L), s = new Set(); ret.forEach(p => { if (isIntArr(p, 2)){ const i = idx.get(key(p[0], p[1])); if (i !== undefined) s.add(i); } }); return s; },
  budget(L){ return 4 * L.belts.length + 6; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.low || w.disc || w.tin)) ? [] : ["disc and low"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.n = n; L.belts = layout(Math.random, n, ri(Math.random, 1, 3)); }
};
