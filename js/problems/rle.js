import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: shrink the label (run-length encoding) ---------- */
const encode = s => { let out = ""; for (let i = 0; i < s.length;){ let j = i; while (j < s.length && s[j] === s[i]) j++; out += s[i] + (j - i > 1 ? j - i : ""); i = j; } return out; };
export const RleProblem = {
  id: "rle", tier: 1, tab: "Shrink the label", pattern: "String building", fname: "shrink_label.py", levelNoun: "labels",
  title: "Shrink the zone label", sig: "label", input: "array", view: "array",
  brief: `<p>Zone labels are long runs of repeated letters, and the label printer is running out of ink. Shorten each run to the letter followed by how many times it repeats, and leave the count off when the letter appears just once in a row. <code>"AAABCC"</code> becomes <code>"A3BC2"</code>.</p>
<p>Write <code>solve(label)</code>, where <code>label</code> is a string of capital letters, and return the shortened label.</p>`,
  show: `Every <code>label[i]</code> read drops a dot under that letter. Name your loop index <code>i</code> and the end of the current run <code>j</code> to watch each run get measured.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(label):
    out = []
    i = 0

    # Find the run that starts at i: move j forward while
    # label[j] is the same letter. The run is j - i long.
    # Add the letter, plus the count if it's more than 1,
    # then jump i to j. "".join(out) builds the result.

    return "".join(out)
`,
  watch: ["i", "j", "count", "run", "out", "res", "result", "ch", "prev"], pointers: ["i", "j"], panel: ["out", "res", "result", "count", "run"], arrArg: 0, arrLabel2: "label",
  editor: "random",
  arrayOf: L => [...L.label],
  levels(){ return [lvl("r1", "Short runs", {label:"AAABCC"}), lvl("r2", "No repeats", {label:"ABCD"}), lvl("r3", "One long run", {label:"ZZZZZZZZZZZZ"}), lvl("r4", "Back and forth", {label:"AABBAAB"})]; },
  hidden(){
    const rng = mkRng(71); let big = ""; while (big.length < 70) big += "ABCD"[ri(rng, 0, 3)].repeat(ri(rng, 1, 6));
    return [lvl("h1", "Empty label", {label:""}), lvl("h2", "One letter", {label:"Q"}), lvl("h3", "Run of ten or more", {label:"B" + "A".repeat(15) + "B"}),
      lvl("h4", "Seventy letters", {label:big}), lvl("h5", "Runs at both ends", {label:"XXXYZZZ"})];
  },
  case(L){ return {args:[L.label], arr:[0]}; },
  check(L, ret){
    const want = encode(L.label);
    if (typeof ret !== "string") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the shortened label as a string.");
    if (ret !== want) return bad("Wrong label", "Expected " + JSON.stringify(want) + ", but got " + JSON.stringify(ret) + "." + (/1/.test(ret) && !/1/.test(want) ? " Leave the count off when a letter appears just once." : ""));
    return ok("Label shrunk", JSON.stringify(L.label) + " prints as " + JSON.stringify(want) + ".");
  },
  // Comparing each letter with the one before it reads every letter twice.
  budget(L){ return 3 * L.label.length + 4; },
  showRet(ret){ return JSON.stringify(ret); },
  tip(run){ return run.wAt.some(w => w && w.i != null) ? [] : ["i and j"]; },
  random(L){ let s = ""; const n = ri(Math.random, 3, 6); for (let k = 0; k < n; k++) s += "ABCDE"[ri(Math.random, 0, 4)].repeat(ri(Math.random, 1, 4)); L.label = s; }
};
