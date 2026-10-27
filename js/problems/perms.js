import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: every loading order (permutations / backtracking) ---------- */
export const PermsProblem = {
  id: "perms", tier: 2, tab: "Loading orders", pattern: "Backtracking", fname: "loading_orders.py", levelNoun: "docks",
  title: "List every loading order", sig: "crates", input: "array", view: "array",
  brief: `<p>The crates on the dock can go onto the truck in any order. <code>crates</code> lists their numbers, and every number is different.</p>
<p>Write <code>solve(crates)</code> and return every possible loading order, as a list of lists. The orders can come in any order.</p>`,
  show: `Every <code>crates[i]</code> read drops a dot under that crate. Name the order you’re building <code>path</code> and your answer <code>res</code> to watch it grow, back out and branch.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["path", "perm", "cur", "current", "used", "res", "result", "out", "ans", "i"], pointers: ["i"],
  panel: ["path", "perm", "cur", "current", "used", "res", "result", "out", "ans"], arrArg: 0, arrLabel2: "crates",
  editor: "random",
  arrayOf: L => L.crates,
  levels(){ return [lvl("p1", "Three crates", {crates:[1,2,3]}), lvl("p2", "Two crates", {crates:[7,4]}), lvl("p3", "Four crates", {crates:[5,1,8,3]})]; },
  hidden(){ return [lvl("h1", "One crate", {crates:[9]}), lvl("h2", "No crates", {crates:[]}), lvl("h3", "Five crates, unsorted", {crates:[6,2,9,4,1]}), lvl("h4", "Five crates", {crates:[10,20,30,40,50]})]; },
  ref(L){ const out = [], a = L.crates; const go = (path, left) => { if (!left.length){ out.push(path); return; } left.forEach((x, i) => go(path.concat([x]), left.slice(0, i).concat(left.slice(i + 1)))); }; go([], a); return out; },
  case(L){ return {args:[L.crates], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L), n = L.crates.length;
    if (!Array.isArray(ret) || ret.some(c => !Array.isArray(c) || c.some(x => typeof x !== "number"))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of orders, each a list of crate numbers.");
    const all = new Set(L.crates), seen = new Set();
    for (const c of ret){
      if (c.length !== n || new Set(c).size !== n || c.some(x => !all.has(x))) return bad("Not a full order", pyRepr(c) + " should use every crate exactly once.");
      const k = c.join(",");
      if (seen.has(k)) return bad("Duplicate order", pyRepr(c) + " appears more than once.");
      seen.add(k);
    }
    const missing = want.filter(c => !seen.has(c.join(",")));
    if (missing.length) return bad("Missed some orders", "You found " + ret.length + " of " + want.length + ". For example, " + pyRepr(missing[0]) + " is missing" + (n ? "." : ": with no crates there’s one order, the empty one."));
    return ok("Every order found", "There are " + want.length + " loading orders (" + n + " factorial).");
  },
  budget(L){ let f = 1; for (let i = 2; i <= L.crates.length; i++) f *= i; return 3 * (L.crates.length + 1) * f * Math.max(1, L.crates.length) + 8; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.path || w.perm || w.cur || w.current)) ? [] : ["path"]; },
  random(L){ const n = ri(Math.random, 2, 4), w = []; while (w.length < n){ const x = ri(Math.random, 1, 20); if (!w.includes(x)) w.push(x); } L.crates = w; }
};
