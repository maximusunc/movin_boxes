import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: fewest boxes for an order (1D dynamic programming) ---------- */
export const CoinsProblem = {
  id: "coins", tier: 4, tab: "Fewest boxes", pattern: "Dynamic programming", fname: "fewest_boxes.py", levelNoun: "orders",
  title: "Fewest boxes for an order", sig: "sizes, order", input: "array", view: "array",
  brief: `<p>The packing station has boxes that hold exactly <code>sizes[i]</code> items each, with as many boxes of each size as you like. Every box must be completely full.</p>
<p>Write <code>solve(sizes, order)</code> and return the fewest boxes that hold exactly <code>order</code> items, or <code>-1</code> if no mix of boxes adds up to it. An order of <code>0</code> needs no boxes.</p>`,
  show: `Every read of <code>sizes[i]</code> drops a dot under that box size. Name your table <code>dp</code> (a list) or <code>memo</code> (a dict) to watch it fill in. Plain recursion without a memo tries the same amounts again and again, and the dots pile up.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["dp", "memo", "best", "amount", "a", "s", "size", "i"], pointers: ["i"], panel: ["dp", "memo", "best"], arrArg: 0, arrLabel2: "box sizes",
  editor: "random",
  arrayOf: L => L.sizes, extraLabel: L => "order = " + L.order,
  levels(){ return [lvl("c1", "Small order", {sizes:[1,2,5], order:11}), lvl("c2", "Greedy trap", {sizes:[1,3,4], order:6}), lvl("c3", "Can’t be packed", {sizes:[4,6], order:9}), lvl("c4", "Big boxes only", {sizes:[6,9,20], order:43})]; },
  hidden(){
    return [lvl("h1", "Empty order", {sizes:[3,7], order:0}), lvl("h2", "Impossible", {sizes:[4,6], order:7}), lvl("h3", "One size fits", {sizes:[7], order:49}),
      lvl("h4", "Order of 100", {sizes:[1,5,10,25], order:100}), lvl("h5", "Greedy fails", {sizes:[1,7,10], order:14}), lvl("h6", "Awkward sizes", {sizes:[2,5,11,13], order:97})];
  },
  ref(L){ const INF = 1e9, dp = Array(L.order + 1).fill(INF); dp[0] = 0; for (let a = 1; a <= L.order; a++) for (const s of L.sizes) if (s <= a && dp[a - s] + 1 < dp[a]) dp[a] = dp[a - s] + 1; return dp[L.order] >= INF ? -1 : dp[L.order]; },
  case(L){ return {args:[L.sizes, L.order], arr:[0]}; },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of boxes, or -1.");
    if (ret !== n) return bad("Wrong count", n < 0 ? "No mix of " + pyRepr(L.sizes) + " adds up to " + L.order + ", so return -1, but you returned " + ret + "." : "You returned " + ret + ", but " + L.order + " items fit in " + n + " box" + (n === 1 ? "" : "es") + "." + (ret > n && ret > 0 ? " Taking the biggest box first isn’t always best." : ""));
    return ok("Order packed", n < 0 ? "No mix of boxes adds up to " + L.order + ", and you caught it." : L.order + " items fit in " + n + " box" + (n === 1 ? "" : "es") + ".");
  },
  // Filling dp[0..order] reads each box size once per amount.
  budget(L){ return 2 * (L.order + 1) * L.sizes.length + 2 * L.sizes.length + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo)) ? [] : ["dp"]; },
  random(L){ const k = ri(Math.random, 2, 4), s = new Set(); while (s.size < k) s.add(ri(Math.random, 1, 12)); L.sizes = [...s].sort((a, b) => a - b); L.order = ri(Math.random, 5, 30); }
};
