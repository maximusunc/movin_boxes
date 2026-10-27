import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: pack the truck exactly (backtracking) ---------- */
const key = c => c.slice().sort((a, b) => a - b).join(",");
const sorted = c => c.slice().sort((a, b) => a - b);
export const PackProblem = {
  id: "pack", tier: 4, tab: "Pack exactly", pattern: "Backtracking", fname: "pack_exactly.py", levelNoun: "loads",
  title: "Pack the truck exactly", sig: "weights, target", input: "array", view: "array",
  brief: `<p>A truck must leave carrying exactly <code>target</code> kilograms. <code>weights[i]</code> is the weight of package <code>i</code>; every weight is a different positive whole number, and each package can go on the truck at most once.</p>
<p>Write <code>solve(weights, target)</code> and return every combination of packages that adds up to exactly <code>target</code>, as a list of lists of weights. Combinations can come in any order, and so can the weights inside each one. Return <code>[]</code> if nothing works.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that package. Name the combination you’re building <code>path</code> and your answer <code>res</code> to watch the search choose a package, back out and try the next one.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["path", "combo", "cur", "current", "chosen", "res", "result", "out", "ans", "i", "start", "remaining", "total"], pointers: ["i", "start"],
  panel: ["path", "combo", "cur", "current", "chosen", "res", "result", "out", "ans"], arrArg: 0, arrLabel2: "weights",
  editor: "random",
  arrayOf: L => L.weights, extraLabel: L => "target " + L.target,
  levels(){ return [lvl("p1", "Small load", {weights:[2,3,5,7,8], target:10}), lvl("p2", "Several ways", {weights:[1,4,6,3,5,2], target:9}), lvl("p3", "No exact fit", {weights:[4,6,10,12], target:7}), lvl("p4", "Whole load", {weights:[3,9,1,5], target:18})]; },
  hidden(){
    const rng = mkRng(44), pool = []; while (pool.length < 12){ const w = ri(rng, 1, 25); if (!pool.includes(w)) pool.push(w); }
    return [lvl("h1", "One package, exact", {weights:[7], target:7}), lvl("h2", "Target heavier than everything", {weights:[2,4,6], target:40}),
      lvl("h3", "Only one package fits", {weights:[5,11,17], target:11}), lvl("h4", "Twelve packages", {weights:pool, target:40}),
      lvl("h5", "Weights 12 down to 1, target 15", {weights:[12,11,10,9,8,7,6,5,4,3,2,1], target:15})];
  },
  ref(L){
    const w = L.weights, out = [];
    for (let m = 1; m < (1 << w.length); m++){ let s = 0; const c = []; w.forEach((x, i) => { if (m & (1 << i)){ s += x; c.push(x); } }); if (s === L.target) out.push(c); }
    return out;
  },
  case(L){ return {args:[L.weights, L.target], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(c => !Array.isArray(c) || c.some(x => typeof x !== "number"))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of combinations, each a list of weights.");
    const seen = new Set();
    for (const c of ret){
      if (c.some(x => !L.weights.includes(x)) || new Set(c).size !== c.length) return bad("Not a real combination", pyRepr(c) + " uses a weight that isn’t on the dock, or uses a package twice.");
      const s = c.reduce((a, x) => a + x, 0);
      if (s !== L.target) return bad("Wrong total", pyRepr(c) + " weighs " + s + ", not " + L.target + ".");
      if (seen.has(key(c))) return bad("Duplicate combination", pyRepr(sorted(c)) + " appears more than once. List each combination once.");
      seen.add(key(c));
    }
    const missing = want.filter(c => !seen.has(key(c)));
    if (missing.length) return bad("Missed some combinations", "You found " + ret.length + " of " + want.length + ". For example, " + pyRepr(sorted(missing[0])) + " also adds up to " + L.target + ".");
    if (!want.length) return ok("Correct", "No combination weighs exactly " + L.target + ", and you returned [].");
    return ok("Every load found", want.length + " combination" + (want.length === 1 ? " adds" : "s add") + " up to " + L.target + (want.length <= 4 ? ": " + pyRepr(want.map(sorted)) : "") + ".");
  },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.path || w.combo || w.cur || w.current || w.chosen)) ? [] : ["path"]; },
  random(L){ const n = ri(Math.random, 5, 8), w = []; while (w.length < n){ const x = ri(Math.random, 1, 20); if (!w.includes(x)) w.push(x); } L.weights = w; L.target = w.filter(() => Math.random() < .45).reduce((a, x) => a + x, 0) || w[0]; }
};
