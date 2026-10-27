import { GRID_BASE } from "./grid-base.js";
import { S } from "../state.js";
import { DIRS, bad, lvl, ok, pyRepr } from "../util.js";

/* ---------- L3: is the code on the letter floor? (grid backtracking) ---------- */
const floor = (rows, word) => ({grid: rows.map(r => [...r]), start:[-1,-1], target:[-1,-1], word});
export function findPath(G, word){
  // Depth-first search for one path spelling `word`; returns the cells or null.
  const R = G.length, C = G[0].length, used = new Set();
  const go = (r, c, i) => {
    if (r < 0 || c < 0 || r >= R || c >= C || used.has(r*C+c) || G[r][c] !== word[i]) return null;
    if (i === word.length - 1) return [[r, c]];
    used.add(r*C+c);
    for (const [dr, dc] of DIRS){ const p = go(r + dr, c + dc, i + 1); if (p) return [[r, c]].concat(p); }
    used.delete(r*C+c); return null;
  };
  if (!word.length) return [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){ const p = go(r, c, 0); if (p) return p; }
  return null;
}
export const WordSearchProblem = Object.assign({}, GRID_BASE, {
  id: "wordsearch", tier: 3, tab: "Letter floor", pattern: "Backtracking", fname: "letter_floor.py",
  title: "Is the code spelled on the floor?", sig: "grid, word", robot: false, path: false, editor: "none",
  isShelf: () => false, cellText: v => v,
  watch: ["path", "i", "k"],
  brief: `<p>Every floor tile has a capital letter painted on it. A code is spelled on the floor if you can trace it tile by tile, moving up, down, left or right, without using any tile twice.</p>
<p>Write <code>solve(grid, word)</code>, where <code>grid[r][c]</code> is a one-letter string, and return <code>True</code> if <code>word</code> can be traced on the floor, otherwise <code>False</code>.</p>`,
  show: `Every <code>grid[r][c]</code> read lights up that tile. Name the tiles on your current trail <code>visited</code> (a set of <code>(r, c)</code>) to watch the search extend the trail and back out of dead ends.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw checked"></i>Read</span><span><i class="sw visited"></i>On the trail</span>`,
  levels(){ return [
    lvl("w1", "Pick station", floor(["PACK","LIKE","SHIP","TOTE"], "HIKE")),
    lvl("w2", "Can’t reuse a tile", floor(["ABC","SFC","ADE"], "ABCB")),
    lvl("w3", "Winding code", floor(["SEEK","ATRO","LTOP","EBOX"], "PORTAL")),
    lvl("w4", "Not on this floor", floor(["DOCK","RAMP","BINS"], "DRUM"))
  ]; },
  hidden(){ return [
    lvl("h1", "One tile", floor(["Q"], "Q")), lvl("h2", "Word longer than the floor", floor(["AB","CD"], "ABDCA")),
    lvl("h3", "Snakes through every tile", floor(["ABCD","HGFE","IJKL"], "ABCDEFGHIJKL")),
    lvl("h4", "Many false starts", floor(["AAAB","AAAA","AABA","AAAA"], "AAAB")),
    lvl("h5", "8 × 8 floor", floor(["FORKLIFT","PALLETSX","CRATEBOX","SHELVING","DOCKRAMP","TRUCKBAY","LOADZONE","SORTGATE"], "GATESORT")),
    lvl("h6", "8 × 8 floor, another code", floor(["FORKLIFT","PALLETSX","CRATEBOX","SHELVING","DOCKRAMP","TRUCKBAY","LOADZONE","SORTGATE"], "PALLETS"))
  ]; },
  case(L){ return {grid: L.grid, args: [L.word]}; },
  check(L, ret){
    const p = findPath(L.grid, L.word), want = !!p;
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? L.word + " is on the floor: start at " + pyRepr(p[0]) + " and follow " + p.map(([r, c]) => L.grid[r][c]).join("→") + "." : "You returned True, but " + L.word + " can’t be traced without reusing a tile.");
    return ok("Correct", want ? L.word + " is on the floor, starting at " + pyRepr(p[0]) + "." : L.word + " isn’t on this floor.");
  },
  budget(L){ return 8 * L.grid.length * L.grid[0].length * Math.max(1, L.word.length) + 10; },
  phaseExtra(){ return ", looking for " + S.level.word; },
  tip(run){ return run.vAt.some(Boolean) ? [] : ["visited"]; }
});
