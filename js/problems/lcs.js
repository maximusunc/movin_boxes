import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: letters two labels share (longest common subsequence) ---------- */
function lcsLen(a, b){
  const m = a.length, n = b.length, dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}
export const LcsProblem = {
  id: "lcs", tier: 3, tab: "Shared letters", pattern: "2D dynamic programming", fname: "shared_letters.py", levelNoun: "label pairs",
  title: "How much do two scans share?", sig: "a, b", input: "array", view: "array",
  brief: `<p>Two scanners read the same label, but each one skipped some letters. You can match them up by keeping letters from each in their original order. The letters you keep don’t have to be next to each other.</p>
<p>Write <code>solve(a, b)</code> and return the length of the longest run of letters that appears, in order, in both strings.</p>`,
  show: `The boxes are the letters of <code>a</code>, and every <code>a[i]</code> read drops a dot under one. Reads of <code>b</code> count too. Name your table <code>dp</code> (or the rows <code>prev</code> and <code>cur</code>) to see it in the panel. Plain recursion without a memo compares the same letters over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dp", "memo", "prev", "cur", "row", "i"], pointers: ["i"], panel: ["prev", "cur", "row"], arrArg: 0, arrLabel2: "a",
  editor: "random",
  arrayOf: L => [...L.a], extraLabel: L => "b: " + (L.b || "(empty)"),
  levels(){ return [lvl("c1", "Skipped letters", {a:"ABCDE", b:"ACE"}), lvl("c2", "Nothing shared", {a:"ABC", b:"DEF"}), lvl("c3", "Same label", {a:"PALLET", b:"PALLET"}), lvl("c4", "Mixed up", {a:"FORKLIFT", b:"FLOATRIFT"})]; },
  hidden(){
    return [lvl("h1", "Empty first", {a:"", b:"BOX"}), lvl("h2", "Both empty", {a:"", b:""}), lvl("h3", "One letter", {a:"Q", b:"AQB"}),
      lvl("h4", "Fourteen by fourteen", {a:"WAREHOUSEZONEA", b:"HOUSEWAREAZONE"}), lvl("h5", "Nothing in common", {a:"ABCDEFGHIJKLMN", b:"OPQRSTUVWXYZOP"})];
  },
  case(L){ return {args:[L.a, L.b], arr:[0, 1]}; },
  check(L, ret){
    const want = lcsLen(L.a, L.b);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the length as a number.");
    if (ret !== want) return bad("Wrong length", JSON.stringify(L.a) + " and " + JSON.stringify(L.b) + " share " + want + " letter" + (want === 1 ? "" : "s") + " in order, but you returned " + ret + ".");
    return ok("Correct", want ? "The scans share " + want + " letter" + (want === 1 ? "" : "s") + " in order." : "The scans share nothing.");
  },
  budget(L){ return 3 * (L.a.length + 1) * (L.b.length + 1) + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo || w.prev || w.cur)) ? [] : ["dp"]; },
  random(L){ const s = n => Array.from({length: n}, () => "ABCDE"[ri(Math.random, 0, 4)]).join(""); L.a = s(ri(Math.random, 4, 9)); L.b = s(ri(Math.random, 4, 9)); }
};
