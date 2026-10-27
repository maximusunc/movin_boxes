import { GRID_BASE } from "./grid-base.js";
import { findPath } from "./wordsearch.js";
import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: find every code on the letter floor (trie + backtracking) ---------- */
const floor = (rows, codes) => ({grid: rows.map(r => [...r]), start:[-1,-1], target:[-1,-1], codes});
function randomFloor(rng, R, C, n, len){
  const A = "AEIRSTNOL", rows = Array.from({length:R}, () => Array.from({length:C}, () => A[ri(rng, 0, A.length - 1)]).join(""));
  const codes = new Set();
  while (codes.size < n){ let s = ""; for (let k = 0; k < len; k++) s += A[ri(rng, 0, A.length - 1)]; codes.add(s); }
  return floor(rows, [...codes]);
}
export const WordGridProblem = Object.assign({}, GRID_BASE, {
  id: "wordgrid", tier: 5, tab: "All codes", pattern: "Trie + backtracking", fname: "all_codes.py",
  title: "Find every code on the floor", sig: "grid, codes", robot: false, path: false, editor: "none",
  isShelf: () => false, cellText: v => v,
  watch: [],
  brief: `<p>Every floor tile has a capital letter painted on it. A code is on the floor if you can trace it tile by tile, moving up, down, left or right, without using a tile twice within that code.</p>
<p>Write <code>solve(grid, codes)</code> and return every code from <code>codes</code> that’s on the floor, each once, in any order. There can be many codes, so searching for them one at a time is too slow: share the work between codes with a common prefix.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that tile. A trie lets one walk across the floor check every code with the same prefix at once, so each tile gets read far fewer times.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span><span><i class="sw visited"></i>On the trail</span>`,
  levels(){ return [
    lvl("g1", "Four codes", floor(["OATH","ETAE","IHKR","IFLV"], ["OATH","PEA","EAT","RAIN"])),
    lvl("g2", "Shared prefixes", floor(["CART","OABS","DOCK"], ["CAR","CART","CARD","CAB","DOC","DOCK","COD"])),
    lvl("g3", "Nothing found", floor(["AB","CD"], ["ABDCE","XYZ"]))
  ]; },
  hidden(){ return [
    lvl("h1", "One tile, one code", floor(["A"], ["A"])), lvl("h2", "Same tile twice", floor(["AA"], ["AAA", "AA"])),
    lvl("h3", "Duplicate codes in the list", floor(["TOTE","BINS"], ["TOTE","TOTE","BIN"])),
    lvl("h4", "Forty codes on a 6 × 6 floor", randomFloor(mkRng(56), 6, 6, 40, 4)),
    lvl("h5", "Sixty codes on a 5 × 7 floor", randomFloor(mkRng(57), 5, 7, 60, 3))
  ]; },
  case(L){ return {grid: L.grid, args: [L.codes]}; },
  ref(L){ return [...new Set(L.codes)].filter(w => findPath(L.grid, w)); },
  check(L, ret){
    const want = this.ref(L), valid = new Set(want);
    if (!Array.isArray(ret) || ret.some(s => typeof s !== "string")) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a list of codes.");
    const seen = new Set();
    for (const s of ret){
      if (!valid.has(s)) return bad("Not on the floor", L.codes.includes(s) ? s + " can’t be traced without reusing a tile." : s + " isn’t in the list of codes.");
      if (seen.has(s)) return bad("Listed twice", s + " appears more than once. List each code once.");
      seen.add(s);
    }
    const missing = want.filter(s => !seen.has(s));
    if (missing.length) return bad("Missed some codes", "You found " + seen.size + " of " + want.length + ". For example, " + missing[0] + " is on the floor, starting at " + pyRepr(findPath(L.grid, missing[0])[0]) + ".");
    return ok("Every code found", want.length ? want.length + " code" + (want.length === 1 ? " is" : "s are") + " on the floor" + (want.length <= 6 ? ": " + want.join(", ") : "") + "." : "None of these codes are on the floor.");
  },
  budget(L){ const R = L.grid.length, C = L.grid[0].length, total = L.codes.reduce((a, s) => a + s.length, 0); return 4 * R * C + 5 * total + 10; },
  showRet(ret){ return Array.isArray(ret) ? ret.join(", ") || "[]" : pyRepr(ret); },
  tip(){ return []; }
});
