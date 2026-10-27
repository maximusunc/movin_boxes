import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: forecast repeat orders (fast modular exponentiation) ---------- */
function powmod(b, e, m){ let B = BigInt(b) % BigInt(m), E = BigInt(e), r = 1n % BigInt(m); const M = BigInt(m); while (E > 0n){ if (E & 1n) r = r * B % M; B = B * B % M; E >>= 1n; } return Number(r); }
export const PowModProblem = {
  id: "powmod", tier: 3, tab: "Repeat orders", pattern: "Fast exponentiation", fname: "repeat_orders.py", levelNoun: "forecasts",
  title: "Forecast the repeat orders", sig: "base, exp, mod", input: "array", view: "array",
  brief: `<p>Every week each customer brings in <code>base</code> new ones, so after <code>exp</code> weeks the order count is <code>base ** exp</code>. The forecast board only shows that number modulo <code>mod</code>.</p>
<p>Write <code>solve(base, exp, mod)</code> and return <code>(base ** exp) % mod</code>. <code>exp</code> can be as big as 2<sup>53</sup> − 1, about 9 × 10<sup>15</sup>, so multiplying <code>exp</code> times is far too slow, and you may not use <code>pow()</code> or <code>**</code>: square and multiply instead, about <code>O(log exp)</code> steps.</p>`,
  show: `The boxes show <code>base</code>, <code>exp</code> and <code>mod</code>. Plain numbers aren’t traced; this one is about the squaring trick.`,
  legend: ``,
  watch: [], arrArg: 0, arrLabel2: "base, exp, mod",
  editor: "random",
  arrayOf: L => [L.base, L.exp, L.mod],
  levels(){ return [lvl("e1", "Small forecast", {base:2, exp:10, mod:1000}), lvl("e2", "A year out", {base:3, exp:52, mod:1000000007}), lvl("e3", "A million weeks", {base:7, exp:1000000, mod:13})]; },
  hidden(){ return [lvl("h1", "Zero weeks", {base:5, exp:0, mod:7}), lvl("h2", "Modulo 1", {base:9, exp:12, mod:1}), lvl("h3", "Base zero", {base:0, exp:5, mod:11}),
    lvl("h4", "A quadrillion weeks", {base:123456789, exp:1e15, mod:1000000007}), lvl("h5", "2^53 − 1 weeks", {base:999999999, exp:2 ** 53 - 1, mod:998244353}),
    lvl("h6", "Base bigger than mod", {base:1000000000, exp:4503599627370495, mod:65537})]; },
  case(L){ return {args:[L.base, L.exp, L.mod], arr:[]}; },
  check(L, ret){
    const want = powmod(L.base, L.exp, L.mod), expr = "(" + L.base + " ** " + BigInt(L.exp) + ") % " + L.mod;
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a whole number from 0 to mod − 1.");
    if (ret !== want) return bad("Wrong forecast", expr + " is " + want + ", but you returned " + ret + "." + (L.mod === 1 ? " Anything modulo 1 is 0." : L.exp === 0 ? " Anything to the power 0 is 1." : ""));
    return ok("Forecast ready", expr + " = " + want + ".");
  },
  tip(){ return []; },
  random(L){ L.base = ri(Math.random, 2, 50); L.exp = ri(Math.random, 0, 1000000); L.mod = ri(Math.random, 2, 1000000); }
};
