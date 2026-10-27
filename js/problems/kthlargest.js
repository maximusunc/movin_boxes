import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: k-th heaviest crate (quickselect / heap) ---------- */
const ord = k => k + (k % 100 >= 11 && k % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][k % 10] || "th");
export const KthLargestProblem = {
  id: "kthlargest", tier: 3, tab: "K-th heaviest", pattern: "Quickselect", fname: "kth_heaviest.py", levelNoun: "loads",
  title: "Find the k-th heaviest crate", sig: "weights, k", input: "array", view: "array",
  brief: `<p>The scale logs every crate’s weight in <code>weights</code>. Weights can repeat. The dispatcher needs the weight of the <code>k</code>-th heaviest crate: with weights <code>[3, 9, 9, 4]</code>, the 1st heaviest is 9, the 2nd is also 9, and the 3rd is 4.</p>
<p>Write <code>solve(weights, k)</code> and return that weight. <code>k</code> is between 1 and the number of crates.</p>`,
  show: `Every read drops a dot under that crate. A heap named <code>heap</code> or a partition’s <code>pivot</code> shows in the panel. Scanning the whole list once per k leaves a pile of dots and runs over budget.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>A crate with the returned weight</span>`,
  watch: ["heap", "h", "pivot", "lo", "hi", "i", "j"], pointers: ["i", "j"], panel: ["heap", "h", "pivot"], arrArg: 0, arrLabel2: "crate weights",
  editor: "random",
  arrayOf: L => L.weights, extraLabel: L => "k = " + L.k,
  levels(){ return [lvl("k1", "Small load", {weights:[3,2,1,5,6,4], k:2}), lvl("k2", "Repeats", {weights:[3,2,3,1,2,4,5,5,6], k:4}), lvl("k3", "Lightest one", {weights:[7,10,4,3,20,15], k:6})]; },
  hidden(){
    const rng = mkRng(71), big = Array.from({length:70}, () => ri(rng, 1, 500));
    return [lvl("h1", "One crate", {weights:[8], k:1}), lvl("h2", "All the same", {weights:[5,5,5,5], k:3}),
      lvl("h3", "Seventy crates, k = 20", {weights:big, k:20}), lvl("h4", "Seventy crates, k = 1", {weights:big.slice().reverse(), k:1}), lvl("h5", "Seventy crates, k = 70", {weights:big, k:70})];
  },
  ref(L){ return L.weights.slice().sort((a, b) => b - a)[L.k - 1]; },
  case(L){ return {args:[L.weights, L.k], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a single weight.");
    if (ret !== want) return bad("Wrong weight", "The " + ord(L.k) + " heaviest crate weighs " + want + ", but you returned " + ret + ".");
    return ok("Crate found", "The " + ord(L.k) + " heaviest crate weighs " + want + ".");
  },
  highlight(ret, L){ const i = L.weights.indexOf(ret); return i >= 0 ? new Set([i]) : null; },
  budget(L){ return 3 * L.weights.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.heap || w.h || w.pivot != null)) ? [] : ["heap"]; },
  random(L){ const n = ri(Math.random, 5, 12); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 40)); L.k = ri(Math.random, 1, n); }
};
