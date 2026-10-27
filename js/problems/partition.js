import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: two equal loads (subset sum) ---------- */
function half(w){
  const total = w.reduce((a, b) => a + b, 0); if (total % 2) return {can: false, pick: null};
  const t = total / 2, from = Array(t + 1).fill(-2); from[0] = -1;
  w.forEach((x, i) => { for (let s = t; s >= x; s--) if (from[s] === -2 && from[s - x] !== -2) from[s] = i; });
  if (from[t] === -2) return {can: false, pick: null};
  const pick = new Set(); for (let s = t; s > 0; ){ const i = from[s]; pick.add(i); s -= w[i]; }
  return {can: true, pick};
}
export const PartitionProblem = {
  id: "partition", tier: 4, tab: "Equal loads", pattern: "Subset-sum DP", fname: "equal_loads.py", levelNoun: "batches",
  title: "Split into two equal loads", sig: "weights", input: "array", view: "array",
  brief: `<p>Two trucks leave at the same time and the dispatcher wants them balanced exactly. <code>weights[i]</code> is the weight of package <code>i</code>, and every package must go on one truck or the other.</p>
<p>Write <code>solve(weights)</code> and return <code>True</code> if the packages can be split into two loads of exactly the same total weight, otherwise <code>False</code>.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that package. Name your set of reachable totals <code>sums</code>, or a table <code>dp</code>, to see it in the panel. Trying every way to split the packages reads them over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>One truck’s load</span>`,
  watch: ["sums", "reach", "possible", "dp", "memo", "target", "half", "total", "i"], pointers: ["i"], panel: ["sums", "reach", "possible", "dp", "memo", "target", "half"], arrArg: 0, arrLabel2: "package weights",
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.weights,
  levels(){ return [lvl("p1", "Balances", {weights:[1,5,11,5]}), lvl("p2", "Can’t balance", {weights:[1,2,3,5]}), lvl("p3", "Odd total", {weights:[2,4,7]}), lvl("p4", "Many small", {weights:[3,1,1,2,2,1]})]; },
  hidden(){
    const rng = mkRng(101), even = Array.from({length:24}, () => 2 * ri(rng, 1, 20));
    return [lvl("h1", "One package", {weights:[4]}), lvl("h2", "Two the same", {weights:[9,9]}), lvl("h3", "Even total, no split", {weights:Array(14).fill(4).concat([2])}),
      lvl("h4", "Twenty-four packages", {weights:even}), lvl("h5", "One heavy package", {weights:Array(12).fill(1).concat([12])})];
  },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const {can} = half(L.weights), total = L.weights.reduce((a, b) => a + b, 0);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== can) return bad("Wrong answer", can ? "The packages can be split into two loads of " + total / 2 + ", but you returned False." : total % 2 ? "The total weight is " + total + ", an odd number, so it can’t be split evenly. You returned True." : "No set of packages adds up to exactly " + total / 2 + ", so the trucks can’t balance. You returned True.");
    return ok("Correct", can ? "Each truck can carry exactly " + total / 2 + "." : "These packages can’t be balanced, and you caught it.");
  },
  highlight(ret, L){ return ret === true ? half(L.weights).pick : null; },
  // A table over packages × reachable totals, re-reading weights[i] per cell, stays within this.
  budget(L){ const t = Math.floor(L.weights.reduce((a, b) => a + b, 0) / 2); return 2 * L.weights.length * (t + 1) + 2 * L.weights.length + 10; },
  tip(run){ return run.wAt.some(w => w && (w.sums || w.reach || w.possible || w.dp || w.memo)) ? [] : ["sums"]; },
  random(L){ L.weights = Array.from({length: ri(Math.random, 4, 8)}, () => ri(Math.random, 1, 15)); }
};
