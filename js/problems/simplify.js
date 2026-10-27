import { bad, lvl, ok, pyRepr, ri } from "../util.js";

/* ---------- L2: tidy the shelf address (stack) ---------- */
const tidy = p => { const st = []; for (const part of p.split("/")){ if (!part || part === ".") continue; if (part === "..") st.pop(); else st.push(part); } return "/" + st.join("/"); };
export const SimplifyProblem = {
  id: "simplify", tier: 2, tab: "Tidy address", pattern: "Stack", fname: "tidy_address.py", levelNoun: "addresses",
  title: "Tidy the shelf address", sig: "address", input: "array", view: "array",
  brief: `<p>Shelf addresses are written like file paths: <code>/A/B/C</code> means zone A, aisle B, shelf C. Hand-typed addresses get messy. Repeated slashes count as one, <code>.</code> means “stay here”, and <code>..</code> means “go up one level” (going up from the top stays at the top). Any other part, even <code>...</code>, is a real name.</p>
<p>Write <code>solve(address)</code> and return the tidy address: it starts with one <code>/</code>, has single slashes between names, and no trailing slash. The top level on its own is <code>"/"</code>.</p>`,
  show: `Every character read drops a dot under it (splitting the string with <code>address.split("/")</code> doesn’t show reads). Name your stack <code>stack</code> to watch the levels go on and come off.`,
  legend: `<span><i class="sw flash"></i>Reading now</span><span><i class="sw dot"></i>One read</span>`,
  watch: ["stack", "st", "parts", "part", "name", "i", "j"], pointers: ["i", "j"], panel: ["stack", "st", "parts", "part", "name"], arrArg: 0, arrLabel2: "address",
  editor: "random",
  arrayOf: L => [...L.address],
  levels(){ return [lvl("p1", "Messy slashes", {address:"/A//B/./C/../D/"}), lvl("p2", "Up from the top", {address:"/../"}), lvl("p3", "Long names", {address:"/zone4/aisle12/../aisle13/./bin7"}), lvl("p4", "Three dots is a name", {address:"/a/.../b/.."})]; },
  hidden(){
    const long = "/" + Array.from({length:20}, (_, i) => i % 4 === 3 ? ".." : i % 5 === 4 ? "." : "bay" + i).join("//") + "/";
    return [lvl("h1", "Just the top", {address:"/"}), lvl("h2", "Many slashes", {address:"//////"}), lvl("h3", "Up past the top", {address:"/a/../../b/../c//.//"}),
      lvl("h4", "Dots inside names", {address:"/.hidden/x.y/..z"}), lvl("h5", "Long address", {address:long})];
  },
  case(L){ return {args:[L.address], arr:[0]}; },
  check(L, ret){
    const want = tidy(L.address);
    if (typeof ret !== "string") return bad("Check the return value", "solve() returned " + pyRepr(ret) + ". Return the tidy address as a string.");
    if (ret !== want) return bad("Not tidy yet", "Expected " + JSON.stringify(want) + ", but got " + JSON.stringify(ret) + "." + (ret.length > 1 && ret.endsWith("/") ? " Drop the trailing slash." : !ret.startsWith("/") ? " The address should start with /." : ""));
    return ok("Address tidied", JSON.stringify(L.address) + " tidies to " + JSON.stringify(want) + ".");
  },
  budget(L){ return 3 * L.address.length + 4; },
  showRet(ret){ return JSON.stringify(ret); },
  tip(run){ return run.wAt.some(w => w && (w.stack || w.st)) ? [] : ["stack"]; },
  random(L){
    const parts = Array.from({length: ri(Math.random, 3, 6)}, () => { const r = Math.random(); return r < .2 ? ".." : r < .35 ? "." : r < .45 ? "" : "ABCD"[ri(Math.random, 0, 3)] + ri(Math.random, 1, 9); });
    L.address = "/" + parts.join("/") + (Math.random() < .5 ? "/" : "");
  }
};
