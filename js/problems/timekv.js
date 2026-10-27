import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: shelf history (design: time-based key-value store) ---------- */
const show = v => typeof v === "string" ? JSON.stringify(v) : pyRepr(v);
const COLORS = ["red", "blue", "green", "gold", "gray", "teal", "pink"];
function randomOps(rng, n, keys){
  const ops = []; let t = 0;
  for (let i = 0; i < n; i++){
    const key = "abcdef"[ri(rng, 0, keys - 1)];
    if (rng() < .5){ t += ri(rng, 1, 4); ops.push(["set", key, COLORS[ri(rng, 0, COLORS.length - 1)], t]); }
    else ops.push(["get", key, ri(rng, 0, t + 3)]);
  }
  return ops;
}
export const TimeKvProblem = {
  id: "timekv", tier: 4, tab: "Shelf history", pattern: "Design + binary search", fname: "shelf_history.py", levelNoun: "logs",
  title: "What was on the shelf at time t?", sig: "", design: "TimeMap", input: "array", view: "array",
  brief: `<p>Each shelf label (a short string like <code>"a"</code>) gets a new bin color now and then, and auditors ask what color a shelf had at some moment in the past.</p>
<p>Write a class <code>TimeMap</code> with <code>set(key, value, t)</code>, which records that <code>key</code> holds <code>value</code> from time <code>t</code> on, and <code>get(key, t)</code>, which returns the value from the latest <code>set</code> for that key at a time <code>≤ t</code>, or <code>""</code> if there isn’t one. Times passed to <code>set</code> only go up. Aim for <code>O(log n)</code> per <code>get</code>.</p>`,
  show: `Each box is one call, in order: <code>a=red@3</code> is <code>set("a", "red", 3)</code> and <code>a@5?</code> is <code>get("a", 5)</code>. The highlighted box is the call that just ran. Name your store <code>self.store</code> to watch it.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class TimeMap:
    def __init__(self):
        pass

    def set(self, key, value, t):
        pass

    def get(self, key, t):
        pass
`,
  watch: ["store", "data", "history", "times", "values"], panel: ["store", "data", "history", "times", "values"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "set" ? o[1] + "=" + o[2] + "@" + o[3] : o[1] + "@" + o[2] + "?"),
  levels(){ return [
    lvl("t1", "Morning audit", {ops:[["set","a","red",1],["get","a",1],["get","a",3],["set","a","blue",4],["get","a",4],["get","a",5],["get","a",2]]}),
    lvl("t2", "Two shelves", {ops:[["set","a","red",2],["set","b","gold",3],["get","b",2],["get","a",9],["set","b","teal",6],["get","b",6],["get","c",6]]}),
    lvl("t3", "Before the first set", {ops:[["set","a","gray",5],["get","a",4],["get","a",5],["set","a","pink",8],["get","a",7]]})
  ]; },
  hidden(){ return [lvl("h1", "Unknown shelf", {ops:[["get","z",3]]}), lvl("h2", "Exact times", {ops:[["set","a","red",1],["set","a","blue",2],["set","a","gold",3],["get","a",1],["get","a",2],["get","a",3]]}),
    lvl("h3", "Sixty calls, three shelves", {ops:randomOps(mkRng(71), 60, 3)}), lvl("h4", "Long history", {ops:randomOps(mkRng(73), 120, 1)})]; },
  ref(L){ const m = {}; return L.ops.map(([op, k, a, b]) => { if (op === "set"){ (m[k] = m[k] || []).push([b, a]); return null; } let v = ""; for (const [t, x] of (m[k] || [])) if (t <= a) v = x; return v; }); },
  case(L){ return {init: [], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", get(" + show(L.ops[i][1]) + ", " + L.ops[i][2] + "), returned " + show(ret[i]) + " but should return " + show(want[i]) + ".");
    }
    return ok("History checks out", "All " + want.filter(x => x !== null).length + " get() calls are right.");
  },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null).map(x => x === "" ? '""' : x)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.store || w.data || w.history)) ? [] : ["self.store"]; },
  random(L){ L.ops = randomOps(Math.random, ri(Math.random, 6, 10), 2); }
};
