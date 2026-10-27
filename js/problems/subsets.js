import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: every possible bundle (subsets / backtracking) ---------- */
const sorted = c => c.slice().sort((a, b) => a - b);
const key = c => sorted(c).join(",");
export const SubsetsProblem = {
  id: "subsets", tier: 1, tab: "Every bundle", pattern: "Backtracking", fname: "every_bundle.py", levelNoun: "docks",
  title: "List every possible bundle", sig: "weights", input: "array", view: "array",
  brief: `<p>The packer can shrink-wrap any group of the packages on the dock into one bundle, including no packages at all and all of them. <code>weights[i]</code> is the weight of package <code>i</code>, and every weight is different.</p>
<p>Write <code>solve(weights)</code> and return every possible bundle, as a list of lists of weights. Bundles can come in any order, and so can the weights inside each one.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that package. Name the bundle you’re building <code>path</code> and your answer <code>res</code> to watch the search take a package, back out, and try without it.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(weights):
    res = []
    path = []  # the bundle being built

    def backtrack(i):
        # Every partial bundle is an answer: record a copy.
        res.append(path[:])
        # Try adding each package from i onwards, recurse,
        # then take it back out (append, backtrack, pop).

    backtrack(0)
    return res
`,
  watch: ["path", "bundle", "cur", "current", "res", "result", "out", "ans", "i", "start"], pointers: ["i", "start"],
  panel: ["path", "bundle", "cur", "current", "res", "result", "out", "ans"], arrArg: 0, arrLabel2: "weights",
  editor: "random",
  arrayOf: L => L.weights,
  levels(){ return [lvl("s1", "Three packages", {weights:[1,2,3]}), lvl("s2", "Two packages", {weights:[5,9]}), lvl("s3", "Four packages", {weights:[4,1,7,2]})]; },
  hidden(){ return [lvl("h1", "Empty dock", {weights:[]}), lvl("h2", "One package", {weights:[6]}), lvl("h3", "Eight packages", {weights:[8,3,12,5,1,9,14,2]}), lvl("h4", "Six packages", {weights:[10,20,30,40,50,60]})]; },
  ref(L){ const w = L.weights, out = []; for (let m = 0; m < (1 << w.length); m++) out.push(w.filter((_, i) => m & (1 << i))); return out; },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(c => !Array.isArray(c) || c.some(x => typeof x !== "number"))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of bundles, each a list of weights.");
    const seen = new Set();
    for (const c of ret){
      if (c.some(x => !L.weights.includes(x)) || new Set(c).size !== c.length) return bad("Not a real bundle", pyRepr(c) + " uses a weight that isn’t on the dock, or uses a package twice.");
      if (seen.has(key(c))) return bad("Duplicate bundle", pyRepr(sorted(c)) + " appears more than once. List each bundle once.");
      seen.add(key(c));
    }
    const missing = want.filter(c => !seen.has(key(c)));
    if (missing.length) return bad("Missed some bundles", "You found " + ret.length + " of " + want.length + ". For example, " + pyRepr(sorted(missing[0])) + " is missing" + (missing[0].length ? "." : " (the empty bundle counts too)."));
    return ok("Every bundle found", "There are " + want.length + " bundles: 2 to the power of " + L.weights.length + ".");
  },
  budget(L){ return 2 * L.weights.length * (1 << L.weights.length) + 8; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.path || w.bundle || w.cur || w.current)) ? [] : ["path"]; },
  random(L){ const n = ri(Math.random, 2, 4), w = []; while (w.length < n){ const x = ri(Math.random, 1, 20); if (!w.includes(x)) w.push(x); } L.weights = w; }
};
