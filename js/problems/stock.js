import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: trade with a cooldown (state-machine DP) ---------- */
function profit(p){ let hold = -Infinity, sold = -Infinity, rest = 0; for (const x of p){ const h = Math.max(hold, rest - x), s = hold + x, r = Math.max(rest, sold); hold = h; sold = s; rest = r; } return Math.max(0, sold, rest); }
export const StockProblem = {
  id: "stock", tier: 4, tab: "Pallet trading", pattern: "State-machine DP", fname: "pallet_trading.py", levelNoun: "weeks",
  title: "Trade pallets with a cooldown", sig: "prices", input: "array", view: "array",
  brief: `<p>The warehouse buys and resells one pallet of surplus stock at a time. <code>prices[i]</code> is the price on day <code>i</code>. You can hold at most one pallet, you can trade as many times as you like, and after you sell you must wait one full day before buying again.</p>
<p>Write <code>solve(prices)</code> and return the most profit you can make.</p>`,
  show: `Every <code>prices[i]</code> read drops a dot under that day. Track one best total per state, such as <code>hold</code>, <code>sold</code> and <code>rest</code>, and watch them in the panel.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["hold", "sold", "rest", "cool", "cash", "buy", "sell", "dp", "i"], pointers: ["i"], panel: ["hold", "sold", "rest", "cool", "cash", "buy", "sell", "dp"], arrArg: 0, arrLabel2: "daily price",
  editor: "array", arr: "prices", arrLabel: "Daily prices", lim: null, maxN: 14, maxV: 99,
  arrayOf: L => L.prices,
  levels(){ return [lvl("s1", "Short week", {prices:[1,2,3,0,2]}), lvl("s2", "Steady climb", {prices:[1,2,3,4,5]}), lvl("s3", "Falling market", {prices:[9,7,5,3,1]}), lvl("s4", "Choppy", {prices:[3,8,1,9,2,7,4,10]})]; },
  hidden(){
    const rng = mkRng(107), big = Array.from({length:70}, () => ri(rng, 1, 90));
    return [lvl("h1", "One day", {prices:[5]}), lvl("h2", "No days", {prices:[]}), lvl("h3", "Two days", {prices:[2,9]}), lvl("h4", "Seventy days", {prices:big}), lvl("h5", "Up, down, up", {prices:[1,4,2,8,3,9,1,6]})];
  },
  case(L){ return {args:[L.prices], arr:[0]}; },
  check(L, ret){
    const best = profit(L.prices);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the profit as a number.");
    if (ret !== best) return bad("Not the best profit", "The best possible profit is " + best + ", but you returned " + ret + "." + (ret > best ? " Remember the one-day wait after every sale." : ""));
    return ok("Best profit", best ? "Trading well earns " + best + "." : "No trade makes money here, so the best is 0.");
  },
  budget(L){ return 3 * L.prices.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.hold != null || w.sold != null || w.dp)) ? [] : ["hold and sold"]; },
  random(L){ L.prices = Array.from({length: ri(Math.random, 6, 12)}, () => ri(Math.random, 1, 20)); }
};
