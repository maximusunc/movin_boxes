import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: next heavier crate (monotonic stack) ---------- */
export const NextProblem = {
  id: "next", tier: 2, tab: "Next heavier", pattern: "Monotonic stack", fname: "next_heavier.py", levelNoun: "stacks",
  title: "How far to a heavier crate?", sig: "weights", input: "array", view: "array",
  brief: `<p>Crates sit in a row. For each crate, the sorter wants to know how many positions to the right it has to look to find a strictly heavier crate.</p>
<p>Write <code>solve(weights)</code> and return a list <code>ans</code> where <code>ans[i]</code> is that distance, or <code>0</code> if no heavier crate comes after crate <code>i</code>.</p>`,
  show: `Name your stack <code>stack</code>. If it holds indices, those crates get a blue outline so you can watch it stay sorted. Your answer list shows as <code>ans</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw queue"></i>On the stack</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(weights):
    n = len(weights)
    ans = [0] * n
    stack = []  # indices still waiting for a heavier crate

    # Walk left to right. While the current crate is heavier
    # than the crate on top of the stack, pop it and record
    # the distance. Then push the current index.

    return ans
`,
  watch: ["stack", "st", "ans", "res", "result", "answer", "i", "j", "top"], pointers: ["i", "j"], panel: ["stack", "st", "ans", "res", "result", "answer"], markLists: ["stack", "st"], arrArg: 0, arrLabel2: "crate weights",
  editor: "array", arr: "weights", arrLabel: "Crate weights", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.weights,
  levels(){ return [lvl("n1", "Loading dock", {weights:[73,74,75,71,69,72,76,73]}), lvl("n2", "Going down", {weights:[9,7,5,3]}), lvl("n3", "Going up", {weights:[2,4,6,8,10]}), lvl("n4", "Plateaus", {weights:[5,5,6,5,5,7]})]; },
  hidden(){
    const rng = mkRng(3), big = Array.from({length:70}, () => ri(rng, 1, 99));
    const desc = Array.from({length:60}, (_, i) => 100 - i);
    return [lvl("h1", "Single crate", {weights:[4]}), lvl("h2", "All the same weight", {weights:[3,3,3,3]}), lvl("h3", "Long descending row", {weights:desc}), lvl("h4", "Long random row", {weights:big})];
  },
  ref(L){ const w = L.weights, ans = Array(w.length).fill(0), st = []; w.forEach((x, i) => { while (st.length && w[st[st.length-1]] < x){ const j = st.pop(); ans[j] = i - j; } st.push(i); }); return ans; },
  case(L){ return {args:[L.weights], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one distance per crate.");
    if (ret.length !== want.length) return bad("Wrong length", "Your list has " + ret.length + " entries, but there are " + want.length + " crates.");
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]) return bad("Wrong distance", "For crate " + i + " (weight " + L.weights[i] + ") you have " + pyRepr(ret[i]) + ", but the answer is " + want[i] + (want[i] ? ": crate " + (i + want[i]) + " is the first heavier one." : ": no heavier crate comes after it."));
    return ok("Every distance is right", want.length <= 12 ? "The answer is " + pyRepr(want) + "." : "All " + want.length + " distances match.");
  },
  budget(L){ return 4 * L.weights.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["stack"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 30)); }
};
