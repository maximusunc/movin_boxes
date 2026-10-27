import { bad, lvl, mkRng, ok, pyRepr, ri } from "../util.js";

/* ---------- L4: shelf snapshots (design: versioned array) ---------- */
function randomOps(rng, n, len){
  const ops = []; let snaps = 0;
  for (let i = 0; i < n; i++){
    const r = rng();
    if (r < .45) ops.push(["set", ri(rng, 0, len - 1), ri(rng, 1, 99)]);
    else if (r < .65){ ops.push(["snap"]); snaps++; }
    else if (snaps) ops.push(["get", ri(rng, 0, len - 1), ri(rng, 0, snaps - 1)]);
  }
  return ops;
}
export const SnapshotProblem = {
  id: "snapshot", tier: 4, tab: "Shelf snapshots", pattern: "Design + binary search", fname: "shelf_snapshots.py", levelNoun: "audits",
  title: "Photograph the shelf counts", sig: "", design: "SnapshotArray", input: "array", view: "array",
  brief: `<p>A row of <code>length</code> shelf slots each holds a count, starting at <code>0</code>. Every so often the auditor takes a snapshot, and later asks what a slot held in a given snapshot.</p>
<p>Write a class <code>SnapshotArray(length)</code> with <code>set(i, val)</code>; <code>snap()</code>, which returns the snapshot’s id (<code>0</code> for the first, then <code>1</code>, and so on); and <code>get(i, snap_id)</code>, which returns slot <code>i</code>’s value at that snapshot. Don’t copy the whole row on every snap: store only the changes, and binary search them in <code>get</code>.</p>`,
  show: `Each box is one call: <code>2=5</code> is <code>set(2, 5)</code>, <code>snap</code> is <code>snap()</code> and <code>2@0?</code> is <code>get(2, 0)</code>. Name your per-slot history <code>self.history</code> to watch it.`,
  legend: `<span><i class="sw flash"></i>Just called</span>`,
  skeleton: `class SnapshotArray:
    def __init__(self, length):
        pass

    def set(self, i, val):
        pass

    def snap(self):
        pass

    def get(self, i, snap_id):
        pass
`,
  watch: ["history", "hist", "data", "changes", "snap_id", "snaps", "sid"], panel: ["history", "hist", "data", "changes", "snap_id", "snaps", "sid"], arrArg: "ops", arrLabel2: "calls",
  editor: "random",
  arrayOf: L => L.ops.map(o => o[0] === "set" ? o[1] + "=" + o[2] : o[0] === "snap" ? "snap" : o[1] + "@" + o[2] + "?"), extraLabel: L => "length " + L.length,
  levels(){ return [
    lvl("a1", "First audit", {length:3, ops:[["set",0,5],["snap"],["set",0,6],["get",0,0],["get",1,0],["snap"],["get",0,1]]}),
    lvl("a2", "Snaps with no changes", {length:2, ops:[["snap"],["snap"],["set",1,4],["snap"],["get",1,0],["get",1,1],["get",1,2]]}),
    lvl("a3", "Overwrite before a snap", {length:4, ops:[["set",2,3],["set",2,8],["snap"],["set",2,1],["get",2,0],["snap"],["get",2,1],["get",3,1]]})
  ]; },
  hidden(){ return [lvl("h1", "One slot", {length:1, ops:[["snap"],["get",0,0]]}),
    lvl("h2", "Many snaps, few changes", {length:5, ops:[["set",4,9]].concat(Array.from({length:20}, () => ["snap"])).concat([["get",4,0],["get",4,19],["set",4,1],["snap"],["get",4,19],["get",4,20]])}),
    lvl("h3", "Seventy calls", {length:6, ops:randomOps(mkRng(91), 70, 6)}), lvl("h4", "Long row", {length:500, ops:randomOps(mkRng(93), 60, 500)})]; },
  ref(L){ const cur = Array(L.length).fill(0), snaps = []; return L.ops.map(([op, a, b]) => { if (op === "set"){ cur[a] = b; return null; } if (op === "snap"){ snaps.push(cur.slice()); return snaps.length - 1; } return snaps[b][a]; }); },
  case(L){ return {init: [L.length], ops: L.ops}; },
  check(L, ret){
    const want = this.ref(L);
    if (!Array.isArray(ret) || ret.length !== want.length) return bad("Check your class", "Expected one result per call.");
    for (let i = 0; i < want.length; i++){
      if (want[i] === null) continue;
      if (ret[i] !== want[i]) return bad("Wrong answer", "Call " + i + ", " + L.ops[i][0] + "(" + L.ops[i].slice(1).join(", ") + "), returned " + pyRepr(ret[i]) + " but should return " + want[i] + ".");
    }
    return ok("Snapshots line up", "Every snap() id and get() value is right.");
  },
  showRet(ret){ return Array.isArray(ret) ? pyRepr(ret.filter(x => x !== null)) : pyRepr(ret); },
  tip(run){ return run.wAt.some(w => w && (w.history || w.hist || w.data || w.changes)) ? [] : ["self.history"]; },
  random(L){ L.length = ri(Math.random, 2, 5); L.ops = [["snap"]].concat(randomOps(Math.random, ri(Math.random, 6, 10), L.length)); }
};
