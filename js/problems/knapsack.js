import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: most valuable truckload (0/1 knapsack) ---------- */
function pack(items, cap){
  const n = items.length, dp = Array.from({length: n + 1}, () => Array(cap + 1).fill(0));
  for (let i = 1; i <= n; i++){ const [w, v] = items[i - 1]; for (let c = 0; c <= cap; c++){ dp[i][c] = dp[i - 1][c]; if (w <= c && dp[i - 1][c - w] + v > dp[i][c]) dp[i][c] = dp[i - 1][c - w] + v; } }
  const pick = new Set(); for (let i = n, c = cap; i > 0; i--) if (dp[i][c] !== dp[i - 1][c]){ pick.add(i - 1); c -= items[i - 1][0]; }
  return {best: dp[n][cap], pick};
}
export const KnapsackProblem = {
  id: "knapsack", tier: 4, tab: "Truckload", pattern: "Knapsack DP", fname: "truckload.py", levelNoun: "manifests",
  title: "Load the most valuable truck", sig: "items, capacity", input: "array", view: "array",
  brief: `<p>The last truck of the night can carry at most <code>capacity</code> kilograms. Each entry in <code>items</code> is a <code>(weight, value)</code> pair for one package, and each package can go on the truck once or not at all.</p>
<p>Write <code>solve(items, capacity)</code> and return the largest total value that fits.</p>`,
  show: `Each box is one package, shown as weight / value. Every <code>items[i]</code> read drops a dot under it. Name your table <code>dp</code> (by capacity, or by package and capacity) to see it in the panel. Trying every include-or-skip choice reads the same packages over and over.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>A best load</span>`,
  watch: ["dp", "memo", "best", "i", "c", "cap"], pointers: ["i"], panel: ["dp", "memo", "best"], arrArg: 0, arrLabel2: "packages (kg / value)",
  editor: "random",
  arrayOf: L => L.items.map(([w, v]) => w + "/" + v), extraLabel: L => "capacity " + L.capacity + " kg",
  levels(){ return [lvl("k1", "Small truck", {items:[[1,1],[3,4],[4,5],[5,7]], capacity:7}), lvl("k2", "Heavy but worth it", {items:[[10,60],[20,100],[30,120]], capacity:50}), lvl("k3", "Nothing fits", {items:[[8,10],[9,12]], capacity:5}), lvl("k4", "Many small", {items:[[2,3],[2,3],[3,5],[4,6],[5,8],[1,1]], capacity:9})]; },
  hidden(){
    const rng = mkRng(97), many = Array.from({length:16}, () => [ri(rng, 3, 15), ri(rng, 1, 40)]);
    return [lvl("h1", "No packages", {items:[], capacity:10}), lvl("h2", "No room", {items:[[1,5]], capacity:0}), lvl("h3", "Exactly full", {items:[[4,10],[6,10],[10,19]], capacity:10}),
      lvl("h4", "Sixteen packages", {items:many, capacity:50}), lvl("h5", "Sixteen packages, big truck", {items:many, capacity:80})];
  },
  case(L){ return {args:[L.items, L.capacity], arr:[0]}; },
  check(L, ret){
    const {best} = pack(L.items, L.capacity);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the best total value as a number.");
    if (ret !== best) return bad("Not the best load", "The most valuable load that fits is worth " + best + ", but you returned " + ret + "." + (ret > best ? " Check that each package is used at most once and the load stays within " + L.capacity + " kg." : ""));
    return ok("Truck loaded", "The best load is worth " + best + ".");
  },
  highlight(ret, L){ return pack(L.items, L.capacity).pick; },
  // Even a table that re-reads items[i] for every capacity stays within this.
  budget(L){ return 3 * L.items.length * (L.capacity + 1) + 10; },
  tip(run){ return run.wAt.some(w => w && (w.dp || w.memo)) ? [] : ["dp"]; },
  random(L){ L.items = Array.from({length: ri(Math.random, 4, 7)}, () => [ri(Math.random, 1, 9), ri(Math.random, 1, 20)]); L.capacity = ri(Math.random, 8, 20); }
};
