import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: fix the label (edit distance, 2D DP) ---------- */
function editDistance(a, b){
  const m = a.length, n = b.length, dp = Array.from({length:m + 1}, (_, i) => Array.from({length:n + 1}, (_, j) => i ? (j ? 0 : i) : j));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}
export const EditProblem = {
  id: "edit", tier: 5, tab: "Fix the label", pattern: "2D dynamic programming", fname: "fix_the_label.py", levelNoun: "labels",
  title: "Fix the misprinted label", sig: "printed, wanted", input: "array", view: "array",
  brief: `<p>The label printer smudged a batch. <code>printed</code> is what came out and <code>wanted</code> is what the label should say. The relabeler can insert one character, delete one character, or replace one character with another, one edit at a time.</p>
<p>Write <code>solve(printed, wanted)</code> and return the fewest edits that turn <code>printed</code> into <code>wanted</code>. Both are strings.</p>`,
  show: `The boxes are the characters of <code>printed</code>, and every <code>printed[i]</code> read drops a dot under one. Name your table <code>dp</code>, or the rows <code>prev</code> and <code>cur</code>, to see them in the panel. Plain recursion without a memo re-reads the same characters over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dp", "memo", "prev", "cur", "row"], pointers: [], panel: ["prev", "cur", "row"], arrArg: 0, arrLabel2: "printed",
  editor: "random",
  arrayOf: L => [...L.printed], extraLabel: L => "wanted: " + (L.wanted || "(empty)"),
  levels(){ return [lvl("e1", "Swapped letters", {printed:"horse", wanted:"ros"}), lvl("e2", "Extra stamp", {printed:"pallet", wanted:"palet"}), lvl("e3", "Wrong batch", {printed:"intention", wanted:"execution"}), lvl("e4", "Already right", {printed:"crate", wanted:"crate"})]; },
  hidden(){
    return [lvl("h1", "Printed nothing", {printed:"", wanted:"box"}), lvl("h2", "Should be blank", {printed:"tape", wanted:""}), lvl("h3", "Both blank", {printed:"", wanted:""}),
      lvl("h4", "Identical long labels", {printed:"warehouse-zone", wanted:"warehouse-zone"}), lvl("h5", "Fourteen by fourteen", {printed:"forkliftbatter", wanted:"palletjackchar"}),
      lvl("h6", "Completely different", {printed:"abcdefghijklmn", wanted:"opqrstuvwxyzab"})];
  },
  case(L){ return {args:[L.printed, L.wanted], arr:[0, 1]}; },
  check(L, ret){
    const want = editDistance(L.printed, L.wanted);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of edits.");
    if (ret !== want) return bad("Wrong number of edits", "Turning " + JSON.stringify(L.printed) + " into " + JSON.stringify(L.wanted) + " takes " + want + " edit" + (want === 1 ? "" : "s") + ", but you returned " + ret + ".");
    return ok("Label fixed", want ? want + " edit" + (want === 1 ? "" : "s") + " turn " + JSON.stringify(L.printed) + " into " + JSON.stringify(L.wanted) + "." : "The label is already right, so no edits are needed.");
  },
  budget(L){ const m = L.printed.length, n = L.wanted.length; return 3 * (m + 1) * (n + 1) + 2 * (m + n) + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo || w.prev || w.cur)) ? [] : ["dp"]; },
  random(L){ const abc = "abcdeor", word = n => Array.from({length:n}, () => abc[ri(Math.random, 0, abc.length - 1)]).join(""); L.printed = word(ri(Math.random, 3, 8)); L.wanted = word(ri(Math.random, 2, 7)); }
};
