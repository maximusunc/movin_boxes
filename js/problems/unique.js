import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L3: longest run of different labels (sliding window + hash) ---------- */
export const UniqueProblem = {
  id: "unique", tier: 3, tab: "Different labels", pattern: "Sliding window + hash", fname: "different_labels.py", levelNoun: "belts",
  title: "Longest run of different labels", sig: "labels", input: "array", view: "array",
  brief: `<p>Packages roll past the scanner, each stamped with a one-letter zone label. <code>labels</code> is a string with one letter per package, in belt order.</p>
<p>Write <code>solve(labels)</code> and return the length of the longest unbroken stretch of packages in which no label repeats.</p>`,
  show: `Every read drops a dot under that package. Name your window ends <code>left</code> and <code>right</code> and a dict <code>last</code> (or a set <code>seen</code>) to watch the window slide. Restarting from every package leaves stacks of dots.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["left", "right", "l", "r", "i", "j", "start", "last", "seen", "window", "best", "longest", "ans", "res"], pointers: ["left", "right", "l", "r", "i", "j", "start"],
  panel: ["last", "seen", "window", "best", "longest", "ans", "res"], arrArg: 0, arrLabel2: "labels",
  editor: "random",
  arrayOf: L => [...L.labels],
  levels(){ return [lvl("u1", "Morning belt", {labels:"ABCABCBB"}), lvl("u2", "Same zone", {labels:"DDDD"}), lvl("u3", "Repeat far back", {labels:"PWWKEW"}), lvl("u4", "Every zone once", {labels:"ABCDEFG"})]; },
  hidden(){
    const rng = mkRng(29), Z = "ABCDEFGHIJ", big = Array.from({length:70}, () => Z[ri(rng, 0, Z.length - 1)]).join("");
    return [lvl("h1", "Empty belt", {labels:""}), lvl("h2", "One package", {labels:"Q"}), lvl("h3", "Repeat inside the window", {labels:"ABBA"}),
      lvl("h4", "Best run at the end", {labels:"AABAB" + "CDEFGH"}), lvl("h5", "Seventy packages, ten zones", {labels:big}),
      lvl("h6", "Every zone, three times over", {labels:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(3)})];
  },
  ref(L){ const last = new Map(); let left = 0, best = 0; [...L.labels].forEach((ch, i) => { if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1; last.set(ch, i); best = Math.max(best, i - left + 1); }); return best; },
  case(L){ return {args:[L.labels], arr:[0]}; },
  check(L, ret){
    const n = this.ref(L);
    if (typeof ret !== "number" || !Number.isInteger(ret)) return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the length as a whole number.");
    if (ret !== n){
      const s = L.labels; let at = 0; for (let i = 0; i + n <= s.length; i++) if (new Set(s.slice(i, i + n)).size === n){ at = i; break; }
      return bad("Wrong length", "You returned " + ret + ", but the longest stretch with no repeated label has " + n + " package" + (n === 1 ? "" : "s") + (n ? ", for example " + JSON.stringify(s.slice(at, at + n)) + "." : "."));
    }
    return ok("Longest run found", "The longest stretch with no repeated label has " + n + " package" + (n === 1 ? "" : "s") + ".");
  },
  // A set-based window reads each label up to about four times (check, add, check again, remove).
  budget(L){ return 4 * L.labels.length + 4; },
  tip(run){ return run.wAt.some(w => w && (w.last || w.seen || w.window)) ? [] : ["last"]; },
  random(L){ const n = ri(Math.random, 6, 12), Z = "ABCDEF".slice(0, ri(Math.random, 3, 6)); L.labels = Array.from({length:n}, () => Z[ri(Math.random, 0, Z.length - 1)]).join(""); }
};
