import { bad, isIntArr, lvl, mkRng, ok, pyRepr, ri } from "../util.js";
import { drawIntervals, sizeIntervals } from "../views/intervals.js";

/* ---------- L5: rack skyline (sweep line + heap) ---------- */
function skyline(B){
  const xs = [...new Set(B.flatMap(b => [b[0], b[1]]))].sort((a, b) => a - b), out = [];
  let prev = 0;
  for (const x of xs){
    let h = 0; for (const [l, r, hh] of B) if (l <= x && x < r && hh > h) h = hh;
    if (h !== prev){ out.push([x, h]); prev = h; }
  }
  return out;
}
function randomRacks(rng, n, span){
  const B = Array.from({length:n}, () => { const l = ri(rng, 0, span); return [l, l + ri(rng, 1, Math.max(2, span / 6)), ri(rng, 1, 30)]; });
  return B.sort((a, b) => a[0] - b[0]);
}
export const SkylineProblem = {
  id: "skyline", tier: 5, tab: "Rack skyline", pattern: "Sweep line", fname: "rack_skyline.py", levelNoun: "rows",
  title: "Draw the rack skyline", sig: "racks", input: "array", view: "intervals",
  brief: `<p>Looking down an aisle, the racks stand side by side and overlap. Each rack is <code>(left, right, height)</code>: it covers <code>left ≤ x &lt; right</code> at that height. <code>racks</code> is sorted by <code>left</code>.</p>
<p>Write <code>solve(racks)</code> and return the outline you’d see against the back wall, as a list of key points <code>(x, height)</code>: each point is where the outline’s height changes to <code>height</code>, sorted by <code>x</code>. The last point always drops to height 0, and no two consecutive points have the same height.</p>`,
  show: `Each bar is one rack’s span from <code>left</code> to <code>right</code> (heights aren’t drawn). Every read of <code>racks[i]</code> highlights that rack, so a sweep reads each one once.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw visited"></i>Read</span>`,
  watch: ["heap", "live", "pq", "res", "out", "result", "points", "i", "x"], panel: ["res", "out", "result", "points"], heapNames: [],
  editor: "random", intervalsOf: L => L.racks.map(b => [b[0], b[1]]),
  levels(){ return [lvl("s1", "Five racks", {racks:[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]}), lvl("s2", "Same height, touching", {racks:[[0,2,3],[2,5,3]]}), lvl("s3", "A tall one inside", {racks:[[1,10,4],[3,5,9],[6,8,2]]})]; },
  hidden(){ return [lvl("h1", "One rack", {racks:[[1,2,1]]}), lvl("h2", "Same left edge", {racks:[[0,5,3],[0,3,7],[0,8,1]]}), lvl("h3", "Same right edge", {racks:[[0,6,2],[2,6,5],[4,6,3]]}),
    lvl("h4", "Gaps between racks", {racks:[[0,1,4],[3,4,4],[6,9,2]]}), lvl("h5", "Forty racks", {racks:randomRacks(mkRng(53), 40, 120)}), lvl("h6", "Sixty racks", {racks:randomRacks(mkRng(57), 60, 200)})]; },
  case(L){ return {args:[L.racks], arr:[0]}; },
  check(L, ret){
    const want = skyline(L.racks);
    if (!Array.isArray(ret) || ret.some(p => !isIntArr(p, 2))) return bad("Check the return value", "solve() returned " + pyRepr(ret).slice(0, 80) + ". Return a list of (x, height) points.");
    for (let i = 0; i < Math.max(want.length, ret.length); i++){
      const a = ret[i], b = want[i];
      if (a && b && a[0] === b[0] && a[1] === b[1]) continue;
      if (!a) return bad("Outline ends early", "After " + pyRepr(ret.slice(-1)) + " the outline should continue with " + pyRepr(b) + ".");
      if (!b) return bad("Extra points", "The outline is done after " + pyRepr(want[want.length - 1]) + ", but you have " + pyRepr(a) + " too." + (ret[i - 1] && ret[i - 1][1] === a[1] ? " Two consecutive points have the same height." : ""));
      return bad("Wrong key point", "Point " + i + " should be " + pyRepr(b) + ", but yours is " + pyRepr(a) + "." + (i > 0 && ret[i - 1][1] === a[1] ? " It has the same height as the point before it; merge them." : ""));
    }
    return ok("Skyline drawn", want.length <= 8 ? "The outline is " + pyRepr(want) + "." : "All " + want.length + " key points are right.");
  },
  budget(L){ return 4 * L.racks.length + 6; },
  size(w){ return sizeIntervals(w); }, draw(){ drawIntervals(); },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; },
  random(L){ L.racks = randomRacks(Math.random, ri(Math.random, 3, 7), 20); }
};
