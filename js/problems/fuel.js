import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: where to start the loop (greedy, gas station) ---------- */
const completes = (L, s) => { const n = L.fuel.length; let tank = 0; for (let k = 0; k < n; k++){ const i = (s + k) % n; tank += L.fuel[i] - L.cost[i]; if (tank < 0) return false; } return true; };
function loopWithStart(rng, n){
  // Random fuel and cost with enough fuel overall, rotated so a valid start lands near the end.
  const fuel = Array.from({length:n}, () => ri(rng, 1, 9)), cost = Array.from({length:n}, () => ri(rng, 1, 9));
  let diff = fuel.reduce((a, b) => a + b, 0) - cost.reduce((a, b) => a + b, 0);
  for (let i = 0; diff < 0; i = (i + 1) % n){ fuel[i]++; diff++; }
  let s = 0; while (!completes({fuel, cost}, s)) s++;
  const shift = ((s - (n - 3)) % n + n) % n;
  return {fuel: fuel.slice(shift).concat(fuel.slice(0, shift)), cost: cost.slice(shift).concat(cost.slice(0, shift))};
}
export const FuelProblem = {
  id: "fuel", tier: 3, tab: "Fuel loop", pattern: "Greedy", fname: "fuel_loop.py", levelNoun: "routes",
  title: "Where should the tugger start?", sig: "fuel, cost", input: "array", view: "array",
  brief: `<p>A tugger drives a loop of charging stations, from station <code>i</code> to <code>i + 1</code>, and from the last one back to station 0. At station <code>i</code> it picks up <code>fuel[i]</code> units, and driving on to the next station uses <code>cost[i]</code>. It starts with an empty tank, and the tank can never go below zero.</p>
<p>Write <code>solve(fuel, cost)</code> and return a station where the tugger can start and make it all the way round, or <code>-1</code> if there isn’t one. If more than one works, any of them is fine.</p>`,
  show: `The boxes show <code>fuel</code>, and reads of <code>fuel</code> drop dots (reads of <code>cost</code> count too). Name your running fuel <code>tank</code> and your candidate <code>start</code> to watch the greedy pass.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Returned start</span>`,
  watch: ["tank", "start", "total", "cur", "curr", "i"], pointers: ["start", "i"], panel: ["tank", "total", "cur", "curr"], arrArg: 0, arrLabel2: "fuel",
  editor: "random",
  arrayOf: L => L.fuel, extraLabel: L => L.cost.length <= 10 ? "cost " + L.cost.join(" ") : "cost: " + L.cost.length + " legs",
  levels(){ return [lvl("f1", "Five stations", {fuel:[1,2,3,4,5], cost:[3,4,5,1,2]}), lvl("f2", "Not enough fuel", {fuel:[2,3,4], cost:[3,4,3]}), lvl("f3", "Start at the top", {fuel:[5,1,2,3,4], cost:[4,4,1,5,1]})]; },
  hidden(){
    return [lvl("h1", "One station", {fuel:[3], cost:[3]}), lvl("h2", "One station, short", {fuel:[2], cost:[3]}), lvl("h3", "Exactly enough", {fuel:[1,1,1,1], cost:[1,1,1,1]}),
      lvl("h4", "Seventy stations", loopWithStart(mkRng(19), 70)), lvl("h5", "Sixty-five stations", loopWithStart(mkRng(27), 65)),
      lvl("h6", "Seventy stations, one short", {fuel:Array(70).fill(4), cost:Array(69).fill(4).concat([5])})];
  },
  case(L){ return {args:[L.fuel, L.cost], arr:[0, 1]}; },
  check(L, ret){
    const n = L.fuel.length, any = Array.from({length:n}, (_, s) => s).find(s => completes(L, s));
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a station number, or -1.");
    if (any === undefined) return ret === -1 ? ok("Correct", "There isn’t enough fuel to go round from anywhere, so -1 is right.") : bad("No start works", "There isn’t enough fuel on this loop to go all the way round, so the answer is -1.");
    if (ret === -1) return bad("A start exists", "Starting at station " + any + " makes it round, but you returned -1.");
    if (ret < 0 || ret >= n) return bad("No such station", "There are " + n + " stations, numbered 0 to " + (n - 1) + ".");
    if (!completes(L, ret)) return bad("Runs out of fuel", "Starting at station " + ret + ", the tank runs dry before the loop is done. Station " + any + " works.");
    return ok("Loop completed", "Starting at station " + ret + ", the tugger makes it all the way round.");
  },
  highlight(ret, L){ return Number.isInteger(ret) && ret >= 0 && ret < L.fuel.length ? new Set([ret]) : null; },
  budget(L){ return 3 * L.fuel.length + 6; },
  tip(run){ return run.wAt.some(w => w && w.tank != null) ? [] : ["tank"]; },
  random(L){ const n = ri(Math.random, 4, 8); Object.assign(L, Math.random() < .7 ? loopWithStart(Math.random, n) : {fuel: Array.from({length:n}, () => ri(Math.random, 1, 5)), cost: Array.from({length:n}, () => ri(Math.random, 3, 8))}); }
};
