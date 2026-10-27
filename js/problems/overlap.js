import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: two pallet zones (rectangle geometry) ---------- */
const area = r => (r[2] - r[0]) * (r[3] - r[1]);
export const OverlapProblem = {
  id: "overlap", tier: 2, tab: "Pallet zones", pattern: "Geometry", fname: "pallet_zones.py", levelNoun: "floor plans",
  title: "How much floor do two zones cover?", sig: "a, b", input: "array", view: "array",
  brief: `<p>Two pallet zones are painted on the floor as rectangles with sides parallel to the walls. Each is <code>(x1, y1, x2, y2)</code>: the bottom-left corner and the top-right corner, with <code>x1 &lt; x2</code> and <code>y1 &lt; y2</code>. Coordinates can be negative.</p>
<p>Write <code>solve(a, b)</code> and return the total floor area covered by at least one zone, counting any overlap only once.</p>`,
  show: `The two boxes are the zones, written <code>x1–y1–x2–y2</code>. Plain tuples aren’t traced; this one is about getting the overlap right.`,
  legend: ``,
  watch: [], arrArg: 0, arrLabel2: "zones",
  editor: "random",
  arrayOf: L => [L.a, L.b],
  levels(){ return [lvl("o1", "Partly overlapping", {a:[-3,0,3,4], b:[0,-1,9,2]}), lvl("o2", "Far apart", {a:[0,0,2,2], b:[5,5,7,8]}), lvl("o3", "One inside the other", {a:[0,0,10,10], b:[2,3,4,6]})]; },
  hidden(){ return [lvl("h1", "Same zone twice", {a:[1,1,4,5], b:[1,1,4,5]}), lvl("h2", "Sharing an edge", {a:[0,0,2,2], b:[2,0,4,2]}), lvl("h3", "Touching at a corner", {a:[0,0,1,1], b:[1,1,2,2]}),
    lvl("h4", "A cross", {a:[-5,-1,5,1], b:[-1,-5,1,5]}), lvl("h5", "Big negative zones", {a:[-9000,-9000,-1000,4000], b:[-2000,-3000,7000,6000]}), lvl("h6", "Overlap only in x", {a:[0,0,4,1], b:[1,3,5,6]})]; },
  ref(L){ const [a, b] = [L.a, L.b], w = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), h = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])); return area(a) + area(b) - w * h; },
  case(L){ return {args:[L.a, L.b], arr:[]}; },
  check(L, ret){
    const want = this.ref(L), both = area(L.a) + area(L.b);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the area as a whole number.");
    if (ret !== want) return bad("Wrong area", "The zones cover " + want + " square units, but you returned " + ret + "." + (ret === both && want !== both ? " That counts the overlap twice." : ret < want ? " When the zones only touch or don’t meet, the overlap should be 0, not negative." : ""));
    return ok("Area measured", "Together the zones cover " + want + " square units" + (want < both ? ", " + (both - want) + " of them shared." : ", with no overlap."));
  },
  tip(){ return []; },
  random(L){ const r = () => { const x = ri(Math.random, -10, 10), y = ri(Math.random, -10, 10); return [x, y, x + ri(Math.random, 1, 10), y + ri(Math.random, 1, 10)]; }; L.a = r(); L.b = r(); }
};
