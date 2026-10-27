import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: median of two sorted logs (binary search on a partition) ---------- */
const sortedList = (rng, n, lo, hi) => Array.from({length:n}, () => ri(rng, lo, hi)).sort((a, b) => a - b);
export const Median2Problem = {
  id: "median2", tier: 5, tab: "Two-log median", pattern: "Binary search", fname: "two_log_median.py", levelNoun: "logs",
  title: "Median of two sorted weigh logs", sig: "a, b", input: "array", view: "array",
  brief: `<p>Two scales each keep a sorted log of crate weights, <code>a</code> and <code>b</code>. Together they hold at least one weight. Weights can repeat, within a log and across both.</p>
<p>Write <code>solve(a, b)</code> and return the median of all the weights combined (the average of the two middle ones when the total count is even). Merging the logs reads every weight; aim for a number of reads that grows only with the logarithm of the total.</p>`,
  show: `The boxes are log <code>a</code>, and every read of it drops a dot; reads of <code>b</code> count too but aren’t drawn. Name your cut point in <code>a</code> as <code>i</code> and your bounds <code>lo</code> and <code>hi</code> to watch the search narrow.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["lo", "hi", "i", "j", "mid", "cut1", "cut2"], pointers: ["lo", "hi", "i", "mid", "cut1"], panel: ["j", "cut2"], arrArg: 0, arrLabel2: "log a",
  editor: "random",
  arrayOf: L => L.a, extraLabel: L => L.b.length <= 8 ? "b = " + L.b.join(", ") : "b has " + L.b.length + " weights",
  levels(){ return [lvl("m1", "Odd total", {a:[2], b:[1,3]}), lvl("m2", "Even total", {a:[1,2], b:[3,4]}), lvl("m3", "Interleaved", {a:[1,4,7,10,13], b:[2,3,8,9,20,21]}), lvl("m4", "One log empty", {a:[], b:[5,6,7,8]})]; },
  hidden(){
    const r = mkRng(57);
    return [lvl("h1", "One weight", {a:[4], b:[]}), lvl("h2", "Every a below every b", {a:[1,2,3], b:[10,11,12,13]}),
      lvl("h3", "Repeated weights", {a:[2,2,2,2], b:[2,2,3]}),
      lvl("h4", "Sixty and sixty", {a:sortedList(r, 60, 1, 400), b:sortedList(r, 60, 1, 400)}),
      lvl("h5", "Eighty and forty-one", {a:sortedList(r, 80, 1, 900), b:sortedList(r, 41, 300, 600)}),
      lvl("h6", "Three and ninety", {a:[100,200,300], b:sortedList(r, 90, 1, 1000)})];
  },
  ref(L){ const all = L.a.concat(L.b).sort((x, y) => x - y), n = all.length; return n % 2 ? all[(n - 1) / 2] : (all[n/2 - 1] + all[n/2]) / 2; },
  case(L){ return {args:[L.a, L.b], arr:[0, 1]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the median as a number.");
    if (Math.abs(ret - want) > 1e-9) return bad("Wrong median", "The median is " + want + ", but you returned " + ret + ".");
    return ok("Median found", "The median of all " + (L.a.length + L.b.length) + " weights is " + want + ".");
  },
  budget(L){ return 6 * Math.ceil(Math.log2(L.a.length + L.b.length + 2)) + 12; },
  tip(run){ return run.wAt.some(w => w && (w.lo != null || w.hi != null)) ? [] : ["lo and hi"]; },
  random(L){ L.a = sortedList(Math.random, ri(Math.random, 1, 7), 1, 40); L.b = sortedList(Math.random, ri(Math.random, 1, 6), 1, 40); }
};
