import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: find the code in the label (KMP / rolling hash) ---------- */
export const PatternProblem = {
  id: "pattern", tier: 4, tab: "Find the code", pattern: "String matching", fname: "find_code.py", levelNoun: "labels",
  title: "Find the code inside the label", sig: "label, code", input: "array", view: "array",
  brief: `<p>Every pallet’s long label has a short product <code>code</code> printed somewhere inside it. Write <code>solve(label, code)</code> and return the index in <code>label</code> where <code>code</code> first appears, or <code>-1</code> if it doesn’t appear. An empty code is found at index <code>0</code>.</p>
<p>Comparing the code at every position works, but redoes a lot of work when the label repeats itself. Aim for time linear in the two lengths, for example with KMP or a rolling hash, and don’t use <code>find</code>, <code>index</code> or <code>in</code>.</p>`,
  show: `The boxes are <code>label</code>; every read drops a dot under it (reads of <code>code</code> count too). Name your positions <code>i</code> and <code>j</code> to watch them. KMP never steps <code>i</code> backwards.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Found here</span>`,
  watch: ["i", "j", "k", "lps", "fail", "pi", "h", "hash", "target"], pointers: ["i", "j", "k"], panel: ["lps", "fail", "pi", "h", "hash", "target"], arrArg: 0, arrLabel2: "label",
  editor: "random",
  arrayOf: L => [...L.label], extraLabel: L => "code: " + (L.code || "(empty)"),
  levels(){ return [lvl("f1", "Warehouse", {label:"WAREHOUSE", code:"HOUSE"}), lvl("f2", "Repeats itself", {label:"ABABDABACDABABCABAB", code:"ABABCABAB"}), lvl("f3", "Not there", {label:"SHELF", code:"BIN"}), lvl("f4", "Right at the start", {label:"AABAACAADAABAABA", code:"AABA"})]; },
  hidden(){
    const rng = mkRng(89), mixed = Array.from({length:70}, () => "ABC"[ri(rng, 0, 2)]).join("");
    return [lvl("h1", "Empty code", {label:"ABC", code:""}), lvl("h2", "Code longer than the label", {label:"AB", code:"ABC"}), lvl("h3", "Whole label", {label:"PALLET", code:"PALLET"}),
      lvl("h4", "Eighty As then a B", {label:"A".repeat(80) + "B", code:"A".repeat(9) + "B"}), lvl("h5", "Almost, many times", {label:"A".repeat(80), code:"A".repeat(9) + "B"}),
      lvl("h6", "Seventy random letters", {label:mixed, code:mixed.slice(50, 58)}), lvl("h7", "One letter", {label:"XYZ", code:"Z"})];
  },
  case(L){ return {args:[L.label, L.code], arr:[0, 1]}; },
  check(L, ret){
    const want = L.label.indexOf(L.code);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return an index, or -1.");
    if (ret === want) return ok("Code found", want < 0 ? "The code doesn’t appear, so -1 is right." : "The code first appears at index " + want + ".");
    if (want < 0) return bad("Not there", "The code never appears in the label, so the answer is -1.");
    if (ret >= 0 && L.label.slice(ret, ret + L.code.length) === L.code) return bad("Not the first one", "The code does appear at " + ret + ", but it first appears at " + want + ".");
    return bad("Wrong index", "The code first appears at index " + want + ", but you returned " + ret + ".");
  },
  // KMP reads each label and code character about twice in each phase.
  budget(L){ return 5 * (L.label.length + L.code.length) + 10; },
  highlight(ret, L){ if (typeof ret !== "number" || ret < 0) return null; return new Set(Array.from({length: L.code.length}, (_, k) => ret + k)); },
  tip(run){ return run.wAt.some(w => w && (w.i != null || w.j != null)) ? [] : ["i and j"]; },
  random(L){ const n = ri(Math.random, 8, 14), label = Array.from({length:n}, () => "AB"[ri(Math.random, 0, 1)]).join(""), a = ri(Math.random, 0, n - 3); L.label = label; L.code = Math.random() < .7 ? label.slice(a, a + ri(Math.random, 2, 4)) : "ABBA"; }
};
