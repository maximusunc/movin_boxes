import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L5: use every ticket once (Eulerian path, Hierholzer) ---------- */
function walk(rng, n, m){
  // tickets from one random walk starting at hub 0, so a full route always exists
  const t = []; let x = 0;
  for (let i = 0; i < m; i++){ let y = ri(rng, 0, n - 1); if (y === x) y = (y + 1) % n; t.push([x, y]); x = y; }
  return t.sort(() => rng() - .5);
}
const hubsOf = L => Math.max(1, ...L.tickets.flat().map(x => x + 1));
export const ItineraryProblem = {
  id: "itinerary", tier: 5, tab: "Every ticket once", pattern: "Eulerian path", fname: "every_ticket.py", levelNoun: "ticket books",
  title: "Use every shuttle ticket exactly once", sig: "tickets", input: "array", view: "graph",
  brief: `<p>A shuttle driver has a book of one-way tickets. Each <code>(a, b)</code> in <code>tickets</code> is a trip from hub <code>a</code> to hub <code>b</code>, and some trips appear more than once. The driver starts at hub <code>0</code> and must use every ticket exactly once.</p>
<p>Write <code>solve(tickets)</code> and return the hubs visited, in order, starting with <code>0</code>. There’s always at least one way. If there are several, return the smallest one when compared hub by hub (so <code>[0, 1, 3]</code> comes before <code>[0, 2, 1]</code>).</p>`,
  show: `Every read of <code>tickets[i]</code> lights up that trip. Name your adjacency lists <code>graph</code> and your route stack <code>stack</code>. Trying every order by backtracking reads the tickets over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>On the stack</span>`,
  watch: ["stack", "route", "path", "res", "result", "out"], panel: ["stack", "route", "path", "res", "result", "out"],
  editor: "random", edgeArg: 0, graphOf: L => ({n: hubsOf(L), edges: L.tickets}),
  levels(){ return [
    lvl("i1", "Round trip", {tickets:[[0,1],[1,2],[2,0]]}),
    lvl("i2", "Two ways out", {tickets:[[0,2],[0,1],[1,0],[2,3]]}),
    lvl("i3", "Back and forth", {tickets:[[0,1],[1,0],[0,1],[1,2]]}),
    lvl("i4", "Busy hub", {tickets:[[0,3],[3,1],[1,0],[0,2],[2,4],[4,0],[0,4]]})
  ]; },
  hidden(){
    return [lvl("h1", "One ticket", {tickets:[[0,5]]}), lvl("h2", "Dead end trap", {tickets:[[0,1],[0,2],[2,0]]}), lvl("h3", "Same trip twice", {tickets:[[0,1],[1,0],[0,1],[1,0]]}),
      lvl("h4", "Forty tickets", {tickets:walk(mkRng(111), 8, 40)}), lvl("h5", "Sixty tickets, few hubs", {tickets:walk(mkRng(112), 5, 60)})];
  },
  ref(L){
    const g = {}; L.tickets.forEach(([a, b]) => (g[a] = g[a] || []).push(b));
    Object.values(g).forEach(l => l.sort((x, y) => y - x));
    const st = [0], out = [];
    while (st.length){ const x = st[st.length - 1]; if (g[x] && g[x].length) st.push(g[x].pop()); else out.push(st.pop()); }
    return out.reverse();
  },
  case(L){ return {args:[L.tickets], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!isIntArr(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the list of hubs visited.");
    if (ret[0] !== 0) return bad("Wrong start", "The route has to start at hub 0.");
    if (ret.length !== L.tickets.length + 1) return bad("Not every ticket", "Using " + L.tickets.length + " tickets visits " + (L.tickets.length + 1) + " hubs, but your route has " + ret.length + ".");
    const left = new Map(); L.tickets.forEach(([a, b]) => left.set(a + "," + b, (left.get(a + "," + b) || 0) + 1));
    for (let i = 1; i < ret.length; i++){ const k = ret[i - 1] + "," + ret[i]; if (!left.get(k)) return bad("No ticket left", "Step " + i + " goes from " + ret[i - 1] + " to " + ret[i] + ", but there’s no unused ticket for that trip."); left.set(k, left.get(k) - 1); }
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]) return bad("Not the smallest route", "Your route uses every ticket, but at step " + i + " it goes to hub " + ret[i] + " where the smallest route goes to hub " + want[i] + ".");
    return ok("Route planned", want.length <= 16 ? "The driver goes " + want.join(" → ") + "." : "All " + L.tickets.length + " tickets used, in the smallest order.");
  },
  budget(L){ return 3 * L.tickets.length + 6; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.route || w.path)) ? [] : ["stack"]; },
  random(L){ L.tickets = walk(Math.random, ri(Math.random, 3, 5), ri(Math.random, 4, 8)); }
};
