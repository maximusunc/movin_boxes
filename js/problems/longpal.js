import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: longest mirror stretch (expand around center) ---------- */
function longest(s){
  let best = 0, at = 0;
  for (let c = 0; c < 2 * s.length - 1; c++){
    let l = Math.floor(c / 2), r = l + (c % 2);
    while (l >= 0 && r < s.length && s[l] === s[r]){ l--; r++; }
    if (r - l - 1 > best){ best = r - l - 1; at = l + 1; }
  }
  return s.slice(at, at + best);
}
export const LongPalProblem = {
  id: "longpal", tier: 3, tab: "Longest mirror", pattern: "Expand around center", fname: "longest_mirror.py", levelNoun: "labels",
  title: "Find the longest mirror stretch", sig: "label", input: "array", view: "array",
  brief: `<p>A label sometimes hides a stretch that reads the same forwards and backwards, like <code>"BAB"</code> inside <code>"BABAD"</code>. Every character counts, and upper and lower case are different.</p>
<p>Write <code>solve(label)</code> and return the longest unbroken stretch of <code>label</code> that reads the same both ways. If several are equally long, return any one of them. An empty label gives <code>""</code>.</p>`,
  show: `Every read drops a dot under that character. Growing outwards from each center shows up as pairs of pointers <code>left</code> and <code>right</code> spreading apart; checking every possible stretch by reversing it leaves tall piles of dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned stretch</span>`,
  watch: ["left", "right", "l", "r", "lo", "hi", "i", "center", "best", "start", "res"], pointers: ["left", "right", "l", "r", "lo", "hi", "i"], panel: ["best", "start", "res"], arrArg: 0, arrLabel2: "label",
  editor: "random",
  arrayOf: L => [...L.label],
  levels(){ return [lvl("p1", "BABAD", {label:"BABAD"}), lvl("p2", "Even length", {label:"CBBD"}), lvl("p3", "Whole label", {label:"RACECAR"}), lvl("p4", "Hidden inside", {label:"XYZABACABAQ"})]; },
  hidden(){
    const rng = mkRng(87), two = Array.from({length:50}, () => "AB"[ri(rng, 0, 1)]).join("");
    return [lvl("h1", "Empty label", {label:""}), lvl("h2", "One character", {label:"Z"}), lvl("h3", "No repeats", {label:"ABCDEFG"}), lvl("h4", "Fifty of the same", {label:"A".repeat(50)}),
      lvl("h5", "Fifty from two letters", {label:two}), lvl("h6", "Mirror at the very end", {label:"QWERTYUIOP" + "ABCDCBA"}), lvl("h7", "Case matters", {label:"Abba"})];
  },
  case(L){ return {args:[L.label], arr:[0]}; },
  check(L, ret){
    const want = longest(L.label), s = L.label;
    if (typeof ret !== "string") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the stretch itself, as a string.");
    if (!s.includes(ret)) return bad("Not part of the label", JSON.stringify(ret) + " isn’t an unbroken stretch of " + JSON.stringify(s) + ".");
    if ([...ret].reverse().join("") !== ret) return bad("Not a mirror", JSON.stringify(ret) + " doesn’t read the same backwards.");
    if (ret.length !== want.length) return bad("There’s a longer one", "Your stretch has " + ret.length + " characters, but " + JSON.stringify(want) + " has " + want.length + ".");
    return ok("Longest mirror found", want.length ? JSON.stringify(ret) + " reads the same both ways (" + ret.length + " characters)." : "An empty label has no stretch.");
  },
  // Expanding around every center is O(n²) reads in the worst case (a run of one letter).
  budget(L){ const n = L.label.length; return 2 * n * n + 4 * n + 10; },
  highlight(ret, L){ if (typeof ret !== "string" || !ret) return null; const at = L.label.indexOf(ret); return at < 0 ? null : new Set(Array.from({length: ret.length}, (_, k) => at + k)); },
  showRet(ret){ return JSON.stringify(ret); },
  tip(run){ return run.wAt.some(w => w && (w.left != null || w.l != null || w.lo != null)) ? [] : ["left and right"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.label = Array.from({length:n}, () => "ABC"[ri(Math.random, 0, 2)]).join(""); }
};
