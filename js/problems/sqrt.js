import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: square loading bay (integer square root by binary search) ---------- */
const isqrt = x => { let r = Math.floor(Math.sqrt(x)); while (r * r > x) r--; while ((r + 1) * (r + 1) <= x) r++; return r; };
export const SqrtProblem = {
  id: "sqrt", tier: 1, tab: "Square bay", pattern: "Binary search", fname: "square_bay.py", levelNoun: "deliveries",
  title: "How wide a square bay?", sig: "tiles", input: "array", view: "array",
  brief: `<p>A delivery of <code>tiles</code> floor tiles arrives, and the crew wants to lay the biggest square loading bay they can, <code>k × k</code> tiles, without running out.</p>
<p>Write <code>solve(tiles)</code> and return that <code>k</code>: the largest whole number with <code>k * k &lt;= tiles</code>. Don’t use <code>** 0.5</code>, <code>math.sqrt</code> or <code>math.isqrt</code>; <code>tiles</code> can be as large as 2,147,483,647, so counting up one at a time is too slow.</p>`,
  show: `The box shows <code>tiles</code>. A plain number isn’t traced, so <code>print(lo, hi)</code> inside your loop if you want to watch the range shrink.`,
  legend: ``,
  starter: `def solve(tiles):
    lo, hi = 0, tiles

    # Binary search for the answer: k*k <= tiles is True for
    # small k and False for big k. Keep lo as a k that works
    # and shrink the range until lo and hi meet.
    # With lo = mid, round up: mid = (lo + hi + 1) // 2,
    # or the loop can get stuck when hi == lo + 1.

    return lo
`,
  watch: [], arrArg: 0, arrLabel2: "tiles",
  editor: "random",
  arrayOf: L => [L.tiles],
  levels(){ return [lvl("q1", "Eight tiles", {tiles:8}), lvl("q2", "A perfect square", {tiles:144}), lvl("q3", "Just under a square", {tiles:99})]; },
  hidden(){ return [lvl("h1", "No tiles", {tiles:0}), lvl("h2", "One tile", {tiles:1}), lvl("h3", "Three tiles", {tiles:3}), lvl("h4", "The biggest delivery", {tiles:2147483647}), lvl("h5", "Exactly 46,340 squared", {tiles:2147395600}), lvl("h6", "One tile short of that", {tiles:2147395599})]; },
  case(L){ return {args:[L.tiles], arr:[]}; },
  check(L, ret){
    const want = isqrt(L.tiles);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return k as a whole number.");
    if (ret !== want) return bad("Wrong width", ret > want ? "A " + ret + " × " + ret + " bay needs " + ret * ret + " tiles, but only " + L.tiles + " arrived. The answer is " + want + "." : "A " + (ret + 1) + " × " + (ret + 1) + " bay still fits. The answer is " + want + ".");
    return ok("Bay sized", "A " + want + " × " + want + " bay uses " + want * want + " of the " + L.tiles + " tiles.");
  },
  tip(){ return []; },
  random(L){ L.tiles = ri(Math.random, 0, 5000); }
};
