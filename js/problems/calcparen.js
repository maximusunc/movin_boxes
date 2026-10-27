import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L5: full calculator (recursive descent / stack of contexts) ---------- */
function evalFull(s){
  let i = 0;
  const peek = () => { while (s[i] === " ") i++; return s[i]; };
  const expr = () => { let v = term(); for (;;){ const c = peek(); if (c === "+"){ i++; v += term(); } else if (c === "-"){ i++; v -= term(); } else return v; } };
  const term = () => { let v = factor(); for (;;){ const c = peek(); if (c === "*"){ i++; v *= factor(); } else if (c === "/"){ i++; v = Math.trunc(v / factor()); } else return v; } };
  const factor = () => {
    const c = peek();
    if (c === "-"){ i++; return -factor(); }
    if (c === "("){ i++; const v = expr(); peek(); i++; return v; }
    let n = 0; while (s[i] >= "0" && s[i] <= "9"){ n = n * 10 + (+s[i]); i++; } return n;
  };
  return expr();
}
function groups(rng, k){
  const parts = [];
  for (let g = 0; g < k; g++){ const a = ri(rng, 1, 20), b = ri(rng, 0, 9), c = ri(rng, 0, 9); parts.push(rng() < .5 ? "(" + a + "*(" + b + "-" + c + "))" : "-(" + a + "/(" + (b + 1) + "+" + c + "))"); }
  return parts.join(" + ");
}
export const CalcParenProblem = {
  id: "calcparen", tier: 5, tab: "Full calculator", pattern: "Recursive descent", fname: "full_calculator.py", levelNoun: "expressions",
  title: "Work out any pick sheet", sig: "expr", input: "array", view: "array",
  brief: `<p>The night crew writes pick counts with parentheses, like <code>2*(5-7)/3</code>. <code>expr</code> is a string of non-negative whole numbers with <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, parentheses and spaces. A minus sign can also negate what follows it, as in <code>-(2+3)</code> or <code>(-4*2)</code>. <code>*</code> and <code>/</code> come before <code>+</code> and <code>-</code>, and division rounds toward zero, like <code>int(a / b)</code> (so <code>-7/2</code> is <code>-3</code>). No one divides by zero.</p>
<p>Write <code>solve(expr)</code> and return the value, without using <code>eval</code>. Read the expression once from left to right.</p>`,
  show: `Every character read drops a dot under it. A recursive parser shows as one sweep; re-scanning the same stretch over and over leaves piles of dots. Name a position <code>i</code> and a <code>stack</code> to watch them.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["i", "pos", "stack", "st", "num", "n", "op", "sign", "res", "result", "cur"], pointers: ["i", "pos"], panel: ["stack", "st", "num", "op", "sign", "res", "result", "cur"], arrArg: 0, arrLabel2: "expr",
  editor: "random",
  arrayOf: L => [...L.expr].map(ch => ch === " " ? "␣" : ch),
  levels(){ return [lvl("e1", "Simple sum", {expr:"1 + 1"}), lvl("e2", "Nested", {expr:"(1+(4+5+2)-3)+(6+8)"}), lvl("e3", "Negated group", {expr:"-(2+3)*4"}), lvl("e4", "Rounds toward zero", {expr:"2*(5-7)/3"})]; },
  hidden(){ return [lvl("h1", "Wrapped many times", {expr:"(((((7)))))"}), lvl("h2", "Negative division", {expr:"-7/2"}), lvl("h3", "Times a negative", {expr:"3*(-4+1)"}),
    lvl("h4", "Sixty levels deep", {expr:"(".repeat(60) + "1+2" + ")".repeat(60) + "*3"}), lvl("h5", "Thirty groups", {expr:groups(mkRng(83), 30)}), lvl("h6", "Spaces everywhere", {expr:" ( 12 - 3 ) * ( 4 + 6 / 2 ) "})]; },
  case(L){ return {args:[L.expr], arr:[0]}; },
  check(L, ret){
    const want = evalFull(L.expr);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a whole number." + (typeof ret === "number" ? " Use int(a / b) so division rounds toward zero." : ""));
    if (ret !== want) return bad("Wrong value", JSON.stringify(L.expr.length > 50 ? L.expr.slice(0, 47) + "…" : L.expr) + " is " + want + ", but you returned " + ret + ".");
    return ok("Correct", "The expression comes to " + want + ".");
  },
  // A recursive-descent parser peeks at a character a few times before consuming it.
  budget(L){ return 5 * L.expr.length + 8; },
  tip(run){ return run.wAt.some(w => w && (w.i != null || w.pos != null || w.stack || w.st)) ? [] : ["i"]; },
  random(L){ const rng = Math.random, a = ri(rng, 1, 9), b = ri(rng, 1, 9), c = ri(rng, 1, 9); L.expr = ["(" + a + "+" + b + ")*" + c, "-(" + a + "-" + b + ")*" + c, a + "*(" + b + "-" + c + ")/2", "(" + a + "+(" + b + "*" + c + "))-" + a][ri(rng, 0, 3)]; }
};
