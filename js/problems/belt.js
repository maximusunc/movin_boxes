import { S } from "../state.js";
import { bad, isIntArr, lvl, mkRng, pyRepr, ri } from "../util.js";
import { drawBelt, judgeBelt, resolveWatch, sizeBelt } from "../views/belt.js";

/* ---------- L2: conveyor belt (sliding window) ---------- */
const BELT_MAX = 14;
export const BeltProblem = {
  id: "belt", tier: 2, tab: "Conveyor belt", pattern: "Sliding window", fname: "conveyor_belt.py", levelNoun: "belts",
  title: "Load the longest stretch", sig: "weights, limit", input: "array", view: "belt",
  brief: `<p>Packages roll down the belt in order. <code>weights[i]</code> is the weight of package <code>i</code>, always a positive whole number. The truck takes one unbroken stretch of packages, as long as their total weight is at most <code>limit</code>.</p>
<p>Write <code>solve(weights, limit)</code> and return <code>(start, end)</code>, the first and last index of the longest stretch that fits. Return <code>None</code> if no single package fits.</p>`,
  show: `Every read drops a dot under that package. Name your pointers <code>left</code> and <code>right</code> and your running sum <code>total</code> to see the window move.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Window</span><span><i class="sw over"></i>Over the limit</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(weights, limit):
    left = 0
    total = 0
    best = None

    # Grow the window on the right; shrink it from the
    # left whenever total goes over the limit.
    # Return (start, end) of the longest stretch, or None.

    return best
`,
  watch: ["left","l","start","lo","right","r","end","hi","i","j","total","window_sum","window","curr","cur","current","load","s","acc","running","best","best_len","max_len","longest","ans","res","result"],
  editor: "array", arr: "weights", arrLabel: "Package weights", lim: "limit", limLabel: "Limit", maxN: BELT_MAX, maxV: 99,
  levels(){ return [lvl("morning", "Morning shift", {weights:[3,1,2,7,4,2,1,1,5], limit:8}), lvl("heavy", "Heavy pallets", {weights:[9,8,2,1,9,3,3,1,1,2,8,9], limit:10}), lvl("long", "Full belt", {weights:[4,2,6,1,1,3,8,2,2,1,5,3,9,1], limit:12}), lvl("light", "Light load", {weights:[1,2,1,1,2,1,1,2], limit:20}), lvl("none", "Nothing fits", {weights:[12,15,11,14,13], limit:10})]; },
  hidden(){
    const rng = mkRng(5), big = Array.from({length:60}, () => ri(rng, 1, 9));
    return [lvl("h1", "One package that fits", {weights:[4], limit:4}), lvl("h2", "Every package too heavy", {weights:[9,9,9], limit:8}), lvl("h3", "Whole belt fits", {weights:[1,1,1,1,1], limit:5}), lvl("h4", "Long belt", {weights:big, limit:20}), lvl("h5", "Best stretch at the end", {weights:[9,9,1,1,1,1], limit:4})];
  },
  case(L){ return {args:[L.weights, L.limit], arr:[0]}; },
  check(L, ret){
    if (Array.isArray(ret) && !ret.length) ret = null;
    if (ret !== null && !isIntArr(ret, 2)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a (start, end) pair of indices, or None.");
    return judgeBelt(L, ret);
  },
  budget(L){ return 3 * L.weights.length + 2; },
  prep(run){ run.wAt = run.wAt.map(resolveWatch); },
  size(w){ return sizeBelt(w); }, draw(){ drawBelt(); },
  finalTicks(){ return 1; }, finalRate(){ return 1.4; },
  phase(){
    if (!S.run.hasRet && S.t >= S.run.T) return ["Stopped", S.run.E + " belt reads"];
    if (S.t < S.run.E || !S.run.hasRet){ const idx = Math.min(S.run.E, Math.max(1, Math.ceil(S.t))) - 1; const w = S.run.wAt[idx]; return ["Scanning", "Read " + (idx + 1) + " of " + S.run.E + (w && w.best != null ? ", best so far " + w.best : "")]; }
    if (S.t < S.run.T) return ["Loading", S.run.ret ? "Packages " + S.run.ret[0] + " to " + S.run.ret[1] : "Nothing to load"];
    if (!isIntArr(S.run.ret, 2)) return ["Done", "Returned None"];
    return [S.run.verdict.status === "fail" ? "Stopped" : "Loaded", (S.run.ret[1] - S.run.ret[0] + 1) + " packages, limit " + S.level.limit];
  },
  tip(run){ const m = []; if (!run.wAt.some(x => x && x.L != null && x.R != null)) m.push("left and right"); if (!run.wAt.some(x => x && x.sum != null)) m.push("total"); return m; },
  random(L){ const n = 9 + ri(Math.random, 0, 5); L.weights = Array.from({length:n}, () => ri(Math.random, 1, 9)); L.limit = ri(Math.random, 8, 17); }
};
