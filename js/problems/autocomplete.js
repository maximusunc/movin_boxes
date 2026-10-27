import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: catalog search box (design: trie) ---------- */
const WORDS = ["bolt","box","boxcar","bracket","brace","cable","cap","case","clamp","clip","crate","dolly","drum","hook","hose","lid","pallet","pail","pin","plug","rack","rope","screw","seal","shelf","sheet","strap","tape","tarp","tray"];
function pickSet(rng, n){ const s = new Set(); while (s.size < n){ const w = WORDS[ri(rng, 0, WORDS.length - 1)]; s.add(rng() < .5 ? w : w + "xyz"[ri(rng, 0, 2)]); } return [...s].sort(() => rng() - .5); }
export const AutocompleteProblem = {
  id: "autocomplete", tier: 4, tab: "Search box", pattern: "Design: trie", fname: "search_box.py", levelNoun: "catalogs",
  title: "Suggest parts as they type", sig: "", design: "AutocompleteSystem", input: "array", view: "array",
  brief: `<p>The parts catalog is a list of lowercase <code>products</code>. As a picker types into the search box, it should suggest matching products.</p>
<p>Write a class <code>AutocompleteSystem(products)</code> with <code>suggest(prefix)</code>, which returns up to three products that start with <code>prefix</code>, in alphabetical order (an empty list if none match). Build a trie in the constructor, reading the catalog once, so each suggestion is fast however big the catalog gets.</p>`,
  show: `The boxes are the catalog, and each read drops a dot under it. Name your trie root <code>self.root</code> to see it in the panel.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  skeleton: `class AutocompleteSystem:
    def __init__(self, products):
        pass

    def suggest(self, prefix):
        pass
`,
  watch: ["root", "trie"], panel: ["root", "trie"], arrArg: 0, arrLabel2: "catalog",
  editor: "random",
  arrayOf: L => L.products, extraLabel: L => "typed: " + L.ops.map(o => JSON.stringify(o[1])).join(" "),
  levels(){ return [
    lvl("c1", "Hardware aisle", {products:["mobile","mouse","moneypot","monitor","mousepad"], ops:[["suggest","m"],["suggest","mo"],["suggest","mou"],["suggest","mous"],["suggest","mouse"]]}),
    lvl("c2", "Nothing matches", {products:["crate","cable","clip"], ops:[["suggest","d"],["suggest","c"],["suggest","cr"],["suggest","cx"]]}),
    lvl("c3", "A whole word is a prefix", {products:["box","boxcar","bolt","bracket"], ops:[["suggest","b"],["suggest","bo"],["suggest","box"],["suggest","boxc"]]})
  ]; },
  hidden(){
    const rng = mkRng(121), cat = pickSet(rng, 40), typed = [];
    for (let k = 0; k < 6; k++){ const w = cat[ri(rng, 0, cat.length - 1)]; for (let j = 1; j <= Math.min(4, w.length); j++) typed.push(["suggest", w.slice(0, j)]); }
    return [lvl("h1", "Empty prefix", {products:["tray","tape","tarp","strap"], ops:[["suggest",""]]}), lvl("h2", "One product", {products:["pallet"], ops:[["suggest","p"],["suggest","pallets"],["suggest","pallet"]]}),
      lvl("h3", "Forty products", {products: cat, ops: typed})];
  },
  ref(L){ const s = L.products.slice().sort(); return L.ops.map(([, p]) => s.filter(w => w.startsWith(p)).slice(0, 3)); },
  case(L){ return {init: [L.products], arr: [0], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      const r = ret[i];
      if (!Array.isArray(r) || r.length !== want[i].length || r.some((w, k) => w !== want[i][k])) return bad("Wrong suggestions", "For " + JSON.stringify(L.ops[i][1]) + " you suggested " + pyRepr(r) + ", but it should be " + pyRepr(want[i]) + ".");
    }
    return ok("Suggestions right", "All " + want.length + " searches suggest the right products.");
  },
  budget(L){ return 2 * L.products.length + 6; },
  showRet(ret){ return pyRepr(ret); },
  tip(){ return []; },
  random(L){ L.products = pickSet(Math.random, ri(Math.random, 5, 8)); const w = L.products[0]; L.ops = Array.from({length: Math.min(4, w.length)}, (_, j) => ["suggest", w.slice(0, j + 1)]); }
};
