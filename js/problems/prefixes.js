import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: barcode prefix lookups (trie) ---------- */
function codes(rng, n, len){ const A = "ABCD"; return Array.from({length:n}, () => Array.from({length:ri(rng, 2, len)}, () => A[ri(rng, 0, A.length - 1)]).join("")); }
export const PrefixesProblem = {
  id: "prefixes", tier: 4, tab: "Barcode prefixes", pattern: "Trie", fname: "barcode_prefixes.py", levelNoun: "scans",
  title: "Barcode prefix lookups", sig: "barcodes, prefixes", input: "array", view: "array",
  brief: `<p>Every package carries a short barcode of capital letters. The sorter asks a batch of questions of the form “how many packages have a barcode starting with this prefix?”</p>
<p>Write <code>solve(barcodes, prefixes)</code> and return a list with one count per prefix, in order. Duplicate barcodes count separately, and the empty prefix <code>""</code> matches every barcode.</p>`,
  show: `Every read of <code>barcodes[i]</code> drops a dot under that barcode. Build a trie once and each barcode gets one dot. Scanning every barcode for every prefix stacks a dot per prefix. Name your result <code>counts</code> to see it fill in.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["counts", "res", "result", "ans", "out", "i", "p", "code", "word"], pointers: ["i"], panel: ["counts", "res", "result", "ans", "out", "p"], arrArg: 0, arrLabel2: "barcodes",
  editor: "random",
  arrayOf: L => L.barcodes, extraLabel: L => { const s = "prefixes: " + L.prefixes.map(p => JSON.stringify(p)).join(" "); return s.length > 48 ? s.slice(0, 46) + "…" : s; },
  levels(){ return [lvl("b1", "Morning scan", {barcodes:["AB", "ABC", "ABD", "BA", "B"], prefixes:["AB", "B", "C"]}), lvl("b2", "Shared starts", {barcodes:["CAB", "CAD", "CA", "DAB", "CABA"], prefixes:["CA", "CAB", "D", "CABAB"]}), lvl("b3", "Duplicates", {barcodes:["AA", "AA", "AB", "AA"], prefixes:["AA", "A", ""]})]; },
  hidden(){
    const rng = mkRng(37), big = codes(rng, 40, 5), qs = codes(rng, 27, 3).concat(["", "ABCDABCD", "D"]);
    return [lvl("h1", "Empty prefix matches all", {barcodes:["X", "YY", "XYZ"], prefixes:[""]}), lvl("h2", "No barcodes", {barcodes:[], prefixes:["A", ""]}),
      lvl("h3", "Prefix longer than any barcode", {barcodes:["AB", "ABC"], prefixes:["ABCD", "ABC"]}), lvl("h4", "Whole barcode as prefix", {barcodes:["DCBA", "DCB", "DC"], prefixes:["DCBA", "DCB", "DC", "D"]}),
      lvl("h5", "Forty barcodes, thirty prefixes", {barcodes:big, prefixes:qs})];
  },
  ref(L){ return L.prefixes.map(p => L.barcodes.filter(b => b.startsWith(p)).length); },
  case(L){ return {args:[L.barcodes, L.prefixes], arr:[0, 1]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one count per prefix.");
    if (ret.length !== want.length) return bad("Wrong length", "There are " + want.length + " prefixes, but your list has " + ret.length + " counts.");
    const i = want.findIndex((x, k) => ret[k] !== x);
    if (i >= 0) return bad("Wrong count", "For prefix " + JSON.stringify(L.prefixes[i]) + " you have " + pyRepr(ret[i]) + ", but " + want[i] + " barcode" + (want[i] === 1 ? " starts" : "s start") + " with it.");
    return ok("Every count is right", want.length <= 10 ? "The counts are " + pyRepr(want) + "." : "All " + want.length + " counts match.");
  },
  budget(L){ return 2 * (L.barcodes.length + L.prefixes.length) + 6; },
  tip(run){ return run.wAt.some(w => w && (w.counts || w.res || w.result || w.ans || w.out)) ? [] : ["counts"]; },
  random(L){ L.barcodes = codes(Math.random, ri(Math.random, 5, 8), 4); L.prefixes = codes(Math.random, ri(Math.random, 2, 4), 2); }
};
