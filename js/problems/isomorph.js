import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: same letter pattern (hash maps both ways) ---------- */
function firstClash(a, b){
  if (a.length !== b.length) return {len: true};
  const f = new Map(), g = new Map();
  for (let i = 0; i < a.length; i++){
    if (f.has(a[i]) && f.get(a[i]) !== b[i]) return {i, x: a[i], y: f.get(a[i]), z: b[i], dir: "ab"};
    if (g.has(b[i]) && g.get(b[i]) !== a[i]) return {i, x: b[i], y: g.get(b[i]), z: a[i], dir: "ba"};
    f.set(a[i], b[i]); g.set(b[i], a[i]);
  }
  return null;
}
export const IsomorphProblem = {
  id: "isomorph", tier: 2, tab: "Same pattern", pattern: "Hash map", fname: "same_pattern.py", levelNoun: "label pairs",
  title: "Do the labels follow the same pattern?", sig: "first, second", input: "array", view: "array",
  brief: `<p>Two warehouses use different letters for their zones, but the same layout. Two labels match if you can swap every letter in <code>first</code> for another letter so it turns into <code>second</code>: the same letter always becomes the same letter, and two different letters never become the same one. <code>"EGG"</code> and <code>"ADD"</code> match; <code>"FOO"</code> and <code>"BAR"</code> don’t.</p>
<p>Write <code>solve(first, second)</code> and return <code>True</code> if the labels follow the same pattern, otherwise <code>False</code>.</p>`,
  show: `The boxes are <code>first</code>; every read of it drops a dot (reads of <code>second</code> count too). Name your dicts <code>to_second</code> and <code>to_first</code> to watch the letter mapping build up.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["to_second", "to_first", "a_to_b", "b_to_a", "m1", "m2", "mapping", "seen", "used", "i"], pointers: ["i"], panel: ["to_second", "to_first", "a_to_b", "b_to_a", "m1", "m2", "mapping", "seen", "used"], arrArg: 0, arrLabel2: "first",
  editor: "random",
  arrayOf: L => [...L.first], extraLabel: L => "second: " + (L.second || "(empty)"),
  levels(){ return [lvl("i1", "Egg and add", {first:"EGG", second:"ADD"}), lvl("i2", "Foo and bar", {first:"FOO", second:"BAR"}), lvl("i3", "Paper and title", {first:"PAPER", second:"TITLE"}), lvl("i4", "Two letters, one target", {first:"AB", second:"CC"})]; },
  hidden(){
    const rng = mkRng(73), A = "ABCDEFGHIJ", perm = "KLMNOPQRST".split("").sort(() => rng() - .5);
    const long = Array.from({length:60}, () => A[ri(rng, 0, 9)]).join(""), mapped = [...long].map(ch => perm[A.indexOf(ch)]).join("");
    const broken = mapped.slice(0, 40) + (mapped[40] === "K" ? "L" : "K") + mapped.slice(41);
    return [lvl("h1", "Both empty", {first:"", second:""}), lvl("h2", "Different lengths", {first:"AB", second:"ABC"}), lvl("h3", "Clash only one way", {first:"BADC", second:"BABA"}),
      lvl("h4", "Same label twice", {first:"ZONE", second:"ZONE"}), lvl("h5", "Sixty letters, matching", {first:long, second:mapped}), lvl("h6", "Sixty letters, one off", {first:long, second:broken})];
  },
  case(L){ return {args:[L.first, L.second], arr:[0, 1]}; },
  check(L, ret){
    const clash = firstClash(L.first, L.second), want = !clash;
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret === want) return ok("Correct", want ? "Every letter swaps consistently." : "The patterns differ, and you caught it.");
    if (want) return bad("Wrong answer", "These labels do follow the same pattern, but you returned False.");
    if (clash.len) return bad("Wrong answer", "The labels have different lengths, so they can’t match.");
    return bad("Wrong answer", "At position " + clash.i + ", " + JSON.stringify(clash.x) + " would have to turn into both " + JSON.stringify(clash.y) + " and " + JSON.stringify(clash.z) + "." + (clash.dir === "ba" ? " Check the mapping in both directions." : ""));
  },
  budget(L){ return 2 * (L.first.length + L.second.length) + 4; },
  tip(run){ return run.wAt.some(w => w && (w.to_second || w.a_to_b || w.m1 || w.mapping || w.seen)) ? [] : ["to_second and to_first"]; },
  random(L){
    const n = ri(Math.random, 3, 8), A = "ABCDE", first = Array.from({length:n}, () => A[ri(Math.random, 0, 4)]).join(""), perm = "VWXYZ".split("").sort(() => Math.random() - .5);
    let second = [...first].map(ch => perm[A.indexOf(ch)]).join("");
    if (Math.random() < .5){ const i = ri(Math.random, 0, n - 1); second = second.slice(0, i) + perm[ri(Math.random, 0, 4)] + second.slice(i + 1); }
    L.first = first; L.second = second;
  }
};
