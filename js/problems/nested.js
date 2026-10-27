import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: unpack the nested crates (design: iterator with a stack) ---------- */
const flat = x => Array.isArray(x) ? x.flatMap(flat) : [x];
const opsFor = nested => { const n = flat(nested).length, ops = []; for (let i = 0; i < n; i++) ops.push(["has_next"], ["next"]); ops.push(["has_next"]); return ops; };
const text = x => Array.isArray(x) ? "[" + x.map(text).join(", ") + "]" : String(x);
const mk = nested => ({nested, ops: opsFor(nested)});
export const NestedProblem = {
  id: "nested", tier: 4, tab: "Nested crates", pattern: "Design: iterator", fname: "nested_crates.py", levelNoun: "shipments",
  title: "Unpack crates inside crates", sig: "", design: "NestedIterator", input: "array", view: "array",
  brief: `<p>A shipment is a list whose items are either package numbers (ints) or crates, and a crate is itself a list of package numbers and smaller crates. Crates can be empty.</p>
<p>Write a class <code>NestedIterator(nested)</code> with <code>next()</code>, which returns the next package number in reading order, and <code>has_next()</code>, which says whether any are left. Don’t flatten everything up front: unpack lazily, so each call only does the work it needs.</p>`,
  show: `Each box is one call: <code>has?</code> is <code>has_next()</code> and <code>next</code> is <code>next()</code>. Name your stack <code>self.stack</code> to watch the crates being opened.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class NestedIterator:
    def __init__(self, nested):
        pass

    def next(self):
        pass

    def has_next(self):
        pass
`,
  watch: ["stack", "st", "queue", "items", "flat"], panel: ["stack", "st", "queue", "items", "flat"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "next" ? "next" : "has?"), extraLabel: L => { const t = text(L.nested); return t.length > 40 ? t.slice(0, 38) + "…" : t; },
  levels(){ return [lvl("n1", "Two small crates", mk([[1,1],2,[1,1]])), lvl("n2", "Crates in crates", mk([1,[4,[6]]])), lvl("n3", "Empty crates", mk([[],[3,[]],[[]],5]))]; },
  hidden(){
    let deep = [30]; for (let v = 29; v > 0; v--) deep = [v, deep];
    return [lvl("h1", "Nothing at all", mk([])), lvl("h2", "Only empty crates", mk([[],[[]],[[],[]]])), lvl("h3", "Thirty levels deep", mk(deep)),
      lvl("h4", "Flat shipment", mk([7,8,9,10,11,12])), lvl("h5", "Asking twice", {nested:[[1],[2]], ops:[["has_next"],["has_next"],["next"],["has_next"],["has_next"],["next"],["has_next"],["has_next"]]})];
  },
  ref(L){ const xs = flat(L.nested); let k = 0; return L.ops.map(([op]) => op === "next" ? xs[k++] : k < xs.length); },
  case(L){ return {init: [L.nested], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++) if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", " + L.ops[i][0] + "(), returned " + pyRepr(ret[i]) + " but should return " + pyRepr(want[i]) + ".");
    const xs = flat(L.nested);
    return ok("Shipment unpacked", xs.length ? "The packages come out as " + (xs.length <= 12 ? pyRepr(xs) : "all " + xs.length + " numbers, in order") + "." : "There’s nothing to unpack.");
  },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["self.stack"]; },
  random(L){
    const gen = d => Array.from({length: ri(Math.random, 0, 3)}, () => d < 2 && Math.random() < .4 ? gen(d + 1) : ri(Math.random, 1, 9));
    Object.assign(L, mk(gen(0)));
  }
};
