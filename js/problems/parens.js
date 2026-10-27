import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: every valid seal string (generate parentheses / backtracking) ---------- */
export const ParensProblem = {
  id: "parens", tier: 3, tab: "Seal patterns", pattern: "Backtracking", fname: "seal_patterns.py", levelNoun: "orders",
  title: "Print every valid seal pattern", sig: "n", input: "array", view: "array",
  brief: `<p>A pallet gets <code>n</code> layers of wrap. Each layer is recorded as <code>(</code> when it goes on and <code>)</code> when it comes off, and a layer can only come off once it’s the outermost one, so every label is a balanced string of <code>n</code> pairs.</p>
<p>Write <code>solve(n)</code> and return every different valid label for <code>n</code> layers, as a list of strings in any order.</p>`,
  show: `The input is a single number, so nothing gets read here. The boxes show the <code>n</code> pairs of seals available; the labels you return are listed underneath.`,
  legend: ``,
  watch: [], arrLabel2: "seals to place",
  editor: "random",
  arrayOf: L => Array.from({length: L.n}, () => "( )"), extraLabel: L => "n = " + L.n,
  levels(){ return [lvl("g1", "Three layers", {n:3}), lvl("g2", "One layer", {n:1}), lvl("g3", "Two layers", {n:2})]; },
  hidden(){ return [lvl("h1", "Four layers", {n:4}), lvl("h2", "Six layers", {n:6}), lvl("h3", "Seven layers", {n:7}), lvl("h4", "No layers", {n:0})]; },
  ref(L){ const out = []; const go = (s, open, close) => { if (s.length === 2 * L.n){ out.push(s); return; } if (open < L.n) go(s + "(", open + 1, close); if (close < open) go(s + ")", open, close + 1); }; go("", 0, 0); return out; },
  case(L){ return {args:[L.n], arr:[]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(s => typeof s !== "string")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of strings.");
    const valid = new Set(want), seen = new Set();
    for (const s of ret){
      if (!valid.has(s)) return bad("Not a valid label", JSON.stringify(s) + " isn’t a balanced string of " + L.n + " pairs.");
      if (seen.has(s)) return bad("Duplicate label", JSON.stringify(s) + " appears more than once.");
      seen.add(s);
    }
    if (seen.size !== want.length){ const m = want.find(s => !seen.has(s)); return bad("Missed some labels", "You found " + seen.size + " of " + want.length + ". For example, " + JSON.stringify(m) + " is missing" + (L.n ? "." : ": with no layers the only label is the empty string.")); }
    return ok("Every label found", "There are " + want.length + " valid labels for " + L.n + " layer" + (L.n === 1 ? "" : "s") + (want.length <= 5 ? ": " + want.join(", ") : "") + ".");
  },
  showRet(ret){ return Array.isArray(ret) ? ret.join("  ") : pyRepr(ret); },
  tip(){ return []; },
  random(L){ L.n = ri(Math.random, 1, 4); }
};
