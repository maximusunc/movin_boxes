import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: the unpaired crate (bit manipulation) ---------- */
function pairedUp(rng, pairs, odd, max){
  const ids = [], used = new Set([odd]);
  while (ids.length < 2 * pairs){ const v = ri(rng, 1, max); if (used.has(v)) continue; used.add(v); ids.push(v, v); }
  ids.push(odd);
  for (let i = ids.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  return ids;
}
export const SingleProblem = {
  id: "single", tier: 1, tab: "Unpaired crate", pattern: "Bit manipulation", fname: "unpaired_crate.py", levelNoun: "deliveries",
  title: "Find the unpaired crate", sig: "ids", input: "array", view: "array",
  brief: `<p>Crates always ship in pairs with the same id number, but one crate in this delivery lost its partner. <code>ids</code> lists every crate’s id in the order it was unloaded.</p>
<p>Write <code>solve(ids)</code> and return the id that appears only once. Every other id appears exactly twice. Try to do it in one pass without a dict or set.</p>`,
  show: `Every <code>ids[i]</code> read drops a dot under that crate. Name your running value <code>ans</code> to watch the pairs cancel out.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned crate</span>`,
  starter: `def solve(ids):
    ans = 0

    # XOR (^) has two handy properties:
    #   a ^ a == 0   and   a ^ 0 == a
    # and the order doesn't matter. So if you XOR every id
    # together, each pair cancels and only the loner is left.

    return ans
`,
  watch: ["ans", "res", "result", "x", "acc", "seen", "i"], pointers: ["i"], panel: ["ans", "res", "result", "x", "acc", "seen"], arrArg: 0, arrLabel2: "crate ids",
  editor: "random",
  arrayOf: L => L.ids,
  levels(){ return [lvl("u1", "Small delivery", {ids:[4,1,2,1,2]}), lvl("u2", "Loner first", {ids:[7,3,5,3,5]}), lvl("u3", "Bigger numbers", {ids:[17,42,9,17,9,31,42]})]; },
  hidden(){
    return [lvl("h1", "A single crate", {ids:[5]}), lvl("h2", "Loner at the end", {ids:[2,2,3,3,8]}), lvl("h3", "Id zero", {ids:[6,0,6]}),
      lvl("h4", "Sixty-one crates", {ids:pairedUp(mkRng(23), 30, 512, 999)})];
  },
  ref(L){ return L.ids.reduce((a, b) => a ^ b, 0); },
  case(L){ return {args:[L.ids], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the unpaired id.");
    if (ret !== want) return bad("Wrong crate", "The unpaired crate is " + want + ", but you returned " + ret + (L.ids.includes(ret) ? ", which has a partner." : "."));
    return ok("Loner found", "Crate " + want + " is the only one without a partner.");
  },
  highlight(ret, L){ const i = L.ids.indexOf(ret); return i >= 0 ? new Set([i]) : null; },
  budget(L){ return 2 * L.ids.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.ans != null || w.res != null || w.result != null || w.x != null)) ? [] : ["ans"]; },
  random(L){ L.ids = pairedUp(Math.random, ri(Math.random, 2, 5), ri(Math.random, 1, 99), 99); }
};
