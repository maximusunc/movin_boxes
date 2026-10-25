import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: heaviest k (heap / sorting) ---------- */
export const TopKProblem = {
  id: "topk", tier: 1, tab: "Heaviest k", pattern: "Heap", fname: "heaviest_k.py", levelNoun: "loads",
  title: "Pick the heaviest packages", sig: "weights, k", input: "array", view: "array",
  brief: `<p>The forklift can take <code>k</code> packages, and it should take the heaviest ones. <code>weights[i]</code> is the weight of package <code>i</code>.</p>
<p>Write <code>solve(weights, k)</code> and return a list of the <code>k</code> heaviest weights, in any order.</p>`,
  show: `Every read drops a dot under that package. Name a min-heap <code>heap</code> to watch it hold the best <code>k</code> so far. Scanning for the maximum <code>k</code> times shows up as a pile of dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `import heapq


def solve(weights, k):
    heap = []  # min-heap of the k heaviest so far

    # Push each weight. If the heap grows past k,
    # pop the smallest. What's left is the answer.

    return heap
`,
  watch: ["heap", "h", "top", "result", "res", "best", "i", "w"], pointers: ["i"], panel: ["heap", "h", "top", "result", "res", "best"], arrArg: 0, arrLabel2: "weights",
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: "k", limLabel: "k", maxN: 14, maxV: 99,
  arrayOf: L => L.weights, extraLabel: L => "k = " + L.k,
  levels(){ return [lvl("k1", "Morning load", {weights:[3,9,4,12,7,1,8], k:3}), lvl("k2", "Ties", {weights:[5,5,2,5,1], k:2}), lvl("k3", "Take one", {weights:[6,14,2,9,11], k:1})]; },
  hidden(){
    const rng = mkRng(7), big = Array.from({length:60}, () => ri(rng, 1, 500));
    return [lvl("h1", "Take everything", {weights:[4,1,3], k:3}), lvl("h2", "All the same", {weights:[7,7,7,7], k:2}), lvl("h3", "Long belt, k = 5", {weights:big, k:5}), lvl("h4", "Long belt, k = 12", {weights:big.slice().reverse(), k:12})];
  },
  case(L){ return {args:[L.weights, L.k], arr:[0]}; },
  check(L, ret){
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of the k heaviest weights.");
    const want = L.weights.slice().sort((a, b) => b - a).slice(0, L.k), got = ret.slice().sort((a, b) => b - a);
    if (got.length !== want.length) return bad("Wrong number of packages", "You returned " + got.length + " weights, but k is " + L.k + ".");
    for (let i = 0; i < want.length; i++) if (got[i] !== want[i]) return bad("Not the heaviest", "Expected the weights " + pyRepr(want) + " (in any order), but got " + pyRepr(ret) + ".");
    return ok("Heaviest picked", want.length <= 12 ? "The forklift took " + pyRepr(want) + "." : "The forklift took the right " + want.length + " packages.");
  },
  budget(L){ return 2 * L.weights.length + 4; },
  highlight(ret, L){ if (!Array.isArray(ret)) return null; const need = ret.slice(); const s = new Set(); L.weights.forEach((w, i) => { const j = need.indexOf(w); if (j >= 0){ s.add(i); need.splice(j, 1); } }); return s; },
  tip(run){ return run.wAt.some(w => w && (w.heap || w.h)) ? [] : ["heap"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 40)); L.k = ri(Math.random, 1, Math.min(5, n)); }
};
