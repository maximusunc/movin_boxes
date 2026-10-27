import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: stretches that weigh k (prefix sum + hash map) ---------- */
export const SubarrayProblem = {
  id: "subarray", tier: 3, tab: "Stretches of k", pattern: "Prefix sum + hash map", fname: "stretches_of_k.py", levelNoun: "belts",
  title: "Count the stretches that weigh k", sig: "weights, k", input: "array", view: "array",
  brief: `<p>The scale under the belt logs a change in weight for each package: <code>weights[i]</code> is a whole number, and it can be negative or zero (the load gets lighter when a pallet is lifted off).</p>
<p>Write <code>solve(weights, k)</code> and return how many unbroken stretches <code>weights[i..j]</code> add up to exactly <code>k</code>.</p>`,
  show: `Every read drops a dot under that package. Name your running sum <code>total</code> and your dict of prefix-sum counts <code>seen</code> to watch them grow. Re-adding the same stretch over and over piles up dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["seen", "counts", "prefix", "prefix_counts", "freq", "total", "running", "cur", "count", "ans", "res", "i", "j"], pointers: ["i", "j"],
  panel: ["seen", "counts", "prefix_counts", "freq", "total", "running", "prefix", "count", "ans", "res"], arrArg: 0, arrLabel2: "weight changes",
  editor: "random",
  arrayOf: L => L.weights, extraLabel: L => "k = " + L.k,
  levels(){ return [lvl("s1", "Morning belt", {weights:[1,2,3,-2,2,1], k:3}), lvl("s2", "Ups and downs", {weights:[3,4,-7,1,3,3,1,-4], k:7}), lvl("s3", "Flat stretch", {weights:[0,0,5,0], k:0}), lvl("s4", "Nothing matches", {weights:[2,4,6], k:5})]; },
  hidden(){
    const rng = mkRng(23), big = Array.from({length:70}, () => ri(rng, -6, 9));
    return [lvl("h1", "One package that matches", {weights:[5], k:5}), lvl("h2", "One package that doesn’t", {weights:[5], k:4}),
      lvl("h3", "All zeros, k = 0", {weights:Array(12).fill(0), k:0}), lvl("h4", "Negative k", {weights:[-1,-1,1,-1,2,-3], k:-2}),
      lvl("h5", "Seventy packages", {weights:big, k:6})];
  },
  ref(L){ const seen = new Map([[0, 1]]); let total = 0, n = 0; for (const w of L.weights){ total += w; n += seen.get(total - L.k) || 0; seen.set(total, (seen.get(total) || 0) + 1); } return n; },
  case(L){ return {args:[L.weights, L.k], arr:[0]}; },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of stretches.");
    if (ret !== n) return bad("Wrong count", "You counted " + ret + " stretch" + (ret === 1 ? "" : "es") + ", but " + (n === 1 ? "1 stretch adds" : n + " stretches add") + " up to " + L.k + "." + (n > ret ? " Stretches can overlap, and with zeros or negatives several can end at the same package." : ""));
    return ok("Stretches counted", (n === 1 ? "1 stretch adds" : n + " stretches add") + " up to " + L.k + ".");
  },
  budget(L){ return 2 * L.weights.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.seen || w.counts || w.prefix_counts || w.freq)) ? [] : ["seen"]; },
  random(L){ const n = ri(Math.random, 5, 11); L.weights = Array.from({length:n}, () => ri(Math.random, -4, 7)); const a = ri(Math.random, 0, n - 1), b = ri(Math.random, a, Math.min(n - 1, a + 3)); L.k = L.weights.slice(a, b + 1).reduce((x, y) => x + y, 0); }
};
