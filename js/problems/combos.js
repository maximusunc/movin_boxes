import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: pick k crates (combinations / backtracking) ---------- */
export const CombosProblem = {
  id: "combos", tier: 2, tab: "Pick k crates", pattern: "Backtracking", fname: "pick_k_crates.py", levelNoun: "picks",
  title: "Every way to pick k crates", sig: "n, k", input: "array", view: "array",
  brief: `<p>The dock holds crates numbered <code>1</code> to <code>n</code>, and the inspector samples exactly <code>k</code> of them. The order inside a sample doesn’t matter.</p>
<p>Write <code>solve(n, k)</code> and return every possible sample, as a list of lists of crate numbers. Samples can come in any order.</p>`,
  show: `The input is just two numbers, so nothing gets read here. The boxes show the crates you’re choosing from, and the samples you return are listed underneath.`,
  legend: `<span><i class="sw okring"></i>In the first sample</span>`,
  watch: [], arrLabel2: "crates on the dock",
  editor: "random",
  arrayOf: L => Array.from({length: L.n}, (_, i) => i + 1), extraLabel: L => "k = " + L.k,
  levels(){ return [lvl("c1", "4 choose 2", {n:4, k:2}), lvl("c2", "5 choose 3", {n:5, k:3}), lvl("c3", "Take one", {n:4, k:1})]; },
  hidden(){ return [lvl("h1", "Take them all", {n:5, k:5}), lvl("h2", "One crate", {n:1, k:1}), lvl("h3", "10 choose 4", {n:10, k:4}), lvl("h4", "10 choose 5", {n:10, k:5}), lvl("h5", "Take none", {n:3, k:0})]; },
  ref(L){ const out = []; const go = (start, path) => { if (path.length === L.k){ out.push(path); return; } for (let x = start; x <= L.n; x++) go(x + 1, path.concat([x])); }; go(1, []); return out; },
  case(L){ return {args:[L.n, L.k], arr:[]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(c => !Array.isArray(c) || c.some(x => typeof x !== "number"))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of samples, each a list of crate numbers.");
    const seen = new Set();
    for (const c of ret){
      if (c.length !== L.k || new Set(c).size !== c.length || c.some(x => !Number.isInteger(x) || x < 1 || x > L.n)) return bad("Not a valid sample", pyRepr(c) + " should be " + L.k + " different crates from 1 to " + L.n + ".");
      const k = c.slice().sort((a, b) => a - b).join(",");
      if (seen.has(k)) return bad("Duplicate sample", pyRepr(c) + " is the same sample as one you already listed.");
      seen.add(k);
    }
    const missing = want.filter(c => !seen.has(c.join(",")));
    if (missing.length) return bad("Missed some samples", "You found " + ret.length + " of " + want.length + ". For example, " + pyRepr(missing[0]) + " is missing" + (L.k ? "." : ": picking zero crates is one sample, the empty one."));
    return ok("Every sample found", "There are " + want.length + " ways to pick " + L.k + " of " + L.n + " crates.");
  },
  highlight(ret, L){ return Array.isArray(ret) && Array.isArray(ret[0]) ? new Set(ret[0].filter(x => Number.isInteger(x) && x >= 1 && x <= L.n).map(x => x - 1)) : null; },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; },
  random(L){ L.n = ri(Math.random, 3, 7); L.k = ri(Math.random, 1, L.n); }
};
