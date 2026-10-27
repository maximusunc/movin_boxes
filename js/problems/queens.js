import { COL, ctx, resultLine, rr } from "../canvas.js";
import { S } from "../state.js";
import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: place the forklifts (N-Queens / backtracking) ---------- */
const COUNTS = [1, 1, 0, 0, 2, 10, 4, 40, 92, 352];
function firstPlacement(n){
  const cols = [], used = new Set(), d1 = new Set(), d2 = new Set();
  const go = r => { if (r === n) return true; for (let c = 0; c < n; c++){ if (used.has(c) || d1.has(r - c) || d2.has(r + c)) continue; cols.push(c); used.add(c); d1.add(r - c); d2.add(r + c); if (go(r + 1)) return true; cols.pop(); used.delete(c); d1.delete(r - c); d2.delete(r + c); } return false; };
  return go(0) ? cols : null;
}
let geo = null;
export const QueensProblem = {
  id: "queens", tier: 4, tab: "Place forklifts", pattern: "Backtracking", fname: "place_forklifts.py", levelNoun: "floors",
  title: "Park the forklifts safely", sig: "n", input: "array", view: "custom",
  brief: `<p>A square floor has <code>n × n</code> parking spots, and <code>n</code> forklifts must park on it. Forklifts can drive any distance straight along a row, a column or a diagonal, so no two may share a row, a column or a diagonal.</p>
<p>Write <code>solve(n)</code> and return how many different ways there are to park all <code>n</code> forklifts. <code>n</code> is at most 9.</p>`,
  show: `The input is a single number, so there are no reads to show. When you return, the floor shows one safe way to park the forklifts.`,
  legend: `<span><i class="sw okring"></i>One safe arrangement</span>`,
  watch: [], editor: "random",
  levels(){ return [lvl("q1", "4 × 4 floor", {n:4}), lvl("q2", "5 × 5 floor", {n:5}), lvl("q3", "6 × 6 floor", {n:6})]; },
  hidden(){ return [lvl("h1", "One spot", {n:1}), lvl("h2", "2 × 2 floor", {n:2}), lvl("h3", "3 × 3 floor", {n:3}), lvl("h4", "8 × 8 floor", {n:8}), lvl("h5", "9 × 9 floor", {n:9}), lvl("h6", "7 × 7 floor", {n:7})]; },
  case(L){ return {args:[L.n], arr:[]}; },
  check(L, ret){
    const want = COUNTS[L.n];
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of arrangements.");
    if (ret !== want) return bad("Wrong count", "You counted " + ret + ", but there " + (want === 1 ? "is 1 safe arrangement" : "are " + want + " safe arrangements") + " on a " + L.n + " × " + L.n + " floor." + (ret > want ? " Check the diagonals: on one, r − c is the same; on the other, r + c is." : ""));
    return ok("Count is right", "There " + (want === 1 ? "is 1 safe arrangement" : "are " + want + " safe arrangements") + " on a " + L.n + " × " + L.n + " floor.");
  },
  size(w){
    const n = S.level.n, W = Math.max(260, Math.min(w, 420)), s = Math.floor(Math.min(56, (W - 20) / Math.max(1, n)));
    geo = {W, n, s, ox: Math.floor((W - n*s) / 2), oy: 12};
    geo.H = geo.oy + n*s + 40;
    return [W, geo.H];
  },
  draw(){
    if (!geo) return;
    const g = geo, n = g.n, s = g.s;
    ctx.clearRect(0, 0, g.W, g.H);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++){ ctx.fillStyle = (r + c) % 2 ? COL.seam : COL.floor; ctx.fillRect(g.ox + c*s, g.oy + r*s, s, s); }
    const final = S.run && S.run.hasRet && S.t >= S.run.E;
    if (final && S.run.verdict && S.run.verdict.status === "pass"){
      const cols = firstPlacement(n) || [];
      cols.forEach((c, r) => {
        const x = g.ox + c*s, y = g.oy + r*s, p = s*.16;
        ctx.fillStyle = COL.robot; rr(x + p, y + p, s - 2*p, s - 2*p, s*.18); ctx.fill();
        ctx.fillStyle = COL.ink; ctx.fillRect(x + s*.3, y + s*.62, s*.4, s*.08); ctx.fillRect(x + s*.44, y + s*.28, s*.08, s*.36);
      });
    }
    resultLine(g.ox, g.H - 14, g.W - 2*g.ox);
  },
  finalTicks(){ return 1; },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; },
  random(L){ L.n = ri(Math.random, 4, 8); }
};
