import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: mirror label (two pointers) ---------- */
const clean = s => [...s].filter(ch => /[a-z0-9]/i.test(ch)).map(ch => ch.toLowerCase());
export const PalindromeProblem = {
  id: "palindrome", tier: 1, tab: "Mirror label", pattern: "Two pointers", fname: "mirror_label.py", levelNoun: "labels",
  title: "Does the label read the same both ways?", sig: "label", input: "array", view: "array",
  brief: `<p>Some shelf labels are printed so they read the same from either end of the aisle. Only letters and digits count: ignore spaces, punctuation and upper or lower case.</p>
<p>Write <code>solve(label)</code>, where <code>label</code> is a string, and return <code>True</code> if it reads the same forwards and backwards, otherwise <code>False</code>.</p>`,
  show: `Every <code>label[i]</code> read drops a dot under that character. Name your pointers <code>left</code> and <code>right</code> to watch them walk in from both ends.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(label):
    left, right = 0, len(label) - 1

    # Move left forward and right backward, skipping anything
    # that isn't a letter or digit (ch.isalnum() helps).
    # Compare the two characters in lower case; any mismatch
    # means it's not a mirror label.

    return True
`,
  watch: ["left", "right", "l", "r", "i", "j"], pointers: ["left", "right", "l", "r", "i", "j"], panel: [], arrArg: 0, arrLabel2: "label",
  editor: "random",
  arrayOf: L => [...L.label],
  levels(){ return [lvl("p1", "Race car", {label:"Race car"}), lvl("p2", "Aisle 12", {label:"Aisle 12"}), lvl("p3", "With punctuation", {label:"No 'x' in Nixon"}), lvl("p4", "Digits", {label:"12-3-21"})]; },
  hidden(){
    const half = "warehouse 7 bay ", long = half + [...half].reverse().join("");
    return [lvl("h1", "Empty label", {label:""}), lvl("h2", "Only punctuation", {label:".,!? -"}), lvl("h3", "One character", {label:"Q"}),
      lvl("h4", "A letter and a digit", {label:"0P"}), lvl("h5", "Long mirror", {label:long}), lvl("h6", "Long, one letter off", {label:long.slice(0, 10) + "x" + long.slice(11)}),
      lvl("h7", "Mixed case", {label:"Was it a car or a cat I saw?"})];
  },
  ref(L){ const c = clean(L.label); return c.join("") === c.slice().reverse().join(""); },
  case(L){ return {args:[L.label], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L), shown = JSON.stringify(clean(L.label).join(""));
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? JSON.stringify(L.label) + " reads " + shown + " both ways once you keep only letters and digits, but you returned False." : "You returned True, but " + JSON.stringify(L.label) + " becomes " + shown + ", which doesn’t read the same backwards.");
    return ok("Correct", want ? "The label reads the same both ways." : "The label doesn’t mirror, and you caught it.");
  },
  budget(L){ return 3 * L.label.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.left != null || w.l != null || w.i != null)) ? [] : ["left and right"]; },
  random(L){
    const abc = "abcdefgh12", n = ri(Math.random, 3, 5); let s = "";
    for (let k = 0; k < n; k++) s += abc[ri(Math.random, 0, abc.length - 1)];
    let m = s + (Math.random() < .5 ? abc[ri(Math.random, 0, abc.length - 1)] : "") + [...s].reverse().join("");
    if (Math.random() < .4){ const i = ri(Math.random, 0, m.length - 1); m = m.slice(0, i) + "z" + m.slice(i + 1); }
    m = [...m].map(ch => Math.random() < .3 ? ch.toUpperCase() : ch).join("");
    const cut = ri(Math.random, 1, m.length - 1);
    L.label = m.slice(0, cut) + (Math.random() < .5 ? " " : ", ") + m.slice(cut);
  }
};
