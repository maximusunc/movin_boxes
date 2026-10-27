import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: pick crates, never two neighbours (1D dynamic programming) ---------- */
function best(v){
  // dp over the row, plus one set of picks that reaches the best total
  const n = v.length, dp = Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) dp[i + 1] = Math.max(dp[i], (i ? dp[i - 1] : 0) + v[i]);
  const picks = new Set(); for (let i = n; i > 0; ){ if (dp[i] === dp[i - 1]) i--; else { picks.add(i - 1); i -= 2; } }
  return {total: dp[n], picks};
}
export const RobberProblem = {
  id: "robber", tier: 2, tab: "No neighbours", pattern: "Dynamic programming", fname: "no_neighbours.py", levelNoun: "rows",
  title: "Pick crates, but never two neighbours", sig: "values", input: "array", view: "array",
  brief: `<p>A row of crates is up for the end-of-day pick. <code>values[i]</code> is what crate <code>i</code> is worth. The scanner jams if it picks two crates that sit next to each other.</p>
<p>Write <code>solve(values)</code> and return the largest total value you can pick without ever taking two neighbouring crates. Picking nothing is allowed, so the answer is at least <code>0</code>.</p>`,
  show: `Every <code>values[i]</code> read drops a dot under that crate. Name your running bests <code>take</code> and <code>skip</code>, or a table <code>dp</code>. Plain recursion asks about the same crates again and again, and the dots pile up.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>A best pick</span>`,
  watch: ["dp", "memo", "take", "skip", "prev", "cur", "curr", "best", "i"], pointers: ["i"], panel: ["dp", "memo", "take", "skip", "prev", "cur", "curr", "best"], arrArg: 0, arrLabel2: "crate values",
  editor: "array", arr: "values", arrLabel: "Crate values", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.values,
  levels(){ return [lvl("r1", "Short row", {values:[1,2,3,1]}), lvl("r2", "Skip two", {values:[2,7,9,3,1]}), lvl("r3", "Big ends", {values:[9,1,1,9,1,1,9]}), lvl("r4", "Every other isn’t best", {values:[5,1,1,5]})]; },
  hidden(){
    const rng = mkRng(71), long = Array.from({length:20}, () => ri(rng, 1, 60));
    return [lvl("h1", "No crates", {values:[]}), lvl("h2", "One crate", {values:[6]}), lvl("h3", "Two crates", {values:[4,9]}), lvl("h4", "All the same", {values:[3,3,3,3,3]}),
      lvl("h5", "Eighteen crates", {values:long.slice(0, 18)}), lvl("h6", "Twenty crates", {values:long})];
  },
  case(L){ return {args:[L.values], arr:[0]}; },
  check(L, ret){
    const {total} = best(L.values);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the best total as a number.");
    if (ret !== total) return bad("Not the best pick", "The best total is " + total + ", but you returned " + ret + "." + (ret > total ? " Check that you never take two neighbouring crates." : ""));
    return ok("Best pick found", "The scanner can collect " + total + " without a jam.");
  },
  highlight(ret, L){ return best(L.values).picks; },
  budget(L){ return 2 * L.values.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo || w.take != null || w.prev != null)) ? [] : ["dp"]; },
  random(L){ L.values = Array.from({length: ri(Math.random, 5, 10)}, () => ri(Math.random, 1, 30)); }
};
