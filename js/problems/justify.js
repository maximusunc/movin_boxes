import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: print the shelf labels (text justification) ---------- */
function justify(words, width){
  const out = []; let i = 0;
  while (i < words.length){
    let j = i, len = 0;
    while (j < words.length && len + words[j].length + (j - i) <= width){ len += words[j].length; j++; }
    const gaps = j - i - 1;
    if (j === words.length || gaps === 0) out.push(words.slice(i, j).join(" ").padEnd(width));
    else {
      const sp = width - len, each = Math.floor(sp / gaps), extra = sp % gaps;
      let line = ""; for (let k = i; k < j; k++){ line += words[k]; if (k < j - 1) line += " ".repeat(each + (k - i < extra ? 1 : 0)); }
      out.push(line);
    }
    i = j;
  }
  return out;
}
const vis = s => JSON.stringify(s.replace(/ /g, "·"));
const LOREM = "pallets of fresh fruit arrive at dawn and must be stacked by noon so the evening crew can load every truck before the gates close at nine sharp while the night shift sweeps aisles".split(" ");
export const JustifyProblem = {
  id: "justify", tier: 4, tab: "Label printer", pattern: "String simulation", fname: "label_printer.py", levelNoun: "notices",
  title: "Justify the notice board", sig: "words, width", input: "array", view: "array",
  brief: `<p>The notice board printer takes a list of <code>words</code> and a line <code>width</code>. Put as many words on each line as fit, with at least one space between words, then pad every line to exactly <code>width</code> characters:</p>
<p>Spread the spaces as evenly as possible between the words; if they don’t divide evenly, the gaps on the left get the extra spaces. A line with a single word, and the last line, are left-justified instead: words separated by one space, then spaces to fill the width. No word is longer than <code>width</code>.</p>
<p>Write <code>solve(words, width)</code> and return the list of lines.</p>`,
  show: `Every <code>words[i]</code> read drops a dot under that word. In error messages, spaces are shown as <code>·</code> so you can count them.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["line", "cur", "res", "out", "lines", "i", "j", "length", "width"], pointers: ["i", "j"], panel: ["line", "cur"], arrArg: 0, arrLabel2: "words",
  editor: "random",
  arrayOf: L => L.words, extraLabel: L => "width " + L.width,
  levels(){ return [lvl("j1", "Short notice", {words:["This","is","an","example","of","text","justification."], width:16}), lvl("j2", "Long words", {words:["What","must","be","acknowledgment","shall","be"], width:16}), lvl("j3", "Uneven gaps", {words:["Load","the","red","truck","first"], width:12})]; },
  hidden(){ return [lvl("h1", "One word", {words:["Hello"], width:8}), lvl("h2", "Words exactly fill a line", {words:["ab","cd","ef"], width:8}), lvl("h3", "Every word on its own line", {words:["alpha","beta","gamma"], width:5}),
    lvl("h4", "Single letters", {words:"a b c d e f g h i j".split(" "), width:3}), lvl("h5", "A long notice", {words:LOREM, width:30}), lvl("h6", "Width 20", {words:LOREM.slice(5, 25), width:20})]; },
  case(L){ return {args:[L.words, L.width], arr:[0]}; },
  check(L, ret){
    const want = justify(L.words, L.width);
    if (!Array.isArray(ret) || ret.some(x => typeof x !== "string")) return bad("Check the return value", "solve() returned " + pyRepr(ret).slice(0, 80) + ". Return a list of strings, one per line.");
    for (let i = 0; i < Math.max(want.length, ret.length); i++){
      if (ret[i] === want[i]) continue;
      if (i >= ret.length) return bad("Missing lines", "You returned " + ret.length + " lines, but the notice needs " + want.length + ". Line " + i + " should be " + vis(want[i]) + ".");
      if (i >= want.length) return bad("Too many lines", "The notice only needs " + want.length + " lines, but you returned " + ret.length + ".");
      const note = ret[i].length !== L.width ? " Yours is " + ret[i].length + " characters long; every line must be exactly " + L.width + "." : "";
      return bad("Line " + i + " is off", "It should be " + vis(want[i]) + ", but yours is " + vis(ret[i]) + "." + note);
    }
    return ok("Notice printed", want.length + " line" + (want.length === 1 ? "" : "s") + ", each exactly " + L.width + " characters.");
  },
  budget(L){ return 3 * L.words.length + 6; },
  showRet(ret){ return Array.isArray(ret) ? ret.map(s => typeof s === "string" ? "[" + s.replace(/ /g, "·") + "]" : pyRepr(s)).join(" ") : pyRepr(ret); },
  tip(){ return []; },
  random(L){ const s = ri(Math.random, 0, LOREM.length - 10); L.words = LOREM.slice(s, s + ri(Math.random, 5, 9)); L.width = ri(Math.random, 10, 20); }
};
