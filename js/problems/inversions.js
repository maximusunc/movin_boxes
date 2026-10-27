import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: count out-of-order pairs (merge sort) ---------- */
export const InversionsProblem = {
  id: "inversions", tier: 4, tab: "Out-of-order pairs", pattern: "Merge sort", fname: "out_of_order.py", levelNoun: "belts",
  title: "How far from sorted is the belt?", sig: "weights", input: "array", view: "array",
  brief: `<p>Crates should come down the belt lightest first. To measure how jumbled a belt is, count every pair of crates that’s in the wrong order: positions <code>i &lt; j</code> with <code>weights[i] &gt; weights[j]</code>. Equal weights aren’t out of order.</p>
<p>Write <code>solve(weights)</code> and return the number of out-of-order pairs. Checking every pair is too slow for long belts.</p>`,
  show: `Every read of <code>weights[i]</code> drops a dot under that crate. Copy the list once, then merge sort the copy and count as you merge: the dots stay at one per crate.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["count", "inv", "total", "ans", "res", "i", "j"], pointers: ["i", "j"], panel: ["count", "inv", "total", "ans", "res"], arrArg: 0, arrLabel2: "crate weights",
  editor: "random",
  arrayOf: L => L.weights,
  levels(){ return [lvl("v1", "A little jumbled", {weights:[2,4,1,3,5]}), lvl("v2", "Backwards", {weights:[5,4,3,2,1]}), lvl("v3", "Already sorted", {weights:[1,2,3,4,5,6]}), lvl("v4", "Ties", {weights:[3,1,3,2,1]})]; },
  hidden(){
    const rng = mkRng(91), big = Array.from({length:70}, () => ri(rng, 1, 300));
    return [lvl("h1", "One crate", {weights:[4]}), lvl("h2", "Empty belt", {weights:[]}), lvl("h3", "All equal", {weights:[2,2,2,2]}),
      lvl("h4", "Seventy random crates", {weights:big}), lvl("h5", "Sixty backwards", {weights:Array.from({length:60}, (_, i) => 60 - i)})];
  },
  ref(L){ const w = L.weights; let n = 0; for (let i = 0; i < w.length; i++) for (let j = i + 1; j < w.length; j++) if (w[i] > w[j]) n++; return n; },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a count.");
    if (ret !== want) return bad("Wrong count", "There " + (want === 1 ? "is 1 out-of-order pair" : "are " + want + " out-of-order pairs") + ", but you counted " + ret + "." + (ret > want ? " Equal weights don’t count." : ""));
    return ok("Pairs counted", want === 0 ? "The belt is already in order." : want + " pair" + (want === 1 ? " is" : "s are") + " out of order.");
  },
  budget(L){ return 2 * L.weights.length + 6; },
  tip(){ return []; },
  random(L){ const n = ri(Math.random, 5, 12); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 30)); }
};
