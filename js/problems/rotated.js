import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: search the rotated shelf (binary search) ---------- */
const rotate = (arr, k) => arr.slice(k).concat(arr.slice(0, k));
export const RotatedProblem = {
  id: "rotated", tier: 3, tab: "Rotated shelf", pattern: "Binary search", fname: "rotated_shelf.py", levelNoun: "shelves",
  title: "Search the rotated shelf", sig: "bins, target", input: "array", view: "array",
  brief: `<p>The bins on a shelf were stocked in increasing order of bin number, then the shelf was rotated: some bins from the front were moved, in order, to the back. So <code>[2, 5, 8, 11, 14]</code> might now read <code>[11, 14, 2, 5, 8]</code>. Every bin number is different.</p>
<p>Write <code>solve(bins, target)</code> and return the index of <code>target</code> in <code>bins</code>, or <code>-1</code> if it isn’t on the shelf.</p>`,
  show: `Every read drops a dot under that bin. Name your bounds <code>lo</code> and <code>hi</code> and your guess <code>mid</code> to see the range close in. A scan from one end leaves a dot under every bin.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned index</span>`,
  watch: ["lo", "hi", "mid", "left", "right", "l", "r", "m", "pivot", "i"], pointers: ["lo", "mid", "hi", "left", "right", "l", "m", "r", "pivot", "i"], panel: [], arrArg: 0, arrLabel2: "bin numbers",
  editor: "random",
  arrayOf: L => L.bins, extraLabel: L => "target " + L.target,
  levels(){ return [lvl("r1", "Rotated at 3", {bins:[40,46,52,8,14,20,27,33], target:14}), lvl("r2", "Target before the turn", {bins:[30,35,41,3,9,17], target:35}), lvl("r3", "Not on the shelf", {bins:[12,19,24,2,5,9], target:7}), lvl("r4", "Barely rotated", {bins:[9,1,2,3,4,5,6,7], target:9})]; },
  hidden(){
    const sorted = Array.from({length:80}, (_, i) => 3 * i + 1), big = rotate(sorted, 57);
    return [lvl("h1", "Not rotated", {bins:[1,4,9,16,25,36,49], target:36}), lvl("h2", "Rotated by one", {bins:[60,10,20,30,40,50], target:60}),
      lvl("h3", "One bin, found", {bins:[7], target:7}), lvl("h4", "One bin, missing", {bins:[7], target:3}), lvl("h5", "Two bins", {bins:[8,2], target:2}),
      lvl("h6", "Eighty bins, near the end", {bins:big, target:big[78]}), lvl("h7", "Eighty bins, missing", {bins:big, target:200}),
      lvl("h8", "Eighty bins, at the turn", {bins:big, target:1})];
  },
  case(L){ return {args:[L.bins, L.target], arr:[0]}; },
  check(L, ret){
    const want = L.bins.indexOf(L.target);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return an index, or -1.");
    if (ret !== want) return bad("Wrong index", want < 0 ? "Bin " + L.target + " isn’t on the shelf, so return -1, but you returned " + ret + "." : "Bin " + L.target + " is at index " + want + ", but you returned " + ret + (ret >= 0 && ret < L.bins.length ? " (that’s bin " + L.bins[ret] + ")." : "."));
    return ok(want < 0 ? "Correctly not found" : "Bin found", want < 0 ? "Bin " + L.target + " isn’t on the shelf." : "Bin " + L.target + " is at index " + want + ".");
  },
  highlight(ret, L){ return typeof ret === "number" && ret >= 0 && ret < L.bins.length ? new Set([ret]) : null; },
  // A rotated binary search reads up to about five bins per halving step.
  budget(L){ return 5 * Math.ceil(Math.log2(L.bins.length + 1)) + 8; },
  tip(run){ return run.wAt.some(w => w && (w.mid != null || w.m != null)) ? [] : ["lo, hi and mid"]; },
  random(L){ const n = ri(Math.random, 6, 12); let v = ri(Math.random, 1, 5); const s = Array.from({length:n}, () => (v += ri(Math.random, 1, 7))); L.bins = rotate(s, ri(Math.random, 0, n - 1)); L.target = Math.random() < .8 ? L.bins[ri(Math.random, 0, n - 1)] : s[0] - 1; }
};
