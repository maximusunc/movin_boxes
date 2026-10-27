import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: routes across a huge floor (combinatorics mod p) ---------- */
const MOD = 1000000007;
function routes(r, c){ const row = new Array(c).fill(1); for (let i = 1; i < r; i++) for (let j = 1; j < c; j++) row[j] = (row[j] + row[j - 1]) % MOD; return row[c - 1]; }
export const BigRoutesProblem = {
  id: "bigroutes", tier: 3, tab: "Huge floor", pattern: "Combinatorics", fname: "huge_floor.py", levelNoun: "floors",
  title: "Count routes across a huge floor", sig: "rows, cols", input: "array", view: "array",
  brief: `<p>A robot starts in the top-left cell of an empty <code>rows × cols</code> floor and must reach the bottom-right cell, moving only right or down.</p>
<p>Write <code>solve(rows, cols)</code> and return the number of different routes, modulo <code>1_000_000_007</code>. Floors go up to 300 × 500, so the count is enormous: keep numbers small with <code>%</code> as you go. A DP over the floor, <code>O(rows · cols)</code>, or the binomial coefficient C(rows + cols − 2, rows − 1) with modular inverses both work.</p>`,
  show: `The boxes show <code>rows</code> and <code>cols</code>. Plain numbers aren’t traced; this one is about the counting.`,
  legend: ``,
  watch: [], arrArg: 0, arrLabel2: "rows, cols",
  editor: "random",
  arrayOf: L => [L.rows, L.cols],
  levels(){ return [lvl("b1", "3 × 7", {rows:3, cols:7}), lvl("b2", "3 × 2", {rows:3, cols:2}), lvl("b3", "20 × 20", {rows:20, cols:20})]; },
  hidden(){ return [lvl("h1", "One cell", {rows:1, cols:1}), lvl("h2", "One row", {rows:1, cols:400}), lvl("h3", "One column", {rows:250, cols:1}),
    lvl("h4", "40 × 40", {rows:40, cols:40}), lvl("h5", "300 × 500", {rows:300, cols:500})]; },
  case(L){ return {args:[L.rows, L.cols], arr:[]}; },
  check(L, ret){
    const want = routes(L.rows, L.cols);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the count modulo 1_000_000_007.");
    if (ret !== want) return bad("Wrong count", "On a " + L.rows + " × " + L.cols + " floor the answer, modulo 1_000_000_007, is " + want + ", but you returned " + ret + "." + (ret >= MOD ? " Take the result modulo 1_000_000_007." : ""));
    return ok("Routes counted", "There are " + want + " routes, modulo 1_000_000_007.");
  },
  tip(){ return []; },
  random(L){ L.rows = ri(Math.random, 1, 30); L.cols = ri(Math.random, 1, 30); }
};
