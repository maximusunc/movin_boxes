import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: water pooled between racks (two pointers) ---------- */
export const RainProblem = {
  id: "rain", tier: 5, tab: "Pooled water", pattern: "Two pointers", fname: "pooled_water.py", levelNoun: "aisles",
  title: "How much water pooled between the racks?", sig: "heights", input: "array", view: "array",
  brief: `<p>A pipe burst over a row of racks. <code>heights[i]</code> is the height of rack <code>i</code>, and every rack is one unit wide. Water settles between racks wherever something taller on both sides holds it in; anything past the ends runs off.</p>
<p>Write <code>solve(heights)</code> and return how many units of water are trapped.</p>`,
  show: `Every read drops a dot under that rack. Name your pointers <code>left</code> and <code>right</code> and your running maxima <code>left_max</code> and <code>right_max</code> to watch them close in. Scanning both sides from every rack shows up as a pile of dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["left", "right", "l", "r", "i", "left_max", "right_max", "lmax", "rmax", "water", "total", "ans", "res", "stack"],
  pointers: ["left", "right", "l", "r", "i"], panel: ["left_max", "right_max", "lmax", "rmax", "water", "total", "ans", "res", "stack"], markLists: ["stack"],
  arrArg: 0, arrLabel2: "rack heights",
  editor: "array", arr: "heights", arrLabel: "Rack heights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.heights,
  levels(){ return [lvl("r1", "After the leak", {heights:[0,1,0,2,1,0,1,3,2,1,2,1]}), lvl("r2", "Deep pit", {heights:[4,2,0,3,2,5]}), lvl("r3", "Staircase", {heights:[1,2,3,4,5]}), lvl("r4", "Valley", {heights:[5,1,1,1,5]})]; },
  hidden(){
    const rng = mkRng(52), big = Array.from({length:60}, () => ri(rng, 0, 40));
    return [lvl("h1", "No racks", {heights:[]}), lvl("h2", "Single rack", {heights:[7]}), lvl("h3", "Flat floor", {heights:[3,3,3,3]}),
      lvl("h4", "Tall ends, long middle", {heights:[50].concat(Array(40).fill(0), [50])}), lvl("h5", "Sixty racks", {heights:big}), lvl("h6", "Peak in the middle", {heights:[0,2,4,6,8,6,4,2,0]})];
  },
  ref(L){ const h = L.heights; let l = 0, r = h.length - 1, lm = 0, rm = 0, w = 0; while (l < r){ if (h[l] < h[r]){ lm = Math.max(lm, h[l]); w += lm - h[l]; l++; } else { rm = Math.max(rm, h[r]); w += rm - h[r]; r--; } } return w; },
  case(L){ return {args:[L.heights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the units of water as a whole number.");
    if (ret !== want) return bad("Wrong amount", "You counted " + ret + " unit" + (ret === 1 ? "" : "s") + ", but " + want + " unit" + (want === 1 ? " is" : "s are") + " trapped. Water above rack i rises to the lower of the tallest rack on its left and the tallest on its right.");
    return ok("Water measured", want + " unit" + (want === 1 ? " is" : "s are") + " trapped between the racks.");
  },
  budget(L){ return 8 * L.heights.length + 8; },
  tip(run){ return run.wAt.some(w => w && (w.left != null || w.l != null || w.stack)) ? [] : ["left and right"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.heights = Array.from({length:n}, () => ri(Math.random, 0, 9)); }
};
