import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: heaviest in every window (monotonic deque) ---------- */
export const WindowProblem = {
  id: "window", tier: 5, tab: "Window max", pattern: "Monotonic deque", fname: "window_max.py", levelNoun: "belts",
  title: "Heaviest in every window", sig: "weights, k", input: "array", view: "array",
  brief: `<p>The scale under the belt sees <code>k</code> packages at a time. As the belt moves one package forward, the window slides by one. <code>weights[i]</code> is the weight of package <code>i</code>, and <code>1 ≤ k ≤ len(weights)</code>.</p>
<p>Write <code>solve(weights, k)</code> and return a list with the heaviest weight in every window of <code>k</code> consecutive packages, from left to right.</p>`,
  show: `Every read drops a dot under that package. Keep a deque of indices named <code>dq</code> and those packages get a blue outline, so you can watch it stay in decreasing order. Your answer list shows as <code>res</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>In the deque</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dq", "deque", "q", "window", "res", "result", "ans", "out", "i"], pointers: ["i"], panel: ["dq", "deque", "q", "window", "res", "result", "ans", "out"],
  markLists: ["dq", "deque", "q", "window"], arrArg: 0, arrLabel2: "weights",
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: "k", limLabel: "Window size k", maxN: 14, maxV: 99,
  arrayOf: L => L.weights, extraLabel: L => "k = " + L.k,
  levels(){ return [lvl("w1", "Morning belt", {weights:[1,3,8,5,3,6,7,2], k:3}), lvl("w2", "Heavy first", {weights:[9,7,5,3,1,2], k:2}), lvl("w3", "Climbing", {weights:[2,4,6,8,10,12], k:4}), lvl("w4", "Ties", {weights:[4,4,2,4,4], k:3})]; },
  hidden(){
    const rng = mkRng(51), big = Array.from({length:70}, () => ri(rng, 1, 99));
    return [lvl("h1", "Window of one", {weights:[5,1,4], k:1}), lvl("h2", "Window is the whole belt", {weights:[3,9,2,7], k:4}), lvl("h3", "Single package", {weights:[6], k:1}),
      lvl("h4", "Long descending belt", {weights:Array.from({length:60}, (_, i) => 100 - i), k:7}), lvl("h5", "Seventy packages, k = 12", {weights:big, k:12})];
  },
  ref(L){ const w = L.weights, out = []; for (let i = 0; i + L.k <= w.length; i++) out.push(Math.max(...w.slice(i, i + L.k))); return out; },
  case(L){ return {args:[L.weights, L.k], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one weight per window.");
    if (ret.length !== want.length) return bad("Wrong number of windows", "There are " + want.length + " windows of " + L.k + " packages, but your list has " + ret.length + " entries.");
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]) return bad("Wrong maximum", "Window " + i + " covers packages " + i + " to " + (i + L.k - 1) + ". Its heaviest is " + want[i] + ", but you have " + pyRepr(ret[i]) + ".");
    return ok("Every window weighed", want.length <= 12 ? "The answer is " + pyRepr(want) + "." : "All " + want.length + " windows match.");
  },
  budget(L){ return 6 * L.weights.length + 8; },
  tip(run){ return run.wAt.some(w => w && (w.dq || w.deque || w.q || w.window)) ? [] : ["dq"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 30)); L.k = ri(Math.random, 2, Math.min(4, n)); }
};
