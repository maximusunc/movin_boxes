import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: weight ledger (design: segment tree / Fenwick tree) ---------- */
function randomOps(rng, n, len){
  const ops = [];
  for (let i = 0; i < n; i++){
    if (rng() < .5) ops.push(["update", ri(rng, 0, len - 1), ri(rng, -50, 99)]);
    else { const a = ri(rng, 0, len - 1), b = ri(rng, 0, len - 1); ops.push(["sum_range", Math.min(a, b), Math.max(a, b)]); }
  }
  return ops;
}
export const RangeSumProblem = {
  id: "rangesum", tier: 5, tab: "Weight ledger", pattern: "Segment / Fenwick tree", fname: "weight_ledger.py", levelNoun: "ledgers",
  title: "Keep a live ledger of shelf weights", sig: "", design: "NumArray", input: "array", view: "array",
  brief: `<p><code>nums[i]</code> is the weight on shelf <code>i</code>. Weights change during the day, and the floor lead keeps asking for the total on a stretch of shelves.</p>
<p>Write a class <code>NumArray(nums)</code> with <code>update(i, val)</code>, which sets shelf <code>i</code> to <code>val</code>, and <code>sum_range(l, r)</code>, which returns the total from shelf <code>l</code> to shelf <code>r</code>, inclusive. Both should run in <code>O(log n)</code>: build a segment tree or a Fenwick (binary indexed) tree once in the constructor, and read <code>nums</code> only while building.</p>`,
  show: `Each box is one call: <code>3=7</code> is <code>update(3, 7)</code> and <code>2..5</code> is <code>sum_range(2, 5)</code>. Name your tree <code>self.tree</code> to watch it.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class NumArray:
    def __init__(self, nums):
        pass

    def update(self, i, val):
        pass

    def sum_range(self, l, r):
        pass
`,
  watch: ["tree", "bit", "fenwick", "seg"], panel: ["tree", "bit", "fenwick", "seg"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "update" ? o[1] + "=" + o[2] : o[1] + ".." + o[2]), extraLabel: L => "nums " + (L.nums.length <= 10 ? L.nums.join(" ") : L.nums.length + " shelves"),
  levels(){ return [
    lvl("g1", "Three shelves", {nums:[1,3,5], ops:[["sum_range",0,2],["update",1,2],["sum_range",0,2]]}),
    lvl("g2", "Busy morning", {nums:[4,9,2,7,5,1], ops:[["sum_range",1,3],["update",2,10],["sum_range",0,5],["update",0,-4],["sum_range",0,1],["sum_range",5,5]]}),
    lvl("g3", "Negative weights", {nums:[-2,0,3,-5,2,-1], ops:[["sum_range",0,2],["sum_range",2,5],["update",3,0],["sum_range",0,5]]})
  ]; },
  hidden(){
    const rng = mkRng(111), big = Array.from({length:600}, () => ri(rng, -50, 99));
    return [lvl("h1", "One shelf", {nums:[7], ops:[["sum_range",0,0],["update",0,3],["sum_range",0,0]]}),
      lvl("h2", "Same shelf over and over", {nums:[1,2,3,4], ops:[["update",2,9],["update",2,1],["update",2,5],["sum_range",1,2],["sum_range",2,3]]}),
      lvl("h3", "Six hundred shelves", {nums: big, ops: randomOps(mkRng(113), 450, 600)})];   // results lists are capped at 500 entries
  },
  ref(L){ const a = L.nums.slice(); return L.ops.map(([op, x, y]) => { if (op === "update"){ a[x] = y; return null; } let s = 0; for (let i = x; i <= y; i++) s += a[i]; return s; }); },
  case(L){ return {init: [L.nums], arr: [0], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong total", "Call " + i + ", sum_range(" + L.ops[i][1] + ", " + L.ops[i][2] + "), returned " + pyRepr(ret[i]) + " but should return " + want[i] + ".");
    }
    return ok("Ledger balances", "All " + want.filter(x => x !== null).length + " totals are right.");
  },
  budget(L){ return 2 * L.nums.length + 4; },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.tree || w.bit || w.fenwick || w.seg)) ? [] : ["self.tree"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.nums = Array.from({length: n}, () => ri(Math.random, -5, 20)); L.ops = randomOps(Math.random, ri(Math.random, 5, 9), n); }
};
