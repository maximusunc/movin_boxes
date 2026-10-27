import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: busy shelf (design: LFU cache) ---------- */
function randomOps(rng, n, keys){
  const ops = [];
  for (let i = 0; i < n; i++) ops.push(rng() < .5 ? ["get", ri(rng, 1, keys)] : ["put", ri(rng, 1, keys), ri(rng, 1, 99)]);
  return ops;
}
export const LfuProblem = {
  id: "lfu", tier: 5, tab: "Busy shelf", pattern: "Design: LFU cache", fname: "busy_shelf.py", levelNoun: "shifts",
  title: "Keep the most-used items close", sig: "", design: "LFUCache", input: "array", view: "array",
  brief: `<p>The pick station’s fast shelf holds <code>capacity</code> items. When it’s full and a new item arrives, the item that’s been used the fewest times leaves. If several are tied, the one used least recently leaves first.</p>
<p>Write a class <code>LFUCache(capacity)</code> with <code>get(key)</code>, which returns the item’s value (or <code>-1</code> if it isn’t on the shelf), and <code>put(key, value)</code>, which adds or updates it. Both count as a use. With <code>capacity</code> 0, nothing is ever stored. Aim for <code>O(1)</code> per call.</p>`,
  show: `Each box is one call: <code>?3</code> is <code>get(3)</code> and <code>3=7</code> is <code>put(3, 7)</code>. Name your maps <code>self.vals</code> and <code>self.freq</code> to watch them.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class LFUCache:
    def __init__(self, capacity):
        pass

    def get(self, key):
        pass

    def put(self, key, value):
        pass
`,
  watch: ["vals", "values", "cache", "freq", "count", "counts", "min_freq", "minf"], panel: ["vals", "values", "cache", "freq", "count", "counts", "min_freq", "minf"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "get" ? "?" + o[1] : o[1] + "=" + o[2]), extraLabel: L => "capacity " + L.capacity,
  levels(){ return [
    lvl("f1", "Classic", {capacity:2, ops:[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["get",3],["put",4,4],["get",1],["get",3],["get",4]]}),
    lvl("f2", "Tie goes to the oldest", {capacity:2, ops:[["put",1,10],["put",2,20],["put",3,30],["get",1],["get",2],["get",3]]}),
    lvl("f3", "An update counts as a use", {capacity:2, ops:[["put",1,1],["put",2,2],["put",1,5],["put",3,3],["get",1],["get",2],["get",3]]})
  ]; },
  hidden(){ return [lvl("h1", "No room at all", {capacity:0, ops:[["put",1,1],["get",1]]}), lvl("h2", "Room for one", {capacity:1, ops:[["put",1,1],["get",1],["put",2,2],["get",1],["get",2]]}),
    lvl("h3", "Eighty calls", {capacity:3, ops:randomOps(mkRng(101), 80, 6)}), lvl("h4", "Bigger shelf", {capacity:5, ops:randomOps(mkRng(103), 120, 9)})]; },
  ref(L){
    const m = new Map(); let clock = 0;   // key -> {v, f, t}
    const use = e => { e.f++; e.t = ++clock; };
    return L.ops.map(([op, k, v]) => {
      if (op === "get"){ const e = m.get(k); if (!e) return -1; use(e); return e.v; }
      if (L.capacity === 0) return null;
      const e = m.get(k); if (e){ e.v = v; use(e); return null; }
      if (m.size >= L.capacity){ let worst = null; for (const [key, x] of m) if (!worst || x.f < worst[1].f || (x.f === worst[1].f && x.t < worst[1].t)) worst = [key, x]; m.delete(worst[0]); }
      m.set(k, {v, f: 1, t: ++clock}); return null;
    });
  },
  case(L){ return {init: [L.capacity], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", get(" + L.ops[i][1] + "), returned " + pyRepr(ret[i]) + " but should return " + want[i] + (want[i] === -1 ? ": that item was evicted or never stored." : "."));
    }
    return ok("Shelf managed", "All " + want.filter(x => x !== null).length + " get() calls are right.");
  },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.freq || w.count || w.counts)) ? [] : ["self.freq"]; },
  random(L){ L.capacity = ri(Math.random, 1, 3); L.ops = randomOps(Math.random, ri(Math.random, 7, 12), 4); }
};
