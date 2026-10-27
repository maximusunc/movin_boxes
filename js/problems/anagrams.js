import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: group the scrambled labels (hashing) ---------- */
const keyOf = s => [...s].sort().join("");
const canon = groups => groups.map(g => g.slice().sort()).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);
const scramble = (rng, s) => { const a = [...s]; for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.join(""); };
export const AnagramsProblem = {
  id: "anagrams", tier: 2, tab: "Scrambled labels", pattern: "Hashing", fname: "scrambled_labels.py", levelNoun: "batches",
  title: "Group the scrambled labels", sig: "labels", input: "array", view: "array",
  brief: `<p>A label printer jumbled the letters on some crates. Two labels belong to the same product if one is a rearrangement of the other, using exactly the same letters the same number of times. Every label is lowercase letters only, and it can be empty.</p>
<p>Write <code>solve(labels)</code> and return the labels grouped by product: a list of groups, where each group is a list of labels. The order of the groups, and of labels within a group, doesn’t matter. Keep duplicate labels.</p>`,
  show: `Every <code>labels[i]</code> read drops a dot under that label. Name your dict <code>groups</code> to watch each label land in its bucket.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["groups", "buckets", "seen", "d", "table", "key", "k", "i"], pointers: ["i"], panel: ["groups", "buckets", "seen", "d", "table", "key", "k"], arrArg: 0, arrLabel2: "labels",
  editor: "random",
  arrayOf: L => L.labels,
  levels(){ return [lvl("a1", "Morning batch", {labels:["eat","tea","tan","ate","nat","bat"]}), lvl("a2", "No matches", {labels:["box","tape","crate"]}), lvl("a3", "One product", {labels:["stop","pots","tops","spot","opts"]})]; },
  hidden(){
    const rng = mkRng(37), words = ["pallet","forklift","crate","bin","shelf","dock","truck","label"];
    const big = Array.from({length:40}, () => scramble(rng, words[ri(rng, 0, words.length - 1)]));
    return [lvl("h1", "No labels", {labels:[]}), lvl("h2", "Empty labels", {labels:["","","a",""]}), lvl("h3", "Exact duplicates", {labels:["abc","abc","cab","x"]}),
      lvl("h4", "Same letters, different counts", {labels:["aab","abb","bab","aba"]}), lvl("h5", "Forty scrambled labels", {labels:big})];
  },
  ref(L){ const m = new Map(); L.labels.forEach(s => { const k = keyOf(s); if (!m.has(k)) m.set(k, []); m.get(k).push(s); }); return [...m.values()]; },
  case(L){ return {args:[L.labels], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.some(g => !Array.isArray(g) || g.some(s => typeof s !== "string"))) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of groups, each a list of labels.");
    const total = ret.reduce((a, g) => a + g.length, 0);
    if (total !== L.labels.length) return bad("Labels missing or repeated", "There are " + L.labels.length + " labels, but your groups hold " + total + ". Every label, duplicates included, belongs in exactly one group.");
    if (JSON.stringify(canon(ret)) !== JSON.stringify(canon(want))){
      const mixed = ret.find(g => new Set(g.map(keyOf)).size > 1);
      if (mixed) return bad("Different products in one group", JSON.stringify(mixed[0]) + " and " + JSON.stringify(mixed.find(s => keyOf(s) !== keyOf(mixed[0]))) + " are in the same group, but they don’t use the same letters.");
      const split = want.find(g => !ret.some(r => r.length === g.length && JSON.stringify(r.slice().sort()) === JSON.stringify(g.slice().sort())));
      return bad("A product is split up", "These labels are all the same product and belong in one group: " + JSON.stringify(split) + ".");
    }
    return ok("Labels grouped", want.length === 1 ? "All the labels are one product." : "There are " + want.length + " products" + (want.length && want.length <= 4 ? ": " + want.map(g => "[" + g.join(", ") + "]").join(", ") : "") + ".");
  },
  budget(L){ return 2 * L.labels.length + 4; },
  showRet(ret){ return Array.isArray(ret) ? "[" + ret.map(g => Array.isArray(g) ? "[" + g.join(", ") + "]" : pyRepr(g)).join(", ") + "]" : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.groups || w.buckets || w.seen || w.d || w.table)) ? [] : ["groups"]; },
  random(L){ const words = ["eat","tan","bat","stop","dock","bin"], rng = Math.random; L.labels = Array.from({length: ri(rng, 5, 8)}, () => scramble(rng, words[ri(rng, 0, words.length - 1)])); }
};
