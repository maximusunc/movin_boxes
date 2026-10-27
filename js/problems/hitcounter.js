import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: scans in the last five minutes (design: queue) ---------- */
const WINDOW = 300;
function randomOps(rng, n, step){
  const ops = []; let t = 1;
  for (let i = 0; i < n; i++){ t += ri(rng, 0, step); ops.push([rng() < .65 ? "hit" : "count", t]); }
  return ops;
}
export const HitCounterProblem = {
  id: "hitcounter", tier: 3, tab: "Scan counter", pattern: "Design", fname: "scan_counter.py", levelNoun: "shifts",
  title: "Count scans in the last five minutes", sig: "", design: "HitCounter", input: "array", view: "array",
  brief: `<p>The dock door has a barcode scanner, and the supervisor wants to know how busy it’s been lately. Times are whole seconds, and calls arrive in time order (the time never goes down, and several calls can share a second).</p>
<p>Write a class <code>HitCounter</code> with <code>hit(t)</code> (a scan at second <code>t</code>) and <code>count(t)</code>, which returns how many scans happened in the last five minutes: from second <code>t - 299</code> to second <code>t</code>, inclusive. Aim for amortized constant time per call.</p>`,
  show: `Each box is one call: <code>+42</code> is <code>hit(42)</code> and <code>#350</code> is <code>count(350)</code>. The highlighted box is the call that just ran. Name your queue <code>self.hits</code> (or <code>self.q</code>) to watch old scans fall off the front.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class HitCounter:
    def __init__(self):
        pass

    def hit(self, t):
        pass

    def count(self, t):
        pass
`,
  watch: ["hits", "q", "queue", "dq", "times", "counts", "total"], panel: ["hits", "q", "queue", "dq", "times", "counts", "total"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(([op, t]) => (op === "hit" ? "+" : "#") + t),
  levels(){ return [
    lvl("c1", "A quiet morning", {ops:[["hit",1],["hit",2],["hit",3],["count",4],["hit",300],["count",300],["count",301]]}),
    lvl("c2", "A burst, then a lull", {ops:[["hit",10],["hit",10],["hit",10],["count",10],["count",309],["count",310]]}),
    lvl("c3", "Steady scanning", {ops:[["hit",100],["hit",250],["hit",399],["count",399],["count",400],["hit",549],["count",650]]})
  ]; },
  hidden(){ const rng = mkRng(37);
    return [lvl("h1", "No scans yet", {ops:[["count",1],["count",500]]}), lvl("h2", "Window edge", {ops:[["hit",1],["count",300],["count",301]]}),
      lvl("h3", "Many scans in one second", {ops:[...Array.from({length:20}, () => ["hit",5]), ["count",5], ["count",304], ["count",305]]}),
      lvl("h4", "Eighty calls over an hour", {ops:randomOps(rng, 80, 90)}), lvl("h5", "Eighty calls in a rush", {ops:randomOps(rng, 80, 6)})]; },
  ref(L){ const hits = []; return L.ops.map(([op, t]) => { if (op === "hit"){ hits.push(t); return null; } return hits.filter(h => h > t - WINDOW).length; }); },
  case(L){ return {init: [], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong count", "Call " + i + ", count(" + L.ops[i][1] + "), returned " + pyRepr(ret[i]) + ", but " + want[i] + " scan" + (want[i] === 1 ? "" : "s") + " happened from second " + (L.ops[i][1] - WINDOW + 1) + " to " + L.ops[i][1] + ".");
    }
    return ok("Every count is right", "All " + want.filter(x => x !== null).length + " count() calls match.");
  },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.hits || w.q || w.queue || w.dq || w.times)) ? [] : ["self.hits"]; },
  random(L){ L.ops = randomOps(Math.random, ri(Math.random, 6, 12), 120); }
};
