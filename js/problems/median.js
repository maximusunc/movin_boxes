import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: running median weight (two heaps) ---------- */
export const MedianProblem = {
  id: "median", tier: 5, tab: "Running median", pattern: "Two heaps", fname: "running_median.py", levelNoun: "deliveries",
  title: "Track the running median weight", sig: "weights", input: "array", view: "array",
  brief: `<p>Packages arrive at the scale one at a time, and the dashboard shows the median weight of everything that has arrived so far. With an odd count it’s the middle weight; with an even count it’s the average of the two middle weights, such as <code>2.5</code>.</p>
<p>Write <code>solve(weights)</code> and return a list with the median after each arrival, in order.</p>`,
  show: `Every read drops a dot under that package. Keep a max-heap of the lighter half named <code>low</code> and a min-heap of the heavier half named <code>high</code> to see both in the panel, along with your list of medians.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["low", "high", "lo", "hi", "small", "large", "left", "right", "medians", "res", "ans", "out", "i"], pointers: ["i"],
  panel: ["low", "high", "lo", "hi", "small", "large", "left", "right", "medians", "res", "ans", "out"], arrArg: 0, arrLabel2: "arrivals",
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.weights,
  levels(){ return [lvl("m1", "Morning deliveries", {weights:[5,15,1,3,8,7]}), lvl("m2", "Getting heavier", {weights:[2,4,6,8,10]}), lvl("m3", "Back and forth", {weights:[10,1,10,1,10,1,10]})]; },
  hidden(){
    const rng = mkRng(55);
    return [lvl("h1", "One package", {weights:[42]}), lvl("h2", "All the same", {weights:[7,7,7,7,7]}), lvl("h3", "Steadily increasing", {weights:Array.from({length:40}, (_, i) => i + 1)}),
      lvl("h4", "Steadily decreasing", {weights:Array.from({length:40}, (_, i) => 80 - 2*i)}), lvl("h5", "Sixty random arrivals", {weights:Array.from({length:60}, () => ri(rng, 1, 500))})];
  },
  ref(L){ const s = [], out = []; for (const w of L.weights){ let i = 0; while (i < s.length && s[i] < w) i++; s.splice(i, 0, w); const n = s.length; out.push(n % 2 ? s[(n - 1) / 2] : (s[n/2 - 1] + s[n/2]) / 2); } return out; },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one median per arrival.");
    if (ret.length !== want.length) return bad("Wrong length", "There were " + want.length + " arrivals, but your list has " + ret.length + " medians.");
    for (let i = 0; i < want.length; i++) if (Math.abs(ret[i] - want[i]) > 1e-9) return bad("Wrong median", "After " + (i + 1) + " arrival" + (i ? "s" : "") + " the median is " + want[i] + ", but you have " + pyRepr(ret[i]) + "." + (i % 2 ? " With an even count, average the two middle weights." : ""));
    return ok("Dashboard is right", want.length <= 10 ? "The medians are " + pyRepr(want) + "." : "All " + want.length + " medians match.");
  },
  budget(L){ return 2 * L.weights.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.low || w.high || w.lo || w.hi || w.small || w.large)) ? [] : ["low and high"]; },
  random(L){ const n = ri(Math.random, 5, 10); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 40)); }
};
