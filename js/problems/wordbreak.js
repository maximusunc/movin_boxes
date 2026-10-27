import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: split the label into known codes (word break) ---------- */
function canSplit(label, codes){
  const set = new Set(codes), n = label.length, dp = Array(n + 1).fill(false); dp[0] = true;
  for (let j = 1; j <= n; j++) for (let i = 0; i < j; i++) if (dp[i] && set.has(label.slice(i, j))){ dp[j] = true; break; }
  return dp[n];
}
export const WordBreakProblem = {
  id: "wordbreak", tier: 3, tab: "Split the label", pattern: "Dynamic programming", fname: "split_the_label.py", levelNoun: "labels",
  title: "Can the label be split into known codes?", sig: "label, codes", input: "array", view: "array",
  brief: `<p>Shipping labels are printed as one long run of letters with no spaces. <code>codes</code> is the list of known product codes, and the same code can appear any number of times.</p>
<p>Write <code>solve(label, codes)</code> and return <code>True</code> if <code>label</code> can be cut into pieces that are all known codes, otherwise <code>False</code>. An empty label counts as split.</p>`,
  show: `The boxes are the letters of <code>label</code>, and every read drops a dot under one. Name your table <code>dp</code> (where <code>dp[i]</code> says whether the first <code>i</code> letters can be split) or a <code>memo</code> dict. Trying every split again from scratch reads the same letters many times.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dp", "memo", "i", "j", "start", "end"], pointers: ["i", "j", "start", "end"], panel: ["dp", "memo"], arrArg: 0, arrLabel2: "label",
  editor: "random",
  arrayOf: L => [...L.label], extraLabel: L => "codes: " + L.codes.join(" "),
  levels(){ return [lvl("w1", "Two codes", {label:"BOXTAPE", codes:["BOX","TAPE"]}), lvl("w2", "Reused code", {label:"ABAB", codes:["AB"]}), lvl("w3", "Dead end", {label:"CATSANDOG", codes:["CATS","DOG","SAND","AND","CAT"]}), lvl("w4", "Overlapping codes", {label:"PALLETJACK", codes:["PAL","PALLET","LET","JACK","JA"]})]; },
  hidden(){
    const As = n => "A".repeat(n);
    return [lvl("h1", "Empty label", {label:"", codes:["A"]}), lvl("h2", "No codes", {label:"AB", codes:[]}), lvl("h3", "One long code", {label:"FORKLIFT", codes:["FORKLIFT"]}),
      lvl("h4", "Almost all A’s", {label:As(26) + "B", codes:["A","AA","AAA"]}), lvl("h5", "All A’s", {label:As(30), codes:["A","AA","AAA"]}),
      lvl("h6", "Many short codes", {label:"ABCABCABCABCABCABCABCD", codes:["A","B","C","AB","BC","CA","ABC"]})];
  },
  case(L){ return {args:[L.label, L.codes], arr:[0, 1]}; },
  check(L, ret){
    const want = canSplit(L.label, L.codes);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? JSON.stringify(L.label) + " can be split into known codes, but you returned False." : "No way of cutting " + JSON.stringify(L.label) + " uses only known codes, but you returned True.");
    return ok("Correct", want ? "The label splits into known codes." : "The label can’t be split, and you caught it.");
  },
  // Admits any polynomial DP, including one that slices every substring (about n³/6 letter reads).
  budget(L){ const n = L.label.length, k = L.codes.length, S = L.codes.reduce((a, c) => a + c.length, 0); return 2*k + (n + 1)*(k + S) + (n + 1)*(n + 1)*(n + 2)/2 + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo)) ? [] : ["dp"]; },
  random(L){
    const codes = [...new Set(Array.from({length: ri(Math.random, 3, 5)}, () => Array.from({length: ri(Math.random, 1, 3)}, () => "ABC"[ri(Math.random, 0, 2)]).join("")))];
    let s = ""; while (s.length < 8) s += codes[ri(Math.random, 0, codes.length - 1)];
    if (Math.random() < .5) s += "D";
    L.label = s; L.codes = codes;
  }
};
