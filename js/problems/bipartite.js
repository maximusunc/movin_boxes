import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L3: two shifts (bipartite check) ---------- */
function conflicts(rng, n, m, twoColor){
  const side = Array.from({length: n}, () => rng() < .5 ? 0 : 1), out = [], seen = new Set();
  for (let tries = 0; out.length < m && tries < m * 50; tries++){
    const a = ri(rng, 0, n - 1), b = ri(rng, 0, n - 1), k = Math.min(a, b) + "," + Math.max(a, b);
    if (a === b || seen.has(k) || (twoColor && side[a] === side[b])) continue;
    seen.add(k); out.push([a, b]);
  }
  return out;
}
function colorOf(n, edges){
  const g = Array.from({length: n}, () => []); edges.forEach(([a, b]) => { g[a].push(b); g[b].push(a); });
  const col = Array(n).fill(-1);
  for (let s = 0; s < n; s++){ if (col[s] >= 0) continue; col[s] = 0; const q = [s];
    while (q.length){ const x = q.shift(); for (const y of g[x]){ if (col[y] < 0){ col[y] = 1 - col[x]; q.push(y); } else if (col[y] === col[x]) return {ok: false, a: x, b: y}; } } }
  return {ok: true, col};
}
function oneBadPair(rng, n, m){
  // a two-colorable crew plus one conflict between two workers who'd have to share a shift
  const c = conflicts(rng, n, m, true), {col} = colorOf(n, c);
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (col[a] === col[b] && !c.some(([x, y]) => (x === a && y === b) || (x === b && y === a))){
    // only an odd loop if a and b are already connected
    const g = Array.from({length: n}, () => []); c.forEach(([x, y]) => { g[x].push(y); g[y].push(x); });
    const seen = new Set([a]), q = [a]; while (q.length){ const x = q.shift(); for (const y of g[x]) if (!seen.has(y)){ seen.add(y); q.push(y); } }
    if (seen.has(b)){ c.push([a, b]); return c; }
  }
  return c;
}
export const BipartiteProblem = {
  id: "bipartite", tier: 3, tab: "Two shifts", pattern: "Bipartite check", fname: "two_shifts.py", levelNoun: "crews",
  title: "Can the crew split into two shifts?", sig: "n, conflicts", input: "array", view: "graph",
  brief: `<p>The warehouse has <code>n</code> workers, numbered <code>0</code> to <code>n - 1</code>, and two shifts: day and night. Each pair <code>(a, b)</code> in <code>conflicts</code> means workers <code>a</code> and <code>b</code> must not work the same shift. Some workers have no conflicts at all, and the crew may fall into separate groups.</p>
<p>Write <code>solve(n, conflicts)</code> and return <code>True</code> if every worker can be given a shift with no conflicting pair on the same one, otherwise <code>False</code>.</p>`,
  show: `Every read of <code>conflicts[i]</code> lights up that pair. Name your shift list or dict <code>color</code> (or <code>shift</code>) to see each worker’s shift written under them.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>In queue</span>`,
  watch: ["color", "colour", "shift", "side", "group", "queue", "q", "stack"], panel: [],
  editor: "random", directed: false, edgeArg: 1, graphOf: L => ({n: L.n, edges: L.conflicts}),
  nodeLabels: {names: ["color", "colour", "shift", "side", "group"], prefix: ""},
  levels(){ return [lvl("b1", "Square crew", {n:4, conflicts:[[0,1],[1,2],[2,3],[3,0]]}), lvl("b2", "Triangle", {n:3, conflicts:[[0,1],[1,2],[2,0]]}), lvl("b3", "Two groups", {n:7, conflicts:[[0,1],[1,2],[3,4],[4,5],[5,6],[6,3]]}), lvl("b4", "Odd loop far away", {n:8, conflicts:[[0,1],[2,3],[3,4],[4,5],[5,6],[6,2]]})]; },
  hidden(){
    return [lvl("h1", "One worker", {n:1, conflicts:[]}), lvl("h2", "No conflicts", {n:5, conflicts:[]}), lvl("h3", "Long even chain", {n:20, conflicts:Array.from({length:19}, (_, i) => [i, i + 1])}),
      lvl("h4", "Thirty workers, splittable", {n:30, conflicts:conflicts(mkRng(71), 30, 45, true)}), lvl("h5", "Thirty workers, one bad pair", {n:30, conflicts:oneBadPair(mkRng(72), 30, 40)}),
      lvl("h6", "Odd loop of five", {n:5, conflicts:[[0,1],[1,2],[2,3],[3,4],[4,0]]})];
  },
  ref(L){ return colorOf(L.n, L.conflicts); },
  case(L){ return {args:[L.n, L.conflicts], arr:[1]}; },
  check(L, ret){
    const r = this.ref(L);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== r.ok) return bad("Wrong answer", r.ok ? "The crew can be split, but you returned False. Check workers with no conflicts and groups that aren’t connected to worker 0." : "You returned True, but there’s a loop with an odd number of workers, so two of them end up on the same shift (for example workers " + r.a + " and " + r.b + ").");
    return ok("Correct", r.ok ? "Every worker gets a shift with no conflicts." : "An odd loop of conflicts makes a split impossible, and you caught it.");
  },
  budget(L){ return 3 * L.conflicts.length + 4; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.color || w.colour || w.shift || w.side || w.group)) ? [] : ["color"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.n = n; L.conflicts = conflicts(Math.random, n, ri(Math.random, n - 1, n + 2), Math.random() < .5); }
};
