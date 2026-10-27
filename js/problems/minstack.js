import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: stack with a minimum (design) ---------- */
function randomOps(rng, n){
  const ops = []; let size = 0;
  for (let i = 0; i < n; i++){
    const r = rng();
    if (!size || r < .4){ ops.push(["push", ri(rng, -20, 60)]); size++; }
    else if (r < .6){ ops.push(["pop"]); size--; }
    else ops.push([r < .8 ? "top" : "get_min"]);
  }
  return ops;
}
export const MinStackProblem = {
  id: "minstack", tier: 2, tab: "Min stack", pattern: "Design", fname: "min_stack.py", levelNoun: "shifts",
  title: "Stack with a lightest-crate button", sig: "", design: "MinStack", input: "array", view: "array",
  brief: `<p>Crates are stacked one on top of another, and the loader wants a button that instantly shows the lightest crate still in the stack.</p>
<p>Write a class <code>MinStack</code> with <code>push(x)</code>, <code>pop()</code> (removes the top crate), <code>top()</code> (returns the top crate’s weight) and <code>get_min()</code> (returns the lightest weight in the stack). Every method should take constant time. <code>pop</code>, <code>top</code> and <code>get_min</code> are only called when the stack isn’t empty.</p>`,
  show: `Each box is one call, in order: <code>+5</code> is <code>push(5)</code>, <code>−</code> is <code>pop()</code>. The highlighted box is the call that just ran. Name your lists <code>self.stack</code> and <code>self.mins</code> to watch them.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class MinStack:
    def __init__(self):
        pass

    def push(self, x):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def get_min(self):
        pass
`,
  watch: ["stack", "mins", "min_stack", "minimums", "data"], panel: ["stack", "mins", "min_stack", "minimums", "data"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "push" ? "+" + o[1] : o[0] === "pop" ? "−" : o[0] === "top" ? "top" : "min"),
  levels(){ return [
    lvl("s1", "Morning stack", {ops:[["push",5],["push",3],["get_min"],["push",7],["top"],["pop"],["pop"],["get_min"]]}),
    lvl("s2", "Same weights", {ops:[["push",4],["push",4],["get_min"],["pop"],["get_min"],["top"]]}),
    lvl("s3", "Going lighter", {ops:[["push",9],["push",6],["push",2],["get_min"],["pop"],["get_min"],["pop"],["get_min"]]})
  ]; },
  hidden(){ return [lvl("h1", "One crate", {ops:[["push",8],["top"],["get_min"]]}), lvl("h2", "Negative weights", {ops:[["push",-2],["push",0],["push",-3],["get_min"],["pop"],["top"],["get_min"]]}),
    lvl("h3", "Sixty calls", {ops:randomOps(mkRng(61), 60)}), lvl("h4", "Push, pop, push again", {ops:[["push",1],["pop"],["push",5],["get_min"]]})]; },
  ref(L){ const st = [], out = []; for (const [op, x] of L.ops){ if (op === "push") st.push(x); else if (op === "pop") st.pop(); out.push(op === "top" ? st[st.length - 1] : op === "get_min" ? Math.min(...st) : null); } return out; },
  case(L){ return {init: [], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", " + L.ops[i][0] + "(), returned " + pyRepr(ret[i]) + " but should return " + want[i] + ".");
    }
    return ok("Every call answered", "All " + want.filter(x => x !== null).length + " top() and get_min() calls are right.");
  },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.data)) ? [] : ["self.stack"]; },
  random(L){ L.ops = randomOps(Math.random, ri(Math.random, 6, 12)); }
};
