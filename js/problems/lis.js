import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: longest rising run (longest increasing subsequence) ---------- */
function lisOf(a){
  // patience sorting with parent links, so we can show one longest run
  const tails = [], tailIdx = [], par = Array(a.length).fill(-1);
  a.forEach((x, i) => {
    let lo = 0, hi = tails.length; while (lo < hi){ const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
    tails[lo] = x; tailIdx[lo] = i; par[i] = lo ? tailIdx[lo - 1] : -1;
  });
  const pick = new Set(); let k = tails.length ? tailIdx[tails.length - 1] : -1; while (k >= 0){ pick.add(k); k = par[k]; }
  return {len: tails.length, pick};
}
export const LisProblem = {
  id: "lis", tier: 4, tab: "Rising run", pattern: "Dynamic programming", fname: "rising_run.py", levelNoun: "rows",
  title: "Longest run of rising weights", sig: "weights", input: "array", view: "array",
  brief: `<p>Crates come off the line in order, and the stacker wants to pick out a run of them, keeping their order, where every crate is strictly heavier than the one before. The crates it picks don’t have to be next to each other.</p>
<p>Write <code>solve(weights)</code> and return the length of the longest such run. Aim for better than comparing every pair of crates.</p>`,
  show: `Every <code>weights[i]</code> read drops a dot under that crate. Name your list of smallest run endings <code>tails</code> to watch it grow. Comparing every pair piles up dots fast.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>A longest run</span>`,
  watch: ["tails", "sub", "piles", "dp", "best", "i", "j"], pointers: ["i", "j"], panel: ["tails", "sub", "piles", "dp", "best"], arrArg: 0, arrLabel2: "crate weights",
  editor: "array", arr: "weights", arrLabel: "Crate weights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.weights,
  levels(){ return [lvl("l1", "Up and down", {weights:[10,9,2,5,3,7,101,18]}), lvl("l2", "Ties don’t count", {weights:[7,7,7,7]}), lvl("l3", "Zig-zag", {weights:[0,8,4,12,2,10,6,14,1,9]}), lvl("l4", "Already rising", {weights:[1,3,6,7,9]})]; },
  hidden(){
    const rng = mkRng(83), big = Array.from({length:70}, () => ri(rng, 1, 500));
    return [lvl("h1", "One crate", {weights:[5]}), lvl("h2", "No crates", {weights:[]}), lvl("h3", "Falling", {weights:[9,8,7,6,5,4]}),
      lvl("h4", "Seventy crates", {weights:big}), lvl("h5", "Seventy rising", {weights:Array.from({length:70}, (_, i) => i * 3)})];
  },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const {len} = lisOf(L.weights);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the length as a number.");
    if (ret !== len) return bad("Wrong length", "The longest rising run has " + len + " crate" + (len === 1 ? "" : "s") + ", but you returned " + ret + "." + (ret > len ? " Each crate must be strictly heavier than the one before." : ""));
    return ok("Longest run found", "The longest rising run has " + len + " crate" + (len === 1 ? "" : "s") + ".");
  },
  highlight(ret, L){ return lisOf(L.weights).pick; },
  // One pass that binary-searches a separate tails list reads each weight about once.
  budget(L){ return 3 * L.weights.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.tails || w.sub || w.piles)) ? [] : ["tails"]; },
  random(L){ L.weights = Array.from({length: ri(Math.random, 6, 12)}, () => ri(Math.random, 1, 40)); }
};
