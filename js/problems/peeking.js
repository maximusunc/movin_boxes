import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: peek at the next package (iterator design) ---------- */
function randomOps(rng, n, extra){
  const ops = []; let left = n;
  while (left > 0){
    const r = rng();
    if (r < .45){ ops.push(["next"]); left--; }
    else if (r < .75) ops.push(["peek"]);
    else ops.push(["has_next"]);
  }
  for (let i = 0; i <= extra; i++) ops.push(["has_next"]);
  return ops;
}
export const PeekingProblem = {
  id: "peeking", tier: 3, tab: "Peek ahead", pattern: "Iterator design", fname: "peek_ahead.py", levelNoun: "belts",
  title: "Peek at the next package", sig: "", design: "PeekingIterator", input: "array", view: "array",
  brief: `<p>The scanner hands packages off the belt one at a time, but the packer wants to look at the next one before taking it.</p>
<p>Write a class <code>PeekingIterator</code> whose constructor gets <code>items</code>, the list of package weights in belt order, with <code>next()</code> (returns the next package and moves past it), <code>peek()</code> (returns the next package without moving past it) and <code>has_next()</code> (returns <code>True</code> if any packages are left). <code>next</code> and <code>peek</code> are only called when a package is left. Each call should take constant time, reading each item about once.</p>`,
  show: `The boxes are <code>items</code>, and every read drops a dot under a package: ideally one dot each. Name your position <code>self.i</code> to see it as a pointer, and a cached next value <code>self.peeked</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  skeleton: `class PeekingIterator:
    def __init__(self, items):
        pass

    def peek(self):
        pass

    def next(self):
        pass

    def has_next(self):
        pass
`,
  watch: ["i", "idx", "pos", "index", "peeked", "nxt", "cache", "buffer"], pointers: ["i", "idx", "pos", "index"], panel: ["peeked", "nxt", "cache", "buffer"], arrArg: 0, arrLabel2: "items",
  editor: "random",
  arrayOf: L => L.items, extraLabel: L => L.ops.length + " calls",
  levels(){ return [
    lvl("p1", "Three packages", {items:[1,2,3], ops:[["next"],["peek"],["next"],["next"],["has_next"]]}),
    lvl("p2", "Peek twice", {items:[7,4,9,2], ops:[["peek"],["peek"],["next"],["has_next"],["next"],["peek"],["next"],["next"],["has_next"]]}),
    lvl("p3", "Empty belt", {items:[], ops:[["has_next"],["has_next"]]})
  ]; },
  hidden(){ const rng = mkRng(53), big = Array.from({length:60}, () => ri(rng, 1, 99));
    return [lvl("h1", "One package", {items:[5], ops:[["has_next"],["peek"],["next"],["has_next"]]}), lvl("h2", "Repeated weights", {items:[3,3,3], ops:[["peek"],["next"],["peek"],["next"],["peek"],["next"],["has_next"]]}),
      lvl("h3", "Sixty packages, mixed calls", {items:big, ops:randomOps(rng, 60, 2)}),
      lvl("h4", "Sixty packages, peek every time", {items:big.slice().reverse(), ops:[].concat(...big.map(() => [["has_next"], ["peek"], ["next"]]), [["has_next"]])})]; },
  ref(L){ let i = 0; return L.ops.map(([op]) => op === "next" ? L.items[i++] : op === "peek" ? L.items[i] : i < L.items.length); },
  case(L){ return {init: [L.items], arr: [0], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", " + L.ops[i][0] + "(), returned " + pyRepr(ret[i]) + " but should return " + pyRepr(want[i]) + ".");
    return ok("Every call answered", "All " + want.length + " calls are right.");
  },
  budget(L){ return 2 * L.items.length + 4; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.i != null || w.idx != null || w.pos != null || w.index != null)) ? [] : ["self.i"]; },
  random(L){ const n = ri(Math.random, 3, 8); L.items = Array.from({length: n}, () => ri(Math.random, 1, 40)); L.ops = randomOps(Math.random, n, 0); }
};
