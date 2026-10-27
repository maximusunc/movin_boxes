import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: best run of the day (Kadane) ---------- */
export const KadaneProblem = {
  id: "kadane", tier: 2, tab: "Best run", pattern: "Kadane", fname: "best_run.py", levelNoun: "days",
  title: "Find the best run of the day", sig: "profits", input: "array", view: "array",
  brief: `<p>Each hour the packing line earns or loses money: <code>profits[i]</code> is the result for hour <code>i</code>, and it can be negative. The manager wants to know the best the line did over any unbroken stretch of hours.</p>
<p>Write <code>solve(profits)</code> and return the largest total of a stretch of one or more consecutive hours.</p>`,
  show: `Every read drops a dot under that hour. Name your running total <code>cur</code> and your answer <code>best</code> to watch them. Trying every start and end hour piles up dots fast.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>A best stretch</span>`,
  watch: ["best", "cur", "curr", "current", "total", "run", "ans", "res", "i", "j"], pointers: ["i", "j"], panel: ["best", "cur", "curr", "current", "total", "run", "ans", "res"], arrArg: 0, arrLabel2: "hourly profit",
  editor: "random",
  arrayOf: L => L.profits,
  levels(){ return [lvl("k1", "Up and down", {profits:[-2,1,-3,4,-1,2,1,-5,4]}), lvl("k2", "A good day", {profits:[5,4,-1,7,8]}), lvl("k3", "A bad day", {profits:[-8,-3,-6,-2,-5,-4]}), lvl("k4", "One big hour", {profits:[-1,-2,9,-3,-1]})]; },
  hidden(){
    const rng = mkRng(43), big = Array.from({length:70}, () => ri(rng, -30, 25));
    return [lvl("h1", "One hour", {profits:[-7]}), lvl("h2", "All zero", {profits:[0,0,0]}), lvl("h3", "Best stretch is everything", {profits:[2,-1,2,-1,2]}),
      lvl("h4", "Seventy hours", {profits:big}), lvl("h5", "Seventy hours, reversed", {profits:big.slice().reverse()})];
  },
  ref(L){ const p = L.profits; let best = p[0], cur = 0, s = 0, bs = 0, be = 0; p.forEach((x, i) => { if (cur <= 0){ cur = x; s = i; } else cur += x; if (cur > best){ best = cur; bs = s; be = i; } }); return {best, bs, be}; },
  case(L){ return {args:[L.profits], arr:[0]}; },
  check(L, ret){
    const {best, bs, be} = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the best total as a number.");
    if (ret !== best) return bad("Not the best run", "The best stretch is hours " + bs + " to " + be + ", for a total of " + best + ", but you returned " + ret + "." + (ret > best ? " A stretch has to be consecutive and can’t be empty." : ""));
    return ok("Best run found", "Hours " + bs + " to " + be + " earned " + best + ", the best of the day.");
  },
  highlight(ret, L){ const {bs, be} = this.ref(L); const s = new Set(); for (let i = bs; i <= be; i++) s.add(i); return s; },
  budget(L){ return 2 * L.profits.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.best != null || w.cur != null || w.curr != null)) ? [] : ["best and cur"]; },
  random(L){ L.profits = Array.from({length: ri(Math.random, 6, 12)}, () => ri(Math.random, -9, 9)); }
};
