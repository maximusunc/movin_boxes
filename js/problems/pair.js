import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: crate pair (hash map) ---------- */
export const PairProblem = {
  id: "pair", tier: 1, tab: "Crate pair", pattern: "Hash map", fname: "crate_pair.py", levelNoun: "orders",
  title: "Fill the crate exactly", sig: "weights, capacity", input: "array", view: "array",
  brief: `<p>A crate holds exactly <code>capacity</code> kilograms, and it ships with exactly two packages. <code>weights[i]</code> is the weight of package <code>i</code>.</p>
<p>Write <code>solve(weights, capacity)</code> and return <code>(i, j)</code>, the indices of two different packages whose weights add up to <code>capacity</code>, with <code>i &lt; j</code>. Any valid pair passes. Return <code>None</code> if no pair works.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that package. Name a dict <code>seen</code> to watch it fill up, and loop with <code>i</code> (and <code>j</code>) to see pointers.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned pair</span>`,
  starter: `def solve(weights, capacity):
    seen = {}  # weight -> index

    # For each package, the partner you need weighs
    # capacity - weights[i]. Have you already seen it?
    # Return (i, j) with i < j, or None.

    return None
`,
  watch: ["seen", "lookup", "index", "pos", "i", "j", "need", "complement", "diff", "left", "right", "target"],
  pointers: ["i", "j", "left", "right"], panel: ["seen", "lookup", "index", "pos", "need", "complement", "diff"], arrArg: 0, arrLabel2: "weights",
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: "capacity", limLabel: "Crate capacity", maxN: 14, maxV: 99,
  arrayOf: L => L.weights, extraLabel: L => "capacity " + L.capacity,
  levels(){ return [lvl("p1", "Small order", {weights:[2,7,11,15], capacity:9}), lvl("p2", "Mixed shipment", {weights:[8,3,14,6,9,5,12], capacity:17}), lvl("p3", "Twins", {weights:[4,9,4,1], capacity:8}), lvl("p4", "No match", {weights:[5,1,8,3], capacity:20})]; },
  hidden(){
    const rng = mkRng(11), big = Array.from({length:40}, () => ri(rng, 1, 60)); big.push(97, 98);
    return [lvl("h1", "Two packages only", {weights:[3,3], capacity:6}), lvl("h2", "No pair exists", {weights:[1,2,4,8,16], capacity:7}),
      lvl("h3", "Pair at the very end", {weights:big, capacity:195}), lvl("h4", "Same weight can’t pair with itself", {weights:[5,1,9], capacity:10}),
      lvl("h5", "Single package", {weights:[10], capacity:10})];
  },
  case(L){ return {args:[L.weights, L.capacity], arr:[0]}; },
  check(L, ret){
    const w = L.weights; const has = (() => { const s = new Map(); for (let i = 0; i < w.length; i++){ if (s.has(L.capacity - w[i])) return true; s.set(w[i], i); } return false; })();
    if (ret === null || (Array.isArray(ret) && !ret.length)) return has ? bad("Missed a pair", "You returned None, but two packages do add up to " + L.capacity + ".") : ok("Correct", "No two packages add up to " + L.capacity + ", so None is right.");
    if (!isIntArr(ret, 2)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a pair of indices (i, j), or None.");
    let [i, j] = ret;
    if (i < 0 || j < 0 || i >= w.length || j >= w.length) return bad("Index out of range", "(" + i + ", " + j + ") points past the end of the list.");
    if (i === j) return bad("Same package twice", "You used package " + i + " twice. The two packages must be different.");
    if (w[i] + w[j] !== L.capacity) return bad("Doesn’t fill the crate", "Packages " + i + " and " + j + " weigh " + w[i] + " + " + w[j] + " = " + (w[i] + w[j]) + ", not " + L.capacity + ".");
    if (i > j) return ok("Correct", "Packages " + j + " and " + i + " fill the crate. (Tip: the spec asks for i < j; it’s accepted here.)");
    return ok("Crate filled", "Packages " + i + " and " + j + " weigh " + w[i] + " + " + w[j] + " = " + L.capacity + ".");
  },
  highlight(ret){ return isIntArr(ret, 2) ? new Set(ret) : null; },
  budget(L){ return 3 * L.weights.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.seen || w.lookup || w.index || w.pos)) ? [] : ["seen"]; },
  random(L){ const n = ri(Math.random, 5, 10); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 30)); const a = ri(Math.random, 0, n-1); let b = ri(Math.random, 0, n-1); if (b === a) b = (a + 1) % n; L.capacity = L.weights[a] + L.weights[b]; }
};
