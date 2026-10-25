import { cv } from "./canvas.js";
import { levelKey } from "./interview.js";
import { clearRun, fillLevelSelect, loadLevel } from "./main.js";
import { draw, resize } from "./playback.js";
import { S } from "./state.js";
import { $, deep, same, store } from "./util.js";
import { refBFS } from "./views/grid.js";

/* ---------- input editors ---------- */
let tool = "shelf", paintVal = null;
const isGridP = () => S.P.view === "grid";
export function toggleEdit(on){
  S.editing = on; $("bEdit").setAttribute("aria-pressed", on);
  $("bEdit").textContent = on ? "Done editing" : "Edit input";
  $("editBar").classList.toggle("show", on && isGridP());
  $("beltEdit").classList.toggle("show", on && !isGridP());
  cv.classList.toggle("editing", on && isGridP());
  if (on){
    const tools = S.P.editTools || ["shelf", "start", "target"];
    document.querySelectorAll(".tool").forEach(b => b.hidden = !tools.includes(b.dataset.tool));
    if (!tools.includes(tool)) document.querySelector('.tool[data-tool="shelf"]').click();
    clearRun();
  }
  syncEditUI();
}
$("bEdit").onclick = () => toggleEdit(!S.editing);
document.querySelectorAll(".tool").forEach(b => b.onclick = () => {
  tool = b.dataset.tool; document.querySelectorAll(".tool").forEach(x => x.setAttribute("aria-pressed", x === b));
});
export function syncEditUI(){
  if (!S.level || !S.P) return;
  if (isGridP()){
    $("rowsN").textContent = S.level.grid.length; $("colsN").textContent = S.level.grid[0].length;
    $("bDelete").hidden = !S.level.custom; $("bSave").hidden = !S.P.customKey;
  } else {
    const arr = S.P.editor === "array";
    $("wField").hidden = !arr; $("lField").hidden = !arr || !S.P.lim;
    if (arr){
      $("wLab").textContent = S.P.arrLabel; $("lLab").textContent = S.P.limLabel || "";
      if (document.activeElement !== $("wIn")) $("wIn").value = S.level[S.P.arr].join(", ");
      if (S.P.lim && document.activeElement !== $("limIn")) $("limIn").value = S.level[S.P.lim];
    }
  }
}
function edited(){
  if (S.P.customKey && S.level.custom){
    const cs = store.get(S.P.customKey, []); const i = cs.findIndex(c => c.id === S.level.id);
    if (i >= 0){ const c = deep(S.level); delete c.custom; cs[i] = c; store.set(S.P.customKey, cs); }
  } else if (S.level.id !== "__edited"){ S.level.id = "__edited"; S.level.name = "Edited"; fillLevelSelect(); }
  store.set(levelKey(S.P), S.level);
}
function paint(p){
  if (!p) return;
  const [r, c] = p, V = S.P.vals;
  if (tool === "shelf" || tool === "wet"){
    if (tool === "shelf" && S.P.robot && (same(p, S.level.start) || same(p, S.level.target)) && !S.P.fixCorners) return;
    const on = tool === "shelf" ? V.shelf : V.wet;
    if (paintVal === null) paintVal = S.level.grid[r][c] === on ? V.open : on;
    if (S.level.grid[r][c] === paintVal) return;
    S.level.grid[r][c] = paintVal;
  } else if (tool === "start"){
    if (same(p, S.level.target)) return;
    S.level.start = [r, c]; if (S.P.isShelf(S.level.grid[r][c])) S.level.grid[r][c] = V.open;
  } else {
    if (same(p, S.level.start)) return;
    S.level.target = [r, c]; if (S.P.isShelf(S.level.grid[r][c])) S.level.grid[r][c] = V.open;
  }
  edited(); draw();
}
const evCell = e => { const b = cv.getBoundingClientRect(); return S.P.cellAt(e.clientX - b.left, e.clientY - b.top); };
cv.addEventListener("pointerdown", e => { if (!S.editing || !isGridP()) return; e.preventDefault(); cv.setPointerCapture(e.pointerId); paintVal = null; paint(evCell(e)); });
cv.addEventListener("pointermove", e => { if (!S.editing || !isGridP() || !cv.hasPointerCapture(e.pointerId)) return; paint(evCell(e)); });
cv.addEventListener("pointerup", () => { paintVal = null; });
document.querySelectorAll("[data-size]").forEach(b => b.onclick = () => {
  const k = b.dataset.size, G = S.level.grid; let R = G.length, C = G[0].length;
  if (k === "r+" && R < 16) G.push(Array(C).fill(S.P.vals.open));
  if (k === "r-" && R > 1) G.pop();
  if (k === "c+" && C < 16) G.forEach(row => row.push(S.P.vals.open));
  if (k === "c-" && C > 1) G.forEach(row => row.pop());
  R = G.length; C = G[0].length;
  if (S.P.fixCorners) S.P.fixCorners(S.level);
  else if (S.P.robot){
    const fit = p => [Math.min(p[0], R-1), Math.min(p[1], C-1)];
    S.level.start = fit(S.level.start); S.level.target = fit(S.level.target);
    if (same(S.level.start, S.level.target) && R*C > 1) S.level.target = S.level.start[1] > 0 ? [S.level.start[0], S.level.start[1]-1] : S.level.start[0] > 0 ? [S.level.start[0]-1, 0] : [0, 1 % C];
    [S.level.start, S.level.target].forEach(p => { if (S.P.isShelf(G[p[0]][p[1]])) G[p[0]][p[1]] = S.P.vals.open; });
  }
  edited(); syncEditUI(); resize();
});
$("bClear").onclick = () => { S.level.grid.forEach(row => row.fill(S.P.vals.open)); edited(); draw(); };
$("bRandom").onclick = () => {
  const R = S.level.grid.length, C = S.level.grid[0].length, V = S.P.vals;
  for (let tries = 0; tries < 40; tries++){
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) S.level.grid[r][c] = Math.random() < (V.wet ? .2 : .3) ? V.shelf : V.open;
    if (V.wet){
      const blobs = 2 + Math.floor(Math.random() * 3);
      for (let b = 0; b < blobs; b++){
        const cr = Math.floor(Math.random()*R), cc = Math.floor(Math.random()*C), rad = 1 + Math.random()*1.6;
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (Math.hypot(r-cr, c-cc) <= rad && S.level.grid[r][c] === V.open) S.level.grid[r][c] = V.wet;
      }
    }
    if (S.P.fixCorners){ S.P.fixCorners(S.level); S.level.grid[0][0] = V.open; S.level.grid[R-1][C-1] = V.open; break; }
    if (!S.P.robot) break;
    S.level.start = [Math.floor(Math.random()*R), Math.floor(Math.random()*Math.ceil(C/3))];
    S.level.target = [Math.floor(Math.random()*R), C - 1 - Math.floor(Math.random()*Math.ceil(C/3))];
    S.level.grid[S.level.start[0]][S.level.start[1]] = V.open; S.level.grid[S.level.target[0]][S.level.target[1]] = V.open;
    if (!same(S.level.start, S.level.target) && refBFS(S.level, S.P.isShelf).d > Math.max(R, C)) break;
  }
  edited(); draw();
};
$("bSave").onclick = () => {
  const cs = store.get(S.P.customKey, []);
  let n = cs.length + 1; while (cs.some(c => c.name === "My floor " + n)) n++;
  const c = deep(S.level); c.id = "c" + Date.now().toString(36); c.name = "My floor " + n; delete c.custom;
  cs.push(c); store.set(S.P.customKey, cs);
  S.level = Object.assign(deep(c), {custom:true}); store.set(levelKey(S.P), S.level); fillLevelSelect(); syncEditUI();
  $("bSave").textContent = "Saved as " + c.name;
  setTimeout(() => $("bSave").textContent = "Save as new floor", 1800);
};
$("bDelete").onclick = () => {
  if (!S.level.custom) return;
  store.set(S.P.customKey, store.get(S.P.customKey, []).filter(c => c.id !== S.level.id));
  toggleEdit(false); loadLevel(S.P.levels()[0].id);
};
function applyArrayInputs(){
  const nums = $("wIn").value.split(/[\s,]+/).filter(Boolean).map(Number);
  const lim = Number($("limIn").value);
  let msg = "";
  if (!nums.length || nums.some(x => !Number.isInteger(x) || x < 1 || x > S.P.maxV)) msg = S.P.arrLabel + " must be whole numbers from 1 to " + S.P.maxV + ".";
  else if (nums.length > S.P.maxN) msg = "Use at most " + S.P.maxN + " values.";
  else if (S.P.lim && (!Number.isInteger(lim) || lim < 1 || lim > 999)) msg = S.P.limLabel + " must be a whole number from 1 to 999.";
  else if (S.P.limAtLeastN && lim < nums.length) msg = "The shift needs at least one minute per aisle (" + nums.length + ").";
  $("beltMsg").textContent = msg;
  if (msg) return;
  S.level[S.P.arr] = nums; if (S.P.lim) S.level[S.P.lim] = lim; edited(); resize();
}
let beltTimer = 0;
["wIn", "limIn"].forEach(id => $(id).addEventListener("input", () => { clearTimeout(beltTimer); beltTimer = setTimeout(applyArrayInputs, 250); }));
$("bBeltRandom").onclick = () => { if (S.P.random){ S.P.random(S.level); $("beltMsg").textContent = ""; edited(); syncEditUI(); resize(); } };
$("levelSel").onchange = e => { if (e.target.value !== "__edited") loadLevel(e.target.value); };
