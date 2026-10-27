import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: unpack the compressed label (stack / recursion) ---------- */
function unpack(s){
  let i = 0;
  const go = () => {
    let out = "";
    while (i < s.length && s[i] !== "]"){
      if (s[i] >= "0" && s[i] <= "9"){ let k = 0; while (s[i] >= "0" && s[i] <= "9"){ k = k * 10 + (+s[i]); i++; } i++; const inner = go(); i++; out += inner.repeat(k); }
      else { out += s[i]; i++; }
    }
    return out;
  };
  return go();
}
const short = s => s.length > 40 ? JSON.stringify(s.slice(0, 37)) + "… (" + s.length + " letters)" : JSON.stringify(s);
export const DecodeProblem = {
  id: "decode", tier: 3, tab: "Unpack label", pattern: "Stack", fname: "unpack_label.py", levelNoun: "labels",
  title: "Unpack the compressed label", sig: "packed", input: "array", view: "array",
  brief: `<p>Long pick lists are sent compressed: <code>k[...]</code> means “the part inside the brackets, <code>k</code> times”, and brackets can nest. <code>"3[AB2[C]]"</code> unpacks to <code>"ABCCABCCABCC"</code>. Counts are whole numbers from 1 to 99, letters are capitals, and every label is well formed.</p>
<p>Write <code>solve(packed)</code> and return the unpacked label.</p>`,
  show: `Every character read drops a dot under it. Name a <code>stack</code> of (count, text so far) pairs, or recurse with a position <code>i</code>, to watch the nesting.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["stack", "st", "cur", "out", "res", "num", "k", "count", "i"], pointers: ["i"], panel: ["stack", "st", "cur", "out", "res", "num", "k", "count"], arrArg: 0, arrLabel2: "packed",
  editor: "random",
  arrayOf: L => [...L.packed],
  levels(){ return [lvl("d1", "Two groups", {packed:"3[A]2[BC]"}), lvl("d2", "Nested", {packed:"3[A2[C]]"}), lvl("d3", "Groups and loose letters", {packed:"2[AB]3[CD]EF"}), lvl("d4", "Nothing packed", {packed:"ABC"})]; },
  hidden(){ return [lvl("h1", "Empty label", {packed:""}), lvl("h2", "Two-digit count", {packed:"12[Z]"}), lvl("h3", "Five levels deep", {packed:"2[2[2[2[2[A]]]]]"}),
    lvl("h4", "Count of one", {packed:"1[X]Y1[Z]"}), lvl("h5", "Long packed label", {packed:"AB3[CD2[E]]F" + "2[GH]".repeat(8) + "10[I2[J]]K"}), lvl("h6", "Letters inside and out", {packed:"X2[Y3[Z]W]V"})]; },
  case(L){ return {args:[L.packed], arr:[0]}; },
  check(L, ret){
    const want = unpack(L.packed);
    if (typeof ret !== "string") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the unpacked label as a string.");
    if (ret !== want){ let i = 0; while (i < want.length && ret[i] === want[i]) i++; return bad("Not unpacked right", "Expected " + short(want) + ", but got " + short(ret) + ". They first differ at letter " + i + "."); }
    return ok("Label unpacked", JSON.stringify(L.packed) + " unpacks to " + short(want) + ".");
  },
  // A recursive parser checks each character a few times before consuming it.
  budget(L){ return 4 * L.packed.length + 8; },
  showRet(ret){ return typeof ret === "string" ? short(ret) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st || w.i != null)) ? [] : ["stack"]; },
  random(L){ const a = "ABCDE"[ri(Math.random, 0, 4)], b = "FGHIJ"[ri(Math.random, 0, 4)]; L.packed = [ri(Math.random, 2, 3) + "[" + a + ri(Math.random, 2, 3) + "[" + b + "]]", a + ri(Math.random, 2, 4) + "[" + b + a + "]" + b, ri(Math.random, 2, 3) + "[" + a + "]" + ri(Math.random, 2, 3) + "[" + b + "]"][ri(Math.random, 0, 2)]; }
};
