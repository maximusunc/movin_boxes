import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: crush the crates (interval DP, burst balloons) ---------- */
function bestScore(v){
  const a = [1, ...v, 1], n = a.length, dp = Array.from({length: n}, () => Array(n).fill(0));
  for (let len = 2; len < n; len++) for (let l = 0; l + len < n; l++){ const r = l + len; for (let k = l + 1; k < r; k++) dp[l][r] = Math.max(dp[l][r], dp[l][k] + dp[k][r] + a[l]*a[k]*a[r]); }
  return dp[0][n - 1];
}
export const BurstProblem = {
  id: "burst", tier: 5, tab: "Crush the crates", pattern: "Interval DP", fname: "crush_the_crates.py", levelNoun: "rows",
  title: "Crush the crates in the best order", sig: "crates", input: "array", view: "array",
  brief: `<p>A row of damaged crates goes to the crusher one at a time, in any order you choose. <code>crates[i]</code> is crate <code>i</code>’s scrap rating. Crushing a crate earns its rating times the ratings of its current left and right neighbours. Crushed crates leave the row, so their neighbours become neighbours. Past either end of the row, count the missing neighbour as <code>1</code>.</p>
<p>Write <code>solve(crates)</code> and return the most you can earn by crushing every crate.</p>`,
  show: `Every <code>crates[i]</code> read drops a dot under that crate. Think about which crate is crushed <em>last</em> in a stretch: name your table <code>dp</code> (or a <code>memo</code> keyed by the stretch’s ends). Trying every order reads the row an enormous number of times.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dp", "memo", "best", "l", "r", "k", "left", "right"], pointers: ["l", "r", "k", "left", "right"], panel: ["dp", "memo", "best"], arrArg: 0, arrLabel2: "scrap ratings",
  editor: "array", arr: "crates", arrLabel: "Scrap ratings", lim: null, maxN: 12, maxV: 99,
  arrayOf: L => L.crates,
  levels(){ return [lvl("b1", "Four crates", {crates:[3,1,5,8]}), lvl("b2", "Two crates", {crates:[1,5]}), lvl("b3", "Middle first?", {crates:[2,9,2]}), lvl("b4", "Six crates", {crates:[7,2,8,3,1,6]})]; },
  hidden(){
    const rng = mkRng(113), row = n => Array.from({length: n}, () => ri(rng, 1, 9));
    return [lvl("h1", "No crates", {crates:[]}), lvl("h2", "One crate", {crates:[7]}), lvl("h3", "Ten crates", {crates:row(10)}), lvl("h4", "Twelve crates", {crates:row(12)}), lvl("h5", "Zeros in the row", {crates:[0,4,0,6,2]})];
  },
  case(L){ return {args:[L.crates], arr:[0]}; },
  check(L, ret){
    const best = bestScore(L.crates);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the best total as a number.");
    if (ret !== best) return bad("Not the best order", "The best order earns " + best + ", but you returned " + ret + ".");
    return ok("Best order found", "Crushing in the best order earns " + best + ".");
  },
  // A table over (left, right, last crate) that re-reads crates[] in the inner loop stays within this.
  budget(L){ const n = L.crates.length + 2; return 4 * n * n * n + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo)) ? [] : ["dp"]; },
  random(L){ L.crates = Array.from({length: ri(Math.random, 3, 6)}, () => ri(Math.random, 1, 9)); }
};
