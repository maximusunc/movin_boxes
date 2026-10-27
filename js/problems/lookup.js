import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: find the bin (binary search) ---------- */
const sortedBins = (rng, n, step) => { const out = []; let v = ri(rng, 1, 5); for (let i = 0; i < n; i++){ out.push(v); v += ri(rng, 1, step); } return out; };
export const LookupProblem = {
  id: "lookup", tier: 1, tab: "Find the bin", pattern: "Binary search", fname: "find_the_bin.py", levelNoun: "aisles",
  title: "Find the bin", sig: "bins, target", input: "array", view: "array",
  brief: `<p>The bins along an aisle are labeled with numbers in increasing order, with no repeats. <code>bins[i]</code> is the label of the bin at position <code>i</code>.</p>
<p>Write <code>solve(bins, target)</code> and return the position of the bin labeled <code>target</code>, or <code>-1</code> if there isn’t one.</p>`,
  show: `Every <code>bins[i]</code> read drops a dot under that bin. Name your bounds <code>lo</code> and <code>hi</code> and your guess <code>mid</code> to watch the search range close in. Checking bins one by one leaves a long trail of dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned bin</span>`,
  starter: `def solve(bins, target):
    lo, hi = 0, len(bins) - 1

    # While the range isn't empty, look at the middle bin.
    # If it's the target, you're done. If it's too small,
    # the target can only be to the right; otherwise, left.

    return -1
`,
  watch: ["lo", "hi", "mid", "left", "right", "low", "high", "m", "i"], pointers: ["lo", "hi", "mid", "left", "right", "low", "high", "m", "i"], panel: [], arrArg: 0, arrLabel2: "bin labels",
  editor: "random",
  arrayOf: L => L.bins, extraLabel: L => "target " + L.target,
  levels(){ return [lvl("b1", "Short aisle", {bins:[2,5,8,12,16,23,38,56,72,91], target:23}), lvl("b2", "First bin", {bins:[3,7,11,15,19], target:3}), lvl("b3", "Not stocked", {bins:[4,9,13,20,27,31,40], target:21}), lvl("b4", "Last bin", {bins:[1,2,4,8,16,32,64], target:64})]; },
  hidden(){
    const big = sortedBins(mkRng(29), 63, 4), huge = Array.from({length:120}, (_, i) => 3 * i + 1);
    return [lvl("h1", "One bin, found", {bins:[5], target:5}), lvl("h2", "One bin, missing", {bins:[5], target:4}),
      lvl("h3", "Smaller than every bin", {bins:[10,20,30,40], target:1}), lvl("h4", "Bigger than every bin", {bins:[10,20,30,40], target:99}),
      lvl("h5", "Falls between two bins", {bins:big, target:big[40] + 1}), lvl("h6", "Near the end of 63 bins", {bins:big, target:big[61]}),
      lvl("h7", "120 bins, the last one", {bins:huge, target:huge[119]})];
  },
  ref(L){ return L.bins.indexOf(L.target); },
  case(L){ return {args:[L.bins, L.target], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a position, or -1.");
    if (ret !== want) return bad("Wrong position", want < 0 ? "No bin is labeled " + L.target + ", so the answer is -1, but you returned " + ret + "." : "The bin labeled " + L.target + " is at position " + want + ", but you returned " + ret + (ret >= 0 && ret < L.bins.length ? " (that bin is labeled " + L.bins[ret] + ")." : "."));
    return ok("Bin found", want < 0 ? "No bin is labeled " + L.target + ", so -1 is right." : "Bin " + L.target + " is at position " + want + ".");
  },
  highlight(ret, L){ return Number.isInteger(ret) && ret >= 0 && ret < L.bins.length ? new Set([ret]) : null; },
  budget(L){ return 2 * Math.ceil(Math.log2(L.bins.length + 1)) + 6; },
  tip(run){ return run.wAt.some(w => w && (w.mid != null || w.m != null)) ? [] : ["mid"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.bins = sortedBins(Math.random, n, 9); L.target = L.bins[ri(Math.random, 0, n - 1)] + (Math.random() < .7 ? 0 : 1); }
};
