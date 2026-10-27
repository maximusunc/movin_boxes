import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: weigh the aisle sections (prefix sums) ---------- */
export const RangesProblem = {
  id: "ranges", tier: 1, tab: "Section weights", pattern: "Prefix sums", fname: "section_weights.py", levelNoun: "aisles",
  title: "Weigh the aisle sections", sig: "weights, queries", input: "array", view: "array",
  brief: `<p>Pallets stand in a row and <code>weights[i]</code> is the weight of pallet <code>i</code>. The floor manager sends a list of <code>queries</code>; each <code>(l, r)</code> asks for the total weight of pallets <code>l</code> through <code>r</code>, both included.</p>
<p>Write <code>solve(weights, queries)</code> and return a list with one total per query, in order.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that pallet. Name your running totals <code>prefix</code> to see them fill in. Adding up each section from scratch piles dots onto the pallets that many queries share.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(weights, queries):
    prefix = [0]  # prefix[i] = total weight of pallets 0 .. i-1

    # Build prefix once: each entry is the previous total
    # plus one more pallet. Then the total of l..r is
    # prefix[r + 1] - prefix[l], with no loop per query.

    return []
`,
  watch: ["prefix", "pre", "sums", "ps", "acc", "ans", "res", "result", "out", "i"], pointers: ["i"], panel: ["prefix", "pre", "sums", "ps", "acc", "ans", "res", "result", "out"], arrArg: 0, arrLabel2: "pallet weights",
  editor: "random",
  arrayOf: L => L.weights, extraLabel: L => L.queries.length <= 3 ? "queries " + L.queries.map(q => q[0] + "–" + q[1]).join(", ") : L.queries.length + " queries",
  levels(){ return [lvl("q1", "Three sections", {weights:[4,2,7,1,3,5], queries:[[0,2],[2,4],[1,5]]}), lvl("q2", "Single pallets", {weights:[9,3,6,2], queries:[[0,0],[3,3],[1,1]]}), lvl("q3", "Whole row", {weights:[5,8,1,9,4,6,2,7], queries:[[0,7],[3,6],[2,2],[0,3]]})]; },
  hidden(){
    const rng = mkRng(19), big = Array.from({length:60}, () => ri(rng, 1, 99));
    const qs = Array.from({length:40}, () => { const l = ri(rng, 0, 20); return [l, ri(rng, l + 25, 59)]; });
    return [lvl("h1", "One pallet, one query", {weights:[7], queries:[[0,0]]}), lvl("h2", "No queries", {weights:[1,2,3], queries:[]}),
      lvl("h3", "Same section twice", {weights:[3,1,4,1,5], queries:[[1,3],[1,3]]}), lvl("h4", "Sixty pallets, forty long sections", {weights:big, queries:qs})];
  },
  ref(L){ const p = [0]; L.weights.forEach(w => p.push(p[p.length - 1] + w)); return L.queries.map(([l, r]) => p[r + 1] - p[l]); },
  case(L){ return {args:[L.weights, L.queries], arr:[0, 1]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one total per query.");
    if (ret.length !== want.length) return bad("Wrong number of totals", "There " + (want.length === 1 ? "is 1 query" : "are " + want.length + " queries") + ", but you returned " + ret.length + " total" + (ret.length === 1 ? "" : "s") + ".");
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]){ const [l, r] = L.queries[i]; return bad("Wrong total", "Query " + i + " asks for pallets " + l + " to " + r + ", which weigh " + want[i] + " together, but you returned " + ret[i] + "."); }
    return ok("Sections weighed", want.length ? (want.length <= 6 ? "The totals are " + pyRepr(want) + "." : "All " + want.length + " totals are right.") : "No queries, so an empty list is right.");
  },
  budget(L){ return 2 * L.weights.length + 3 * L.queries.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.prefix || w.pre || w.sums || w.ps)) ? [] : ["prefix"]; },
  random(L){ const n = ri(Math.random, 5, 10); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 20)); L.queries = Array.from({length: ri(Math.random, 2, 3)}, () => { const l = ri(Math.random, 0, n - 1); return [l, ri(Math.random, l, n - 1)]; }); }
};
