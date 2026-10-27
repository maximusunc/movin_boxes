import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: pick-count calculator (stack, operator precedence) ---------- */
export function evalFlat(s){
  const st = []; let num = 0, op = "+";
  for (let i = 0; i <= s.length; i++){
    const ch = i < s.length ? s[i] : "+";
    if (ch >= "0" && ch <= "9"){ num = num * 10 + (+ch); continue; }
    if (ch === " ") continue;
    if (op === "+") st.push(num); else if (op === "-") st.push(-num); else if (op === "*") st.push(st.pop() * num); else st.push(Math.trunc(st.pop() / num));
    op = ch; num = 0;
  }
  return st.reduce((a, b) => a + b, 0);
}
function randomExpr(rng, terms){
  let s = String(ri(rng, 0, 30));
  for (let k = 1; k < terms; k++){ const op = "+-*/"[ri(rng, 0, 3)]; s += (rng() < .3 ? " " : "") + op + (rng() < .3 ? " " : "") + (op === "/" ? ri(rng, 1, 9) : ri(rng, 0, 30)); }
  return s;
}
export const CalcProblem = {
  id: "calc", tier: 3, tab: "Pick calculator", pattern: "Stack", fname: "pick_calculator.py", levelNoun: "expressions",
  title: "Work out the pick count", sig: "expr", input: "array", view: "array",
  brief: `<p>Pickers scribble counts like <code>3+2*2</code> on their sheets. <code>expr</code> is a string of non-negative whole numbers joined by <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>, possibly with spaces. There are no parentheses. Multiplication and division come before addition and subtraction, and division drops any remainder (<code>7/2</code> is <code>3</code>). No one divides by zero.</p>
<p>Write <code>solve(expr)</code> and return the value, without using <code>eval</code>.</p>`,
  show: `Every character read drops a dot under it. Name your running number <code>num</code>, the last operator <code>op</code> and a list <code>stack</code> of terms still to add up to watch them change.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["stack", "st", "num", "n", "op", "sign", "cur", "last", "res", "result", "total", "i"], pointers: ["i"], panel: ["stack", "st", "num", "op", "sign", "cur", "last", "res", "result", "total"], arrArg: 0, arrLabel2: "expr",
  editor: "random",
  arrayOf: L => [...L.expr].map(ch => ch === " " ? "␣" : ch),
  levels(){ return [lvl("c1", "Times first", {expr:"3+2*2"}), lvl("c2", "Spaces and division", {expr:" 3+5 / 2 "}), lvl("c3", "Mixed", {expr:"14-3*2-6/3"}), lvl("c4", "Going negative", {expr:"2-3*4"})]; },
  hidden(){ return [lvl("h1", "Just a number", {expr:"42"}), lvl("h2", "Zeros", {expr:"0*7+0"}), lvl("h3", "Division left to right", {expr:"100/7/2"}),
    lvl("h4", "Big numbers", {expr:"12345*6-789/3"}), lvl("h5", "Forty terms", {expr:randomExpr(mkRng(81), 40)}), lvl("h6", "Lots of spaces", {expr:"  1 +  2 *  3 -  4 / 2  "})]; },
  case(L){ return {args:[L.expr], arr:[0]}; },
  check(L, ret){
    const want = evalFlat(L.expr);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return a whole number." + (typeof ret === "number" ? " Use // or int(a / b) so division drops the remainder." : ""));
    if (ret !== want) return bad("Wrong value", JSON.stringify(L.expr) + " is " + want + ", but you returned " + ret + ". Remember * and / come before + and -, and run left to right.");
    return ok("Correct", JSON.stringify(L.expr.length > 40 ? L.expr.slice(0, 37) + "…" : L.expr) + " is " + want + ".");
  },
  // An index-based scanner checks a digit several times (space? digit? loop test, int()).
  budget(L){ return 5 * L.expr.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["stack"]; },
  random(L){ L.expr = randomExpr(Math.random, ri(Math.random, 3, 5)); }
};
