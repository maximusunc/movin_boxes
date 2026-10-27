import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawGraph, sizeGraph } from "../views/graph.js";

/* ---------- L4: find the deadlock (directed cycle) ---------- */
function dag(rng, n, m){
  const perm = Array.from({length: n}, (_, i) => i).sort(() => rng() - .5), out = [], seen = new Set();
  for (let tries = 0; out.length < m && tries < m * 40; tries++){ const a = ri(rng, 0, n - 2), b = ri(rng, a + 1, n - 1), k = perm[a] + "," + perm[b]; if (!seen.has(k)){ seen.add(k); out.push([perm[a], perm[b]]); } }
  return {deps: out, perm};
}
export const DeadlockProblem = {
  id: "deadlock", tier: 4, tab: "Deadlock", pattern: "Cycle detection", fname: "find_deadlock.py", levelNoun: "task boards",
  title: "Find the deadlock", sig: "n, waits", input: "array", view: "graph",
  brief: `<p>There are <code>n</code> tasks, numbered <code>0</code> to <code>n - 1</code>. Each pair <code>(a, b)</code> in <code>waits</code> means task <code>a</code> can’t finish until task <code>b</code> does. A deadlock is a loop of tasks that are all waiting on each other.</p>
<p>Write <code>solve(n, waits)</code> and return one deadlock as a list of tasks in order, where each task waits on the next one and the last waits on the first. Any loop counts, including a task waiting on itself. Return <code>[]</code> if there’s no deadlock.</p>`,
  show: `Every read of <code>waits[i]</code> lights up that arrow. Name your DFS state <code>state</code> (or <code>color</code>) to see it under each task, and your current path <code>path</code>. When you return a loop, its tasks get numbered badges and its arrows turn green.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>In queue</span><span><i class="sw okring"></i>Returned loop</span>`,
  watch: ["state", "color", "colour", "path", "stack", "on_stack", "onpath", "parent"], panel: ["path", "on_stack", "onpath"],
  editor: "random", edgeArg: 1, graphOf: L => ({n: L.n, edges: L.waits}), retOrder: true,
  nodeLabels: {names: ["state", "color", "colour"], prefix: ""},
  levels(){ return [lvl("d1", "Three-way wait", {n:5, waits:[[0,1],[1,2],[2,3],[3,1],[3,4]]}), lvl("d2", "No deadlock", {n:5, waits:[[0,1],[0,2],[1,3],[2,3],[3,4]]}), lvl("d3", "Waiting on itself", {n:4, waits:[[0,1],[1,2],[2,2],[3,0]]}), lvl("d4", "Hidden behind a chain", {n:7, waits:[[0,1],[1,2],[2,3],[4,5],[5,6],[6,4],[3,4]]})]; },
  hidden(){
    const a = dag(mkRng(81), 30, 60), b = dag(mkRng(82), 30, 60);
    b.deps.push([b.perm[25], b.perm[5]]);
    return [lvl("h1", "One task", {n:1, waits:[]}), lvl("h2", "Two tasks waiting on each other", {n:2, waits:[[0,1],[1,0]]}), lvl("h3", "Thirty tasks, no deadlock", {n:30, waits:a.deps}),
      lvl("h4", "Thirty tasks, one long loop", {n:30, waits:b.deps}), lvl("h5", "Separate groups", {n:6, waits:[[0,1],[2,3],[3,4],[4,5],[5,3]]})];
  },
  findCycle(L){
    const g = Array.from({length: L.n}, () => []); L.waits.forEach(([a, b]) => g[a].push(b));
    const st = Array(L.n).fill(0), path = [];
    const dfs = x => { st[x] = 1; path.push(x); for (const y of g[x]){ if (st[y] === 1) return path.slice(path.indexOf(y)); if (st[y] === 0){ const c = dfs(y); if (c) return c; } } st[x] = 2; path.pop(); return null; };
    for (let s = 0; s < L.n; s++) if (!st[s]){ const c = dfs(s); if (c) return c; }
    return null;
  },
  case(L){ return {args:[L.n, L.waits], arr:[1]}; },
  check(L, ret){
    const ref = this.findCycle(L);
    if (!isIntArr(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of task numbers, or [] if there’s no deadlock.");
    if (!ret.length) return ref ? bad("Missed a deadlock", "You returned [], but these tasks wait on each other in a loop: " + pyRepr(ref) + ".") : ok("No deadlock", "Every task can eventually finish.");
    if (!ref) return bad("There’s no deadlock", "These tasks can all finish, so return [].");
    if (ret.some(x => x < 0 || x >= L.n) || new Set(ret).size !== ret.length) return bad("Not a loop", "A deadlock lists each task once, using task numbers from 0 to " + (L.n - 1) + ".");
    const has = new Set(L.waits.map(([a, b]) => a + "," + b));
    for (let i = 0; i < ret.length; i++){ const a = ret[i], b = ret[(i + 1) % ret.length]; if (!has.has(a + "," + b)) return bad("Not a loop", "Task " + a + " doesn’t wait on task " + b + ", so " + pyRepr(ret) + " isn’t a loop." + (i === ret.length - 1 ? " The last task has to wait on the first." : "")); }
    return ok("Deadlock found", "Tasks " + ret.join(" → ") + " → " + ret[0] + " wait on each other.");
  },
  retEdges(ret, L){
    if (!isIntArr(ret) || !ret.length) return null;
    const want = new Set(ret.map((a, i) => a + "," + ret[(i + 1) % ret.length])), s = new Set();
    L.waits.forEach(([a, b], i) => { if (want.has(a + "," + b)) s.add(i); });
    return s;
  },
  budget(L){ return 3 * L.waits.length + 4; },
  size(w){ return sizeGraph(w); }, draw(){ drawGraph(); },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.state || w.color || w.colour || w.path || w.stack)) ? [] : ["state"]; },
  random(L){ const n = ri(Math.random, 4, 7), d = dag(Math.random, n, n + 1); if (Math.random() < .6){ const i = ri(Math.random, 1, n - 1), j = ri(Math.random, 0, i - 1); d.deps.push([d.perm[i], d.perm[j]]); } L.n = n; L.waits = d.deps; }
};
