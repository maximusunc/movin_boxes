import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: biggest block of crates (monotonic stack) ---------- */
export const HistogramProblem = {
  id: "histogram", tier: 5, tab: "Biggest block", pattern: "Monotonic stack", fname: "biggest_block.py", levelNoun: "rows",
  title: "Find the biggest block of crates", sig: "heights", input: "array", view: "array",
  brief: `<p>Crates are stacked in a row of columns. <code>heights[i]</code> is how many crates tall column <code>i</code> is, and every column is one crate wide. The shrink-wrap machine can wrap one solid rectangle of crates: a run of neighbouring columns, cut at the height of the shortest one in the run.</p>
<p>Write <code>solve(heights)</code> and return the area, in crates, of the largest rectangle it can wrap.</p>`,
  show: `Every read drops a dot under that column. If your stack named <code>stack</code> holds indices, those columns get a blue outline so you can watch it stay in increasing order.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>On the stack</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["stack", "st", "best", "ans", "res", "area", "max_area", "i", "j"], pointers: ["i", "j"], panel: ["stack", "st", "best", "ans", "res", "area", "max_area"], markLists: ["stack", "st"],
  arrArg: 0, arrLabel2: "column heights",
  editor: "array", arr: "heights", arrLabel: "Column heights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.heights,
  levels(){ return [lvl("b1", "Loading bay", {heights:[2,1,5,6,2,3]}), lvl("b2", "Even wall", {heights:[3,3,3,3]}), lvl("b3", "Tall spike", {heights:[1,1,9,1,1]}), lvl("b4", "Ramp", {heights:[1,2,3,4,5,6]})]; },
  hidden(){
    const rng = mkRng(53), big = Array.from({length:60}, () => ri(rng, 1, 50));
    return [lvl("h1", "Single column", {heights:[7]}), lvl("h2", "Empty row", {heights:[]}), lvl("h3", "A gap in the middle", {heights:[4,4,0,4,4,4]}),
      lvl("h4", "Long ramp down", {heights:Array.from({length:60}, (_, i) => 60 - i)}), lvl("h5", "Sixty columns", {heights:big})];
  },
  ref(L){ const h = L.heights.concat([0]), st = []; let best = 0; h.forEach((x, i) => { while (st.length && h[st[st.length - 1]] >= x){ const top = st.pop(), left = st.length ? st[st.length - 1] + 1 : 0; best = Math.max(best, h[top] * (i - left)); } st.push(i); }); return best; },
  case(L){ return {args:[L.heights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the area as a whole number.");
    if (ret !== want) return bad("Wrong area", "You found " + ret + " crate" + (ret === 1 ? "" : "s") + ", but the biggest block holds " + want + "." + (ret > want ? " A block can only be as tall as its shortest column." : ""));
    return ok("Block found", "The biggest block holds " + want + " crate" + (want === 1 ? "" : "s") + ".");
  },
  budget(L){ return 7 * L.heights.length + 8; },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["stack"]; },
  random(L){ const n = ri(Math.random, 5, 12); L.heights = Array.from({length:n}, () => ri(Math.random, 1, 9)); }
};
