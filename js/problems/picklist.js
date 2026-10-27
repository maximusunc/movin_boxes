import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: split the pick list (greedy partition) ---------- */
const randomPicks = (rng, n, letters) => Array.from({length:n}, () => letters[ri(rng, 0, letters.length - 1)]).join("");
export const PickListProblem = {
  id: "picklist", tier: 2, tab: "Split the pick list", pattern: "Greedy", fname: "split_pick_list.py", levelNoun: "lists",
  title: "Split the pick list between pickers", sig: "picks", input: "array", view: "array",
  brief: `<p>A pick list is a string of aisle letters, like <code>"ababcbacadefegdehijhklij"</code>. It gets cut into consecutive pieces, one per picker, and no aisle letter may appear in more than one piece, so two pickers never visit the same aisle.</p>
<p>Write <code>solve(picks)</code> and return the sizes of the pieces, in order, using as many pieces as possible.</p>`,
  show: `Every read of <code>picks[i]</code> drops a dot under it. Record where each letter appears last (<code>last</code>), then stretch the current piece’s <code>end</code> as you go: when <code>i</code> reaches <code>end</code>, the piece is done.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["last", "end", "start", "sizes", "res", "out", "ans", "i"], pointers: ["i", "end", "start"], panel: ["sizes", "res", "out", "ans", "last"], arrArg: 0, arrLabel2: "pick list",
  editor: "random",
  arrayOf: L => [...L.picks],
  levels(){ return [lvl("p1", "Three pickers", {picks:"ababcbaca"}), lvl("p2", "Every letter once", {picks:"abcdef"}), lvl("p3", "All one piece", {picks:"abcabca"}), lvl("p4", "Mixed", {picks:"eccbbbbdec"})]; },
  hidden(){ return [lvl("h1", "One letter", {picks:"z"}), lvl("h2", "Same letter over and over", {picks:"aaaaa"}), lvl("h3", "The classic", {picks:"ababcbacadefegdehijhklij"}),
    lvl("h4", "Sixty picks", {picks:randomPicks(mkRng(13), 60, "abcdefghijklmnop")}), lvl("h5", "Pairs", {picks:"aabbccddeeff"})]; },
  ref(L){ const s = [...L.picks], last = {}; s.forEach((c, i) => { last[c] = i; }); const out = []; let start = 0, end = 0; s.forEach((c, i) => { end = Math.max(end, last[c]); if (i === end){ out.push(i - start + 1); start = i + 1; } }); return out; },
  case(L){ return {args:[L.picks], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(x => !Number.isInteger(x))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of piece sizes.");
    if (ret.length !== want.length || ret.some((x, i) => x !== want[i])) return bad("Wrong split", "The pieces should be " + pyRepr(want) + ", but you returned " + pyRepr(ret) + "." + (ret.reduce((a, b) => a + b, 0) !== L.picks.length ? " The sizes should add up to " + L.picks.length + "." : ""));
    return ok("List split", want.length + " picker" + (want.length === 1 ? "" : "s") + ": " + pyRepr(want) + ".");
  },
  budget(L){ return 3 * L.picks.length + 4; },
  showRet(ret){ return pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && w.last) ? [] : ["last"]; },
  random(L){ L.picks = randomPicks(Math.random, ri(Math.random, 8, 14), "abcdefg".slice(0, ri(Math.random, 3, 7))); }
};
