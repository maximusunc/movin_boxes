import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: sort the three bin colors (Dutch national flag) ---------- */
export const SortColorsProblem = {
  id: "sortcolors", tier: 2, tab: "Three bin colors", pattern: "Three-way partition", fname: "three_colors.py", levelNoun: "rows",
  title: "Line the bins up by color", sig: "bins", input: "array", view: "array",
  brief: `<p>Every bin is red, white or blue, recorded as <code>0</code>, <code>1</code> or <code>2</code>. The supervisor wants all the reds, then the whites, then the blues.</p>
<p>Write <code>solve(bins)</code> and return the bins in that order. Don’t call <code>sort</code>: copy the list, then partition the copy in one pass with three pointers (<code>low</code>, <code>mid</code>, <code>high</code>), the way you would in place.</p>`,
  show: `Every read of <code>bins[i]</code> drops a dot under it. Copying the list costs one read per bin; after that, work on the copy.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["low", "mid", "high", "lo", "hi", "i", "a", "arr", "res", "out"], pointers: ["low", "mid", "high", "lo", "hi", "i"], panel: ["a", "arr", "res", "out"], arrArg: 0, arrLabel2: "bin colors",
  editor: "random",
  arrayOf: L => L.bins,
  levels(){ return [lvl("c1", "Mixed row", {bins:[2,0,2,1,1,0]}), lvl("c2", "Already sorted", {bins:[0,0,1,1,2,2]}), lvl("c3", "Backwards", {bins:[2,2,1,1,0,0]})]; },
  hidden(){ const rng = mkRng(3); return [lvl("h1", "One bin", {bins:[1]}), lvl("h2", "All blue", {bins:[2,2,2]}), lvl("h3", "No whites", {bins:[2,0,2,0]}), lvl("h4", "Sixty bins", {bins:Array.from({length:60}, () => ri(rng, 0, 2))})]; },
  case(L){ return {args:[L.bins], arr:[0]}; },
  check(L, ret){
    const want = L.bins.slice().sort((a, b) => a - b);
    if (!Array.isArray(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the bins as a list.");
    if (ret.length !== want.length || ret.some((x, i) => x !== want[i])) return bad("Out of order", "Expected " + (want.length <= 14 ? pyRepr(want) : want.length + " bins, reds first") + ", but got " + (ret.length <= 14 ? pyRepr(ret) : ret.length + " entries") + ".");
    return ok("Bins lined up", want.filter(x => x === 0).length + " red, " + want.filter(x => x === 1).length + " white, " + want.filter(x => x === 2).length + " blue.");
  },
  budget(L){ return 2 * L.bins.length + 4; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.low != null || w.mid != null || w.high != null)) ? [] : ["low, mid and high"]; },
  random(L){ L.bins = Array.from({length: ri(Math.random, 5, 12)}, () => ri(Math.random, 0, 2)); }
};
