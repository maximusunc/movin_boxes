import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L3: task order (topological sort) ---------- */
export const TopoProblem = {
  id: "topo", tier: 3, tab: "Task order", pattern: "Topological sort", fname: "task_order.py", levelNoun: "task lists",
  title: "Put the tasks in order", sig: "n, deps", input: "array", view: "graph",
  brief: `<p>The night crew has <code>n</code> tasks, numbered <code>0</code> to <code>n - 1</code>. Each pair <code>(a, b)</code> in <code>deps</code> means task <code>a</code> must happen before task <code>b</code>.</p>
<p>Write <code>solve(n, deps)</code> and return any order that satisfies every dependency, as a list of all <code>n</code> tasks. If the dependencies loop back on themselves, return <code>[]</code>.</p>`,
  show: `Every read of <code>deps[i]</code> lights up that arrow. Name your counts <code>indeg</code>, your ready list <code>queue</code> and your result <code>order</code> to see them on the graph.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>In queue</span><span><i class="sw visited"></i>Scheduled</span>`,
  starter: `from collections import deque


def solve(n, deps):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    # Build the graph once: for a, b in deps ...

    queue = deque()  # tasks with no unmet dependencies
    order = []

    # Kahn's algorithm: repeatedly take a ready task, add it
    # to order, and lower the indeg of the tasks after it.
    # If order ends up shorter than n, there's a cycle.

    return order
`,
  watch: ["indeg","indegree","in_degree","indegrees","deg","queue","q","ready","stack","frontier","order","res","result","ans","output","visited","state"], panel: ["queue", "q", "ready", "stack", "order", "res", "result", "visited"],
  editor: "random", arrArg: 1,
  levels(){ return [lvl("t1", "Night shift", {n:6, deps:[[0,1],[0,2],[1,3],[2,3],[3,4],[5,4]]}), lvl("t2", "Two crews", {n:7, deps:[[0,1],[1,2],[3,4],[4,5],[2,6],[5,6]]}), lvl("t3", "Circular wait", {n:4, deps:[[0,1],[1,2],[2,3],[3,1]]}), lvl("t4", "Free for all", {n:5, deps:[]})]; },
  hidden(){
    const rng = mkRng(17), n = 40, perm = Array.from({length:n}, (_, i) => i).sort(() => rng() - .5), deps = [];
    for (let k = 0; k < 90; k++){ const a = ri(rng, 0, n-2), b = ri(rng, a+1, n-1); deps.push([perm[a], perm[b]]); }
    const cyc = deps.slice(); cyc.push([perm[n-1], perm[0]]);
    return [lvl("h1", "One task", {n:1, deps:[]}), lvl("h2", "A long chain", {n:8, deps:[[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0]]}), lvl("h3", "Task depends on itself", {n:3, deps:[[0,1],[2,2]]}), lvl("h4", "Forty tasks", {n, deps}), lvl("h5", "Forty tasks with one loop", {n, deps:cyc})];
  },
  ref(L){ const g = Array.from({length:L.n}, () => []), d = Array(L.n).fill(0); L.deps.forEach(([a, b]) => { g[a].push(b); d[b]++; }); const q = []; d.forEach((x, i) => { if (!x) q.push(i); }); const o = []; while (q.length){ const x = q.shift(); o.push(x); g[x].forEach(y => { if (!--d[y]) q.push(y); }); } return o.length === L.n ? o : null; },
  case(L){ return {args:[L.n, L.deps], arr:[1]}; },
  check(L, ret){
    const ref = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of task numbers, or [] if there’s a cycle.");
    if (!ref){ return ret.length ? bad("There’s a cycle", "These dependencies loop back on themselves, so no order works. Return []." ) : ok("Cycle detected", "The dependencies loop, and you correctly returned []."); }
    if (!ret.length) return bad("Order exists", "You returned [], but a valid order exists, for example " + pyRepr(ref) + ".");
    if (ret.length !== L.n || new Set(ret).size !== L.n || ret.some(x => x < 0 || x >= L.n || !Number.isInteger(x))) return bad("Not every task once", "The order must list each task from 0 to " + (L.n - 1) + " exactly once. Yours has " + ret.length + " entries.");
    const pos = new Map(ret.map((x, i) => [x, i]));
    for (const [a, b] of L.deps) if (pos.get(a) > pos.get(b)) return bad("Dependency broken", "Task " + a + " must come before task " + b + ", but your order has it after.");
    return ok("Valid order", "Every dependency is respected.");
  },
  budget(L){ return 3 * L.deps.length + 4; },
  retOrder: true, size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.indeg || w.indegree || w.in_degree)) ? [] : ["indeg"]; },
  random(L){ const n = ri(Math.random, 5, 8), perm = Array.from({length:n}, (_, i) => i).sort(() => Math.random() - .5), deps = [], seen = new Set(); for (let k = 0; k < n + 1; k++){ const a = ri(Math.random, 0, n-2), b = ri(Math.random, a+1, n-1), key = perm[a] + "," + perm[b]; if (!seen.has(key)){ seen.add(key); deps.push([perm[a], perm[b]]); } } L.n = n; L.deps = deps; }
};
