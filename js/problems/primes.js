import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: prime-numbered aisles (sieve of Eratosthenes) ---------- */
function countPrimes(n){
  if (n < 3) return 0;
  const comp = new Uint8Array(n); let c = 0;
  for (let i = 2; i < n; i++){ if (comp[i]) continue; c++; for (let j = i * i; j < n; j += i) comp[j] = 1; }
  return c;
}
export const PrimesProblem = {
  id: "primes", tier: 2, tab: "Prime aisles", pattern: "Sieve", fname: "prime_aisles.py", levelNoun: "warehouses",
  title: "Count the prime-numbered aisles", sig: "n", input: "array", view: "array",
  brief: `<p>Superstitious robots only park in aisles whose number is prime. Aisles are numbered <code>0</code> to <code>n - 1</code>.</p>
<p>Write <code>solve(n)</code> and return how many of those numbers are prime. <code>n</code> can be up to 20,000, so testing every number by trial division is slow; aim for the sieve of Eratosthenes, about <code>O(n log log n)</code>.</p>`,
  show: `The box shows <code>n</code>. A plain number isn’t traced, so this one is all about the answer.`,
  legend: ``,
  watch: [], arrArg: 0, arrLabel2: "n",
  editor: "random",
  arrayOf: L => [L.n],
  levels(){ return [lvl("p1", "Ten aisles", {n:10}), lvl("p2", "A hundred aisles", {n:100}), lvl("p3", "Two aisles", {n:2})]; },
  hidden(){ return [lvl("h1", "No aisles", {n:0}), lvl("h2", "One aisle", {n:1}), lvl("h3", "Three aisles", {n:3}), lvl("h4", "Aisle 13 is the last one", {n:14}), lvl("h5", "Twenty thousand aisles", {n:20000})]; },
  case(L){ return {args:[L.n], arr:[]}; },
  check(L, ret){
    const want = countPrimes(L.n);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return how many aisle numbers are prime.");
    if (ret !== want) return bad("Wrong count", "Below " + L.n + " there " + (want === 1 ? "is 1 prime" : "are " + want + " primes") + ", but you returned " + ret + "." + (ret === want + 1 ? " Is 1, or n itself, being counted?" : ""));
    return ok("Aisles counted", (want === 1 ? "1 aisle number is" : want + " aisle numbers are") + " prime below " + L.n + ".");
  },
  tip(){ return []; },
  random(L){ L.n = ri(Math.random, 2, 200); }
};
