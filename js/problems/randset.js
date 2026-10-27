import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: grab bag of bins (design: randomized set) ---------- */
function randomOps(rng, n, hi){
  const ops = [];
  for (let i = 0; i < n; i++){ const r = rng(); ops.push(r < .45 ? ["insert", ri(rng, 1, hi)] : r < .75 ? ["remove", ri(rng, 1, hi)] : ["get_random"]); }
  return ops;
}
// Drop get_random() calls that would hit an empty set.
function clean(ops){ const s = new Set(); return ops.filter(([op, x]) => { if (op === "get_random") return s.size > 0; if (op === "insert") s.add(x); else s.delete(x); return true; }); }
export const RandSetProblem = {
  id: "randset", tier: 4, tab: "Grab bag", pattern: "Design: hash map + array", fname: "grab_bag.py", levelNoun: "shifts",
  title: "Pick a random bin in constant time", sig: "", design: "RandomizedSet", input: "array", view: "array",
  brief: `<p>Spot checks pull a random bin from the bins currently in use, and bins come and go all day.</p>
<p>Write a class <code>RandomizedSet</code> with <code>insert(x)</code> (adds bin <code>x</code>; returns <code>True</code> if it wasn’t there yet, else <code>False</code>), <code>remove(x)</code> (returns <code>True</code> if it was there, else <code>False</code>) and <code>get_random()</code> (returns any bin in the set, each equally likely; only called when the set isn’t empty). Every call should take average <code>O(1)</code> time. Use <code>import random</code>.</p>`,
  show: `Each box is one call: <code>+5</code> is <code>insert(5)</code>, <code>−5</code> is <code>remove(5)</code> and <code>?</code> is <code>get_random()</code>. Name your list <code>self.items</code> and your index map <code>self.pos</code> to watch them.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `import random


class RandomizedSet:
    def __init__(self):
        pass

    def insert(self, x):
        pass

    def remove(self, x):
        pass

    def get_random(self):
        pass
`,
  watch: ["items", "vals", "arr", "nums", "pos", "index", "idx", "where"], panel: ["items", "vals", "arr", "nums", "pos", "index", "idx", "where"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "insert" ? "+" + o[1] : o[0] === "remove" ? "−" + o[1] : "?"),
  levels(){ return [
    lvl("r1", "Morning checks", {ops:[["insert",1],["remove",2],["insert",2],["get_random"],["remove",1],["insert",2],["get_random"]]}),
    lvl("r2", "Remove the last one", {ops:[["insert",4],["insert",7],["insert",9],["remove",9],["get_random"],["remove",4],["get_random"]]}),
    lvl("r3", "Remove from the middle", {ops:[["insert",3],["insert",5],["insert",8],["remove",5],["get_random"],["get_random"],["insert",5],["remove",3],["get_random"]]})
  ]; },
  hidden(){
    const many = [["insert",10],["insert",20],["insert",30],["remove",20]].concat(Array.from({length:30}, () => ["get_random"]));
    return [lvl("h1", "One bin", {ops:[["insert",5],["get_random"],["remove",5],["remove",5],["insert",5],["get_random"]]}),
      lvl("h2", "Thirty spot checks", {ops:many}), lvl("h3", "Eighty calls", {ops:clean(randomOps(mkRng(81), 80, 12))}),
      lvl("h4", "Duplicate inserts", {ops:[["insert",2],["insert",2],["remove",2],["remove",2],["insert",2],["get_random"]]})];
  },
  case(L){ return {init: [], ops: L.ops}; },
  check(L, ret){
    if (!Array.isArray(ret) || ret.length !== L.ops.length) return bad("Check your class", "Expected one result per call.");
    const s = new Set();
    for (let i = 0; i < L.ops.length; i++){
      const [op, x] = L.ops[i], r = ret[i];
      if (op === "insert"){ const want = !s.has(x); s.add(x); if (r !== want) return bad("Wrong answer", "Call " + i + ", insert(" + x + "), returned " + pyRepr(r) + " but should return " + pyRepr(want) + (want ? ": " + x + " wasn’t in the set." : ": " + x + " was already there.")); }
      else if (op === "remove"){ const want = s.has(x); s.delete(x); if (r !== want) return bad("Wrong answer", "Call " + i + ", remove(" + x + "), returned " + pyRepr(r) + " but should return " + pyRepr(want) + "."); }
      else if (!s.has(r)) return bad("Not in the set", "Call " + i + ", get_random(), returned " + pyRepr(r) + ", but the set holds " + pyRepr([...s].sort((a, b) => a - b)) + ".");
    }
    return ok("Every call answered", "Inserts and removes report correctly, and every random pick was in the set.");
  },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.items || w.vals || w.arr || w.nums)) ? [] : ["self.items"]; },
  random(L){ L.ops = clean(randomOps(Math.random, ri(Math.random, 7, 12), 6)); }
};
