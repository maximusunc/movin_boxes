import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: charger cooldown (greedy counting / task scheduler) ---------- */
const randomJobs = (rng, n, letters) => Array.from({length:n}, () => letters[ri(rng, 0, letters.length - 1)]).join("");
export const CooldownProblem = {
  id: "cooldown", tier: 4, tab: "Charger cooldown", pattern: "Greedy + heap", fname: "charger_cooldown.py", levelNoun: "queues",
  title: "Schedule the charging jobs", sig: "jobs, n", input: "array", view: "array",
  brief: `<p>One charger runs one job per time slot. <code>jobs</code> is a string of uppercase letters, one per job; the letter says which robot it charges. After a robot charges, it has to wait at least <code>n</code> slots before it can charge again. In any slot the charger can run a waiting job or sit idle, and jobs can run in any order.</p>
<p>Write <code>solve(jobs, n)</code> and return the fewest slots needed to run every job.</p>`,
  show: `Every read of <code>jobs[i]</code> drops a dot under it. Count each robot’s jobs once (<code>counts</code>), then either simulate with a max-heap or reason about the busiest robot.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["counts", "count", "freq", "heap", "time", "slots", "ans"], panel: ["counts", "count", "freq", "heap", "time", "slots"], arrArg: 0, arrLabel2: "jobs",
  editor: "random",
  arrayOf: L => [...L.jobs], extraLabel: L => "n = " + L.n,
  levels(){ return [lvl("c1", "Two robots", {jobs:"AAABBB", n:2}), lvl("c2", "No wait", {jobs:"AAABBB", n:0}), lvl("c3", "One busy robot", {jobs:"AAAAAABCDEFG", n:2}), lvl("c4", "Plenty of variety", {jobs:"ABCDEABCDE", n:3})]; },
  hidden(){ return [lvl("h1", "One job", {jobs:"Q", n:5}), lvl("h2", "Same robot, long wait", {jobs:"AAAA", n:3}), lvl("h3", "Ties at the top", {jobs:"AAABBBCCD", n:2}),
    lvl("h4", "Sixty jobs, n = 4", {jobs:randomJobs(mkRng(44), 60, "ABCDEF"), n:4}), lvl("h5", "Seventy jobs, n = 1", {jobs:randomJobs(mkRng(45), 70, "ABCDEFGHIJ"), n:1}), lvl("h6", "Forty for one robot", {jobs:"A".repeat(40) + "BC", n:2})]; },
  ref(L){ const c = {}; for (const ch of L.jobs) c[ch] = (c[ch] || 0) + 1; const v = Object.values(c), mx = Math.max(0, ...v), top = v.filter(x => x === mx).length; return Math.max(L.jobs.length, (mx - 1) * (L.n + 1) + top); },
  case(L){ return {args:[L.jobs, L.n], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a number of slots.");
    if (ret !== want) return bad("Wrong number of slots", "The fewest slots is " + want + ", but you returned " + ret + "." + (ret < L.jobs.length ? " Every job needs its own slot." : ""));
    return ok("Charger scheduled", "All " + L.jobs.length + " jobs fit in " + want + " slots" + (want > L.jobs.length ? ", with " + (want - L.jobs.length) + " idle." : ", with no idle time."));
  },
  budget(L){ return 3 * L.jobs.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.counts || w.count || w.freq)) ? [] : ["counts"]; },
  random(L){ L.jobs = randomJobs(Math.random, ri(Math.random, 6, 12), "ABCD".slice(0, ri(Math.random, 1, 4))); L.n = ri(Math.random, 0, 3); }
};
