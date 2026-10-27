import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: hot shelf cache (design: LRU cache) ---------- */
function randomOps(rng, n, keys){
  const ops = [];
  for (let i = 0; i < n; i++) ops.push(rng() < .5 ? ["get", ri(rng, 1, keys)] : ["put", ri(rng, 1, keys), ri(rng, 1, 99)]);
  return ops;
}
export const LruProblem = {
  id: "lru", tier: 4, tab: "Hot shelf cache", pattern: "Design", fname: "hot_shelf.py", levelNoun: "shifts",
  title: "Run the hot shelf", sig: "capacity, ops", input: "array", view: "array",
  brief: `<p>The pick station keeps a small hot shelf with room for <code>capacity</code> items. <code>ops</code> is a list of requests: <code>("get", key)</code> asks for an item’s count, and <code>("put", key, value)</code> stores or updates it. Both make that item the most recently used. When a put needs room on a full shelf, the least recently used item comes off first.</p>
<p>Write <code>solve(capacity, ops)</code> and return a list with the answer to every <code>get</code>, in order: the stored value, or <code>-1</code> if the item isn’t on the shelf. Aim for constant time per request.</p>`,
  show: `Each box is one request: <code>?3</code> is <code>("get", 3)</code> and <code>3=7</code> is <code>("put", 3, 7)</code>. Every read of <code>ops[i]</code> drops a dot under it. Name your cache <code>cache</code> (an <code>OrderedDict</code> or a dict) and your answers <code>res</code> to watch them change.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["cache", "shelf", "od", "lru", "order", "res", "result", "out", "ans", "i", "key"], pointers: ["i"],
  panel: ["cache", "shelf", "od", "lru", "order", "res", "result", "out", "ans"], arrArg: 1, arrLabel2: "requests",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "get" ? "?" + o[1] : o[1] + "=" + o[2]), extraLabel: L => "capacity " + L.capacity,
  levels(){ return [
    lvl("c1", "Classic", {capacity:2, ops:[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["put",4,4],["get",1],["get",3],["get",4]]}),
    lvl("c2", "Update keeps it", {capacity:2, ops:[["put",1,5],["put",2,6],["put",1,7],["put",3,8],["get",1],["get",2],["get",3]]}),
    lvl("c3", "Gets refresh too", {capacity:3, ops:[["put",1,10],["put",2,20],["put",3,30],["get",1],["put",4,40],["get",2],["get",1],["get",3],["get",4]]})
  ]; },
  hidden(){
    return [lvl("h1", "Room for one", {capacity:1, ops:[["put",1,1],["put",2,2],["get",1],["get",2],["put",2,3],["get",2]]}),
      lvl("h2", "Get before any put", {capacity:2, ops:[["get",5],["put",5,1],["get",5]]}),
      lvl("h3", "Updating an item refreshes it", {capacity:2, ops:[["put",1,1],["put",2,2],["put",1,10],["put",3,3],["get",1],["get",2],["get",3]]}),
      lvl("h4", "Sixty requests, capacity 3", {capacity:3, ops:randomOps(mkRng(61), 60, 6)}),
      lvl("h5", "Eighty requests, capacity 5", {capacity:5, ops:randomOps(mkRng(81), 80, 9)})];
  },
  ref(L){
    const m = new Map(), out = [];
    for (const [op, k, v] of L.ops){
      if (op === "get"){ if (m.has(k)){ const x = m.get(k); m.delete(k); m.set(k, x); out.push(x); } else out.push(-1); }
      else { m.delete(k); m.set(k, v); if (m.size > L.capacity) m.delete(m.keys().next().value); }
    }
    return out;
  },
  case(L){ return {args:[L.capacity, L.ops], arr:[1]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "number")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list with one number per get request.");
    if (ret.length !== want.length) return bad("Wrong number of answers", "There are " + want.length + " get requests, but you returned " + ret.length + " answers.");
    const gets = L.ops.map((o, i) => o[0] === "get" ? i : -1).filter(i => i >= 0);
    for (let k = 0; k < want.length; k++) if (ret[k] !== want[k]){
      const [, key] = L.ops[gets[k]];
      return bad("Wrong answer", "Get number " + (k + 1) + " (request " + gets[k] + ", item " + key + ") should give " + want[k] + (want[k] === -1 ? ", because item " + key + " was already taken off the shelf or never put on it" : "") + ", but you returned " + ret[k] + ".");
    }
    return ok("Shelf runs smoothly", want.length <= 10 ? "The gets return " + pyRepr(want) + "." : "All " + want.length + " gets match.");
  },
  budget(L){ return 3 * L.ops.length + 6; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.cache || w.shelf || w.od || w.lru)) ? [] : ["cache"]; },
  random(L){ L.capacity = ri(Math.random, 2, 3); L.ops = randomOps(Math.random, ri(Math.random, 9, 12), 4); }
};
