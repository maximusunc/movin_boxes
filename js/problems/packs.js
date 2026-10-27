import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: equal packs (GCD) ---------- */
const gcd = (a, b) => { while (b){ [a, b] = [b, a % b]; } return a; };
export const PacksProblem = {
  id: "packs", tier: 1, tab: "Equal packs", pattern: "GCD", fname: "equal_packs.py", levelNoun: "orders",
  title: "Find the biggest pack size", sig: "orders", input: "array", view: "array",
  brief: `<p>The packing line wants one pack size that works for every order. <code>orders[i]</code> is how many items order <code>i</code> needs, and each order must be filled with whole packs, nothing left over.</p>
<p>Write <code>solve(orders)</code> and return the largest pack size that divides every order evenly.</p>`,
  show: `Every <code>orders[i]</code> read drops a dot under that order. Name your running answer <code>g</code> to watch it shrink as each order is folded in.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(orders):
    g = 0

    # Euclid's algorithm finds the greatest common divisor:
    #   gcd(a, b) == gcd(b, a % b), and gcd(a, 0) == a
    # The gcd of a whole list is gcd(gcd(gcd(a, b), c), ...),
    # so fold the orders in one at a time.

    return g
`,
  watch: ["g", "ans", "res", "result", "a", "b", "i"], pointers: ["i"], panel: ["g", "ans", "res", "result", "a", "b"], arrArg: 0, arrLabel2: "orders",
  editor: "array", arr: "orders", arrLabel: "Order sizes", lim: null, maxN: 12, maxV: 999,
  arrayOf: L => L.orders,
  levels(){ return [lvl("g1", "Morning orders", {orders:[12,18,30]}), lvl("g2", "Nothing in common", {orders:[8,9,15]}), lvl("g3", "Big batches", {orders:[240,360,600,840]})]; },
  hidden(){
    const rng = mkRng(29), big = Array.from({length:50}, () => 7 * ri(rng, 1, 140));
    big[0] = 7 * 11; big[1] = 7 * 13;
    return [lvl("h1", "One order", {orders:[42]}), lvl("h2", "All the same", {orders:[16,16,16]}), lvl("h3", "One-item order", {orders:[1,500,77]}),
      lvl("h4", "Multiples of 13", {orders:[13,26,39,65]}), lvl("h5", "Fifty orders, all multiples of 7", {orders:big})];
  },
  ref(L){ return L.orders.reduce(gcd, 0); },
  case(L){ return {args:[L.orders], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the pack size as a whole number.");
    if (ret !== want){
      const odd = L.orders.find(x => ret <= 0 || x % ret !== 0);
      return bad("Wrong pack size", odd !== undefined ? (ret <= 0 ? "A pack must hold at least one item." : "A pack of " + ret + " doesn’t split the order of " + odd + " evenly.") + " The answer is " + want + "." : "Packs of " + ret + " work, but " + want + " is bigger and works too.");
    }
    return ok("Pack size found", "Packs of " + want + " fill every order exactly.");
  },
  budget(L){ return 2 * L.orders.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.g != null || w.ans != null || w.res != null)) ? [] : ["g"]; },
  random(L){ const k = ri(Math.random, 2, 12); L.orders = Array.from({length: ri(Math.random, 3, 7)}, () => k * ri(Math.random, 1, 20)); }
};
