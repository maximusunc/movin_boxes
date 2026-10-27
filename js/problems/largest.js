import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: biggest serial number (custom sort order) ---------- */
export const LargestProblem = {
  id: "largest", tier: 2, tab: "Biggest serial", pattern: "Custom sort", fname: "biggest_serial.py", levelNoun: "batches",
  title: "Make the biggest serial number", sig: "parts", input: "array", view: "array",
  brief: `<p>A batch label is printed by gluing number stickers end to end. <code>parts</code> holds the sticker numbers, all zero or more. Glued in the right order, <code>[3, 30, 34, 5, 9]</code> reads <code>9534330</code>, the biggest possible.</p>
<p>Write <code>solve(parts)</code> and return the biggest number you can make, as a string. Don’t return leading zeros: <code>[0, 0]</code> gives <code>"0"</code>.</p>`,
  show: `Every read drops a dot under that sticker. A plain numeric sort doesn’t work here. To decide which of two stickers goes first, compare <code>a + b</code> with <code>b + a</code> as strings.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["strs", "words", "res", "result", "ans", "out"], panel: ["strs", "words", "res", "result", "ans", "out"], arrArg: 0, arrLabel2: "stickers",
  editor: "random",
  arrayOf: L => L.parts,
  levels(){ return [lvl("g1", "Classic", {parts:[3,30,34,5,9]}), lvl("g2", "Two stickers", {parts:[10,2]}), lvl("g3", "Prefix trap", {parts:[121,12]}), lvl("g4", "Zeros", {parts:[0,0,0]})]; },
  hidden(){
    const rng = mkRng(83), big = Array.from({length:40}, () => ri(rng, 0, 999));
    return [lvl("h1", "One sticker", {parts:[7]}), lvl("h2", "Single zero", {parts:[0]}), lvl("h3", "Close call", {parts:[8308,830]}),
      lvl("h4", "Zero and more", {parts:[0,9,0,1]}), lvl("h5", "Forty stickers", {parts:big}), lvl("h6", "Same digits", {parts:[111,11,1,1111]})];
  },
  ref(L){ const s = L.parts.map(String).sort((x, y) => (y + x) > (x + y) ? 1 : (y + x) < (x + y) ? -1 : 0).join(""); return s.replace(/^0+(?=.)/, ""); },
  case(L){ return {args:[L.parts], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "string") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number as a string, like \"9534330\".");
    if (ret !== want) return bad("Not the biggest", "You returned " + JSON.stringify(ret) + ", but the biggest label is " + JSON.stringify(want) + "." + (/^0./.test(ret) ? " Drop the leading zeros." : ""));
    return ok("Biggest label", "The label reads " + (want.length <= 40 ? want : want.slice(0, 40) + "…") + ".");
  },
  budget(L){ return 3 * L.parts.length + 6; },
  showRet(ret){ return typeof ret === "string" ? JSON.stringify(ret.length > 40 ? ret.slice(0, 40) + "…" : ret) : pyRepr(ret); },
  tip(){ return []; },
  random(L){ const n = ri(Math.random, 3, 8); L.parts = Array.from({length:n}, () => ri(Math.random, 0, Math.random() < .5 ? 9 : 99)); }
};
