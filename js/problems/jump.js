import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: hop to the last dock (greedy) ---------- */
export const JumpProblem = {
  id: "jump", tier: 2, tab: "Dock hopping", pattern: "Greedy", fname: "dock_hopping.py", levelNoun: "piers",
  title: "Can the robot hop to the last dock?", sig: "hops", input: "array", view: "array",
  brief: `<p>A robot starts at dock <code>0</code> of a long pier. From dock <code>i</code> it can hop forward up to <code>hops[i]</code> docks (any distance from 1 to <code>hops[i]</code>). A <code>0</code> means it can’t hop from there at all.</p>
<p>Write <code>solve(hops)</code> and return <code>True</code> if the robot can reach the last dock, otherwise <code>False</code>.</p>`,
  show: `Every read drops a dot under that dock. Name the furthest dock you can reach so far <code>reach</code> to see it as a pointer. When your code finishes, every dock the robot can actually reach gets a ring.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span><span><i class="sw okring"></i>Reachable</span>`,
  watch: ["reach", "farthest", "furthest", "far", "max_reach", "goal", "last", "i", "j"], pointers: ["i", "j", "reach", "farthest", "furthest", "far", "max_reach", "goal", "last"], panel: [], arrArg: 0, arrLabel2: "hop lengths",
  editor: "random",
  arrayOf: L => L.hops,
  levels(){ return [lvl("j1", "Easy pier", {hops:[2,3,1,1,4]}), lvl("j2", "Stuck at a zero", {hops:[3,2,1,0,4]}), lvl("j3", "Long hop over zeros", {hops:[4,0,0,0,1,0,2,1]}), lvl("j4", "Short hops", {hops:[1,1,1,1,1,1]})]; },
  hidden(){
    const rng = mkRng(47), big = Array.from({length:70}, () => ri(rng, 1, 3));
    return [lvl("h1", "Already there", {hops:[0]}), lvl("h2", "Zero at the start", {hops:[0,1]}), lvl("h3", "Zero only at the end", {hops:[1,2,0]}),
      lvl("h4", "Seventy docks", {hops:big}), lvl("h5", "Seventy docks, one gap", {hops:Array.from({length:70}, (_, i) => i === 40 ? 0 : 1)}), lvl("h6", "Seventy single hops", {hops:Array(70).fill(1)})];
  },
  reachable(L){ const s = new Set([0]); let far = 0; L.hops.forEach((h, i) => { if (i > far) return; s.add(i); far = Math.max(far, i + h); }); return s; },
  ref(L){ return this.reachable(L).has(L.hops.length - 1); },
  case(L){ return {args:[L.hops], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L), n = L.hops.length;
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want){
      if (want) return bad("It can get there", "You returned False, but the robot can reach dock " + (n - 1) + ".");
      const far = Math.max(...this.reachable(L)); return bad("It gets stuck", "You returned True, but the furthest the robot can get is dock " + far + ".");
    }
    return ok("Correct", want ? "The robot can reach dock " + (n - 1) + "." : "The robot gets stuck at dock " + Math.max(...this.reachable(L)) + ", so False is right.");
  },
  highlight(ret, L){ return this.reachable(L); },
  budget(L){ return 2 * L.hops.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.reach != null || w.farthest != null || w.furthest != null || w.far != null || w.max_reach != null || w.goal != null)) ? [] : ["reach"]; },
  random(L){ const n = ri(Math.random, 6, 12); L.hops = Array.from({length:n}, () => Math.random() < .2 ? 0 : ri(Math.random, 1, 3)); }
};
