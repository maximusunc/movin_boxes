import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L1: matching seals (stack) ---------- */
export const BracketsProblem = {
  id: "brackets", tier: 1, tab: "Matching seals", pattern: "Stack", fname: "matching_seals.py", levelNoun: "labels",
  title: "Are the seals matched?", sig: "seals", input: "array", view: "array",
  brief: `<p>Every pallet is wrapped in layers, and its label records each layer as a seal: <code>(</code>, <code>[</code> or <code>{</code> when a layer goes on, and <code>)</code>, <code>]</code> or <code>}</code> when it comes off. A layer can only come off if it’s the outermost one, and it has to close with the matching shape.</p>
<p>Write <code>solve(seals)</code>, where <code>seals</code> is a string, and return <code>True</code> if every seal is closed in the right order, otherwise <code>False</code>.</p>`,
  show: `Every <code>seals[i]</code> read drops a dot under that seal. Name your stack <code>stack</code> to watch the open layers pile up and come off.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  starter: `def solve(seals):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []  # layers that are still open

    # For each seal: if it opens a layer, push it.
    # If it closes one, the top of the stack must be
    # the matching opener. Pop it, or fail.
    # At the end, nothing should be left open.

    return True
`,
  watch: ["stack", "st", "i", "ch", "c", "s"], pointers: ["i"], panel: ["stack", "st", "ch", "c"], arrArg: 0, arrLabel2: "seals",
  editor: "random",
  arrayOf: L => [...L.seals],
  levels(){ return [lvl("s1", "Neatly wrapped", {seals:"([]{})"}), lvl("s2", "Crossed layers", {seals:"([)]"}), lvl("s3", "Left open", {seals:"{[()()]"}), lvl("s4", "Deep stack", {seals:"{[(())]}[]"})]; },
  hidden(){
    const deep = "([{" .repeat(12) + "}])".repeat(12);
    return [lvl("h1", "No seals at all", {seals:""}), lvl("h2", "Closes before it opens", {seals:")("}), lvl("h3", "One stray closer", {seals:"()]"}),
      lvl("h4", "Thirty-six layers deep", {seals:deep}), lvl("h5", "Long run of pairs", {seals:"()[]{}".repeat(10)}), lvl("h6", "Only openers", {seals:"((((["})];
  },
  ref(L){ const st = [], m = {")": "(", "]": "[", "}": "{"}; for (const ch of L.seals){ if ("([{".includes(ch)) st.push(ch); else if (st.pop() !== m[ch]) return false; } return !st.length; },
  case(L){ return {args:[L.seals], arr:[0]}; },
  check(L, ret){
    const want = this.ref(L);
    if (typeof ret !== "boolean") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return True or False.");
    if (ret !== want) return bad("Wrong answer", want ? "Every seal on " + JSON.stringify(L.seals) + " closes in order, but you returned False." : "You returned True, but " + JSON.stringify(L.seals) + " has a seal that’s closed out of order or left open.");
    return ok("Correct", want ? "Every layer comes off in the right order." : "This label is broken, and you caught it.");
  },
  budget(L){ return 2 * L.seals.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["stack"]; },
  random(L){ const n = ri(Math.random, 3, 6), st = []; let s = "";
    for (let k = 0; k < 2*n; k++){ const open = !st.length || (s.length + st.length < 2*n && Math.random() < .5); if (open){ const ch = "([{"[ri(Math.random, 0, 2)]; st.push(ch); s += ch; } else s += {"(": ")", "[": "]", "{": "}"}[st.pop()]; }
    s += st.reverse().map(ch => ({"(": ")", "[": "]", "{": "}"})[ch]).join("");
    if (Math.random() < .5){ const i = ri(Math.random, 0, s.length - 1); s = s.slice(0, i) + ")]}"[ri(Math.random, 0, 2)] + s.slice(i + 1); }
    L.seals = s; }
};
