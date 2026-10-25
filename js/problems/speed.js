import { S } from "../state.js";
import { bad, lvl, mkRng, pyRepr, ri } from "../util.js";
import { drawSpeed, judgeSpeed, minutesAt, refSpeed, resolveSpeed, sizeSpeed } from "../views/speed.js";

/* ---------- L3: slowest speed (binary search) ---------- */
export const SpeedProblem = {
  id: "speed", tier: 3, tab: "Slowest speed", pattern: "Binary search", fname: "slowest_speed.py", levelNoun: "shifts",
  title: "Find the slowest safe speed", sig: "orders, minutes", input: "array", view: "speed",
  brief: `<p>Aisle <code>i</code> has <code>orders[i]</code> packages. At speed <code>k</code> the robot picks <code>k</code> packages a minute and works one aisle per minute, so an aisle takes <code>ceil(orders[i] / k)</code> minutes.</p>
<p>Write <code>solve(orders, minutes)</code> and return the slowest whole-number speed that finishes every aisle within the shift.</p>`,
  show: `Name your bounds <code>lo</code> and <code>hi</code> and your guess <code>mid</code> to see the range close in. Every tested speed gets a dot: green if it finishes, red if it runs over.`,
  legend: `<span><i class="sw flash"></i>Testing now</span><span><i class="sw visited"></i>Search range</span><span><i class="sw okdot"></i>Finishes</span><span><i class="sw baddot"></i>Runs over</span>`,
  starter: `def solve(orders, minutes):
    lo, hi = 1, max(orders)

    # Binary search on the speed.
    # At speed mid, each aisle takes ceil(p / mid) minutes.
    # If the total fits in the shift, try slower.
    # Otherwise, go faster.

    return lo
`,
  watch: ["lo","low","left","l","hi","high","right","r","mid","m","k","speed","guess"],
  editor: "array", arr: "orders", arrLabel: "Packages per aisle", lim: "minutes", limLabel: "Shift minutes", maxN: 10, maxV: 60, limAtLeastN: true,
  levels(){ return [lvl("small", "Small batch", {orders:[3,6,7,11], minutes:8}), lvl("steady", "Steady shift", {orders:[30,11,23,4,20], minutes:6}), lvl("rush", "Rush order", {orders:[30,11,23,4,20], minutes:5}), lvl("big", "Big warehouse", {orders:[45,12,38,27,9,50,33], minutes:14}), lvl("easy", "Plenty of time", {orders:[8,15,4,22,10], minutes:60})]; },
  hidden(){
    const rng = mkRng(13), big = Array.from({length:30}, () => ri(rng, 100, 5000));
    return [lvl("h1", "One aisle, one minute", {orders:[1000], minutes:1}), lvl("h2", "One minute per aisle", {orders:[5,9,2], minutes:3}), lvl("h3", "Speed 1 is enough", {orders:[2,3,1], minutes:50}), lvl("h4", "Huge orders", {orders:big, minutes:200})];
  },
  case(L){ return {args:[L.orders, L.minutes], arr:[0]}; },
  check(L, k){
    if (typeof k !== "number" || !Number.isInteger(k)) return bad("Check the return value", "solve() returned " + pyRepr(k) + ". Return the speed as a whole number.");
    return judgeSpeed(L, k);
  },
  budget(L){ const p = refSpeed(L).probes; return L.orders.length * (2 * p + 3); },
  prep(run){
    run.wAt = run.wAt.map(resolveSpeed);
    run.probeAt = run.wAt.map(w => w && w.mid);
    run.order = []; run.probeAt.forEach(m => { if (m != null && Number.isInteger(m) && m >= 1 && run.order[run.order.length-1] !== m) run.order.push(m); });
  },
  size(w){ return sizeSpeed(w); }, draw(){ drawSpeed(); },
  finalTicks(){ return 1; }, finalRate(){ return 1.4; },
  phase(){
    if (!S.run.hasRet && S.t >= S.run.T) return ["Stopped", S.run.E + " reads"];
    if (S.t < S.run.E || !S.run.hasRet){ const idx = Math.min(S.run.E, Math.max(1, Math.ceil(S.t))) - 1; const w = S.run.wAt[idx]; return ["Searching", "Read " + (idx + 1) + " of " + S.run.E + (w && w.mid != null ? ", testing speed " + w.mid : "")]; }
    if (typeof S.run.ret !== "number") return ["Done", "Returned " + pyRepr(S.run.ret)];
    if (S.t < S.run.T) return ["Planning the shift", "Speed " + S.run.ret];
    return [S.run.verdict.status === "fail" ? "Shift fails" : "Shift planned", "Speed " + S.run.ret + ", " + minutesAt(S.level, Math.max(1, S.run.ret)) + " of " + S.level.minutes + " minutes"];
  },
  tip(run){ return run.wAt.some(w => w && w.mid != null) ? [] : ["mid"]; },
  random(L){ const n = ri(Math.random, 4, 8); L.orders = Array.from({length:n}, () => ri(Math.random, 2, 50)); L.minutes = n + ri(Math.random, 0, n * 3); }
};
