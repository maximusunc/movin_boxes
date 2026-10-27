import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: relabel step by step (word ladder, BFS over strings) ---------- */
const LETTERS = "ABCDE";
function ladderCodes(rng, len, n){
  // random walk of one-letter changes, plus some noise codes
  let w = Array.from({length: len}, () => LETTERS[ri(rng, 0, LETTERS.length - 1)]).join("");
  const start = w, seen = new Set(), out = [];
  for (let i = 0; i < n && out.length < n; i++){
    const k = ri(rng, 0, len - 1), ch = LETTERS[ri(rng, 0, LETTERS.length - 1)];
    w = w.slice(0, k) + ch + w.slice(k + 1);
    if (!seen.has(w) && w !== start){ seen.add(w); out.push(w); }
  }
  return {start, codes: out.sort(() => rng() - .5), goal: out.length ? w : start};
}
export const LadderProblem = {
  id: "ladder", tier: 4, tab: "Relabel ladder", pattern: "BFS over strings", fname: "relabel_ladder.py", levelNoun: "code books",
  title: "Relabel the shelf one letter at a time", sig: "start, goal, codes", input: "array", view: "array",
  brief: `<p>A shelf is labelled with the code <code>start</code> and needs to end up as <code>goal</code>. The label printer can only change one letter at a time, and after every change the label must be a code from the approved list <code>codes</code>. All codes have the same length. <code>start</code> doesn’t have to be in the list, but <code>goal</code> does.</p>
<p>Write <code>solve(start, goal, codes)</code> and return how many labels the shortest sequence uses, counting both <code>start</code> and <code>goal</code>. Return <code>0</code> if <code>goal</code> can’t be reached.</p>`,
  show: `The boxes are the approved codes, and every read of <code>codes[i]</code> drops a dot under it. Comparing every code against every other code piles up dots fast. Name your queue <code>queue</code> and your seen set <code>seen</code>.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["queue", "q", "seen", "visited", "steps", "level", "depth", "word", "cur"], panel: ["queue", "q", "steps", "level", "depth", "word", "cur"], arrArg: 2, arrLabel2: "approved codes",
  editor: "random",
  arrayOf: L => L.codes, extraLabel: L => L.start + " → " + L.goal,
  levels(){ return [
    lvl("w1", "Short hop", {start:"CAT", goal:"DOG", codes:["COT","COG","DOG","CAG","DAT"]}),
    lvl("w2", "Classic", {start:"HIT", goal:"COG", codes:["HOT","DOT","DOG","LOT","LOG","COG"]}),
    lvl("w3", "Not approved", {start:"HIT", goal:"COG", codes:["HOT","DOT","DOG","LOT","LOG"]}),
    lvl("w4", "Two routes", {start:"AAAA", goal:"BBBB", codes:["BAAA","BBAA","BBBA","BBBB","ABBB","AABB"]})
  ]; },
  hidden(){
    const a = ladderCodes(mkRng(91), 4, 40), b = ladderCodes(mkRng(92), 5, 45);
    return [lvl("h1", "One step", {start:"AB", goal:"AC", codes:["AC"]}), lvl("h2", "No codes at all", {start:"AB", goal:"CD", codes:[]}),
      lvl("h3", "Dead end", {start:"AAA", goal:"CCC", codes:["AAB","ABB","CCC"]}), lvl("h4", "Forty codes", a), lvl("h5", "Forty-five codes", b),
      lvl("h6", "Start is in the list", {start:"ABC", goal:"ABD", codes:["ABC","ABD"]})];
  },
  ref(L){
    const set = new Set(L.codes); if (!set.has(L.goal)) return 0;
    const seen = new Set([L.start]); let frontier = [L.start];
    for (let d = 1; frontier.length; d++){
      const next = [];
      for (const w of frontier){
        if (w === L.goal) return d;
        for (let i = 0; i < w.length; i++) for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ"){ const v = w.slice(0, i) + ch + w.slice(i + 1); if (set.has(v) && !seen.has(v)){ seen.add(v); next.push(v); } }
      }
      frontier = next;
    }
    return 0;
  },
  case(L){ return {args:[L.start, L.goal, L.codes], arr:[2]}; },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the number of labels in the shortest sequence, or 0.");
    if (ret !== n) return bad("Wrong count", n === 0 ? "You returned " + ret + ", but " + L.goal + " can’t be reached through approved codes, so the answer is 0." : "You returned " + ret + ", but the shortest sequence uses " + n + " labels, counting " + L.start + " and " + L.goal + "." + (ret === n - 1 ? " Count both the first and the last label." : ""));
    return ok("Shortest relabel", n === 0 ? "There’s no way to reach " + L.goal + ", so 0 is right." : "The shortest sequence uses " + n + " labels.");
  },
  budget(L){ return 3 * L.codes.length + 6; },
  tip(run){ return run.wAt.some(w => w && (w.queue || w.q)) ? [] : ["queue"]; },
  random(L){ Object.assign(L, ladderCodes(Math.random, 3, ri(Math.random, 5, 9))); }
};
