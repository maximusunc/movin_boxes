import { readColors } from "./canvas.js";
import { code, esc, showVerdict, syncGutter, writeConsole } from "./editor.js";
import { syncEditUI, toggleEdit } from "./floor-editor.js";
import { codeKey, iv, levelKey, progress, renderTabs, saveIv, saveProgress, starterFor, switchTier, tierCur } from "./interview.js";
import { draw, resize, setPlaying, syncTransport, updateSpeedLabel } from "./playback.js";
import { PY, runState, setRunState, startPython } from "./python.js";
import { S } from "./state.js";
import { $, deep, reduceMotion, store } from "./util.js";

function customs(){ return S.P.customKey ? store.get(S.P.customKey, []).map(c => Object.assign(deep(c), {custom:true})) : []; }
export function fillLevelSelect(){
  const sel = $("levelSel"); sel.innerHTML = "";
  const g1 = document.createElement("optgroup"); g1.label = "Example " + (S.P.levelNoun || "inputs");
  S.P.levels().forEach(p => { const o = document.createElement("option"); o.value = p.id; o.textContent = p.name; g1.appendChild(o); });
  sel.appendChild(g1);
  const cs = customs();
  if (cs.length){ const g2 = document.createElement("optgroup"); g2.label = "My " + (S.P.levelNoun || "inputs"); cs.forEach(c => { const o = document.createElement("option"); o.value = c.id; o.textContent = c.name; g2.appendChild(o); }); sel.appendChild(g2); }
  if (S.level && S.level.id === "__edited"){ const o = document.createElement("option"); o.value = "__edited"; o.textContent = "Edited (unsaved)"; sel.appendChild(o); }
  sel.value = S.level ? S.level.id : S.P.levels()[0].id;
}
export function loadLevel(id){
  const L = S.P.levels().concat(customs()).find(l => l.id === id) || S.P.levels()[0];
  S.level = deep(L);
  store.set(levelKey(S.P), S.level);
  clearRun(); resize(); fillLevelSelect(); syncEditUI();
}
function validLevel(p, L){
  if (!L || typeof L !== "object") return false;
  const ex = p.levels()[0];
  return Object.keys(ex).every(k => L[k] !== undefined && (Array.isArray(ex[k]) === Array.isArray(L[k])));
}
export function switchProblem(p){
  if (S.editing) toggleEdit(false);
  if (S.P && S.level) store.set(codeKey(S.P), code.value);
  S.P = p; store.set("aisle.problem." + tierCur, S.P.id);
  const saved = store.get(levelKey(S.P), null);
  S.level = validLevel(S.P, saved) ? saved : deep(S.P.levels()[0]);
  if (S.level.custom && !customs().some(c => c.id === S.level.id)) S.level = deep(S.P.levels()[0]);
  code.value = store.get(codeKey(S.P), starterFor(S.P)); syncGutter(); code.scrollTop = 0;
  $("briefTitle").textContent = S.P.title;
  $("briefPattern").textContent = S.P.pattern;
  $("briefBody").innerHTML = S.P.brief + `<details class="more"><summary>How the simulation shows your code</summary><p>${S.P.show}</p></details>`;
  $("legend").innerHTML = S.P.legend;
  $("fname").textContent = S.P.fname;
  $("bEdit").textContent = "Edit input";
  $("bEdit").hidden = !!iv || S.P.editor === "none";
  $("submitHint").textContent = "Submit runs " + (S.P.levels().length + S.P.hidden().length) + " tests, " + S.P.hidden().length + " of them hidden.";
  renderTabs(); fillLevelSelect(); clearRun(); resize(); syncEditUI();
}

/* ---------- run state ---------- */
export function clearRun(){
  S.run = null; S.t = 0; setPlaying(false);
  $("verdict").className = "verdict"; $("vTests").innerHTML = "";
  $("phase").textContent = "Ready"; $("phaseSub").textContent = "";
  syncTransport(); draw();
}
function evaluate(L, r, tier){
  if (!r.ok) return {status:"fail", title: r.limit ? "Too slow" : "Your code raised an error", text: r.limit ? r.error : (r.error || "").split("\n").pop()};
  const v = S.P.check(L, r.ret);
  if (v.status === "pass" && S.P.budget){
    const b = S.P.budget(L);
    if (b != null && r.reads > b){
      v.slow = true; v.ratio = r.reads / b;
      if (tier >= 3){ v.status = "fail"; v.title = "Correct, but too slow for L" + tier; v.text = "Right answer, but your code did " + r.reads + " reads, and an efficient solution stays under about " + b + ". From L3 up, the optimal approach is expected."; }
      else { v.status = "long"; v.title = "Correct, but brute force"; v.text += " It took " + r.reads + " reads; an efficient solution stays under about " + b + "."; }
    }
  }
  return v;
}
function prepareRun(r){
  const events = (r.events || []).filter(e => e.k === "read" || e.k === "write" || e.k === "node");
  const n = events.length, vAt = new Array(n), qAt = new Array(n), dAt = new Array(n), wAt = new Array(n);
  let v = null, q = null, d = null, w = null;
  events.forEach((e, i) => { if (e.v) v = e.v; if (e.q) q = e.q; if (e.d) d = e.d; if (e.w) w = e.w; vAt[i] = v; qAt[i] = q; dAt[i] = d; wAt[i] = w; });
  S.run = {events, vAt, qAt, dAt, wAt, ret: r.ret, hasRet: !!r.ok, reads: r.reads, E: n};
  if (S.P.prep) S.P.prep(S.run);
  S.run.verdict = r.ok ? evaluate(S.level, r, S.P.tier) : null;
  S.run.S = S.run.verdict ? (S.P.finalTicks ? S.P.finalTicks(S.run) : 1) : 0;
  S.run.T = S.run.E + S.run.S;
  S.t = 0;
}

/* ---------- running code ---------- */
function payloadFor(cases, trace){
  return JSON.stringify({input: S.P.input, wet: !!S.P.wet, watch: trace ? (S.P.watch || []) : [], sig: S.P.sig, design: S.P.design || null, trace, cases, budget: 60000});
}
function scrollToSim(){
  if (window.innerWidth < 900){
    const sim = document.querySelector(".sim"), top = sim.getBoundingClientRect().top;
    if (top < -40 || top > 80) sim.scrollIntoView({behavior: reduceMotion() ? "auto" : "smooth", block: "start"});
  }
}
export function doRun(){
  if (runState === "running"){ if (PY.canStop()) PY.kill("Stopped. You pressed Stop before your code finished."); return; }
  if (runState !== "ready" || !PY.ready) return;
  if (S.editing) toggleEdit(false);
  setPlaying(false); S.runKind = "run"; setRunState("running"); scrollToSim();
  const forP = S.P, forLevel = S.level;
  PY.run(code.value, payloadFor([S.P.case(S.level)], true)).then(res => {
    if (runState === "running") setRunState(PY.ready ? "ready" : "loading");
    if (S.P !== forP || S.level !== forLevel) return;
    $("vTests").innerHTML = "";
    if (res.stopped || res.compileError){
      S.run = null; S.t = 0; syncTransport(); draw();
      writeConsole([{text: res.error || res.compileError, cls: "err"}]);
      showVerdict({title: res.stopped ? "Run stopped" : "Your code didn’t start", text: res.stopped ? res.error : "Fix the error shown in the output below."});
      $("verdict").className = "verdict show fail"; return;
    }
    const r = res.results[0];
    const parts = [];
    if (r.stdout) parts.push({text: r.stdout.replace(/\n$/, "")});
    (r.events || []).filter(e => e.k === "warn").forEach(e => parts.push({text: "Warning: " + e.msg, cls: "warn"}));
    if (r.error) parts.push({text: r.error, cls: "err"});
    prepareRun(r);
    if (r.ok && S.run.E > 0 && S.P.tip){ const miss = S.P.tip(S.run); if (miss.length){ const s = miss.join(" and "); parts.push({text: "Tip: name your variables " + s + " to see " + (/ and /.test(s) ? "them" : "it") + " in the simulation.", cls: "warn"}); } }
    writeConsole(parts);
    if (S.run.verdict){
      const v = S.run.verdict;
      showVerdict(v, v.status === "pass" ? " Submit to run the hidden tests." : "");
    } else showVerdict({title: r.limit ? "Too slow" : "Your code raised an error", text: r.limit ? r.error : "See the output below for the line that failed."});
    if (S.run.T > 0){ if (reduceMotion()) S.t = S.run.T; else setPlaying(true); }
    syncTransport(); draw();
    if (!S.run.verdict || S.run.T === 0) $("verdict").className = "verdict show " + (S.run.verdict ? S.run.verdict.status : "fail");
  });
}
$("bRun").onclick = doRun;

function doSubmit(){
  if (runState !== "ready" || !PY.ready) return;
  if (S.editing) toggleEdit(false);
  setPlaying(false); S.runKind = "submit"; setRunState("running");
  const forP = S.P;
  const tests = S.P.levels().map(L => ({L, label: "Example: " + L.name})).concat(S.P.hidden().map(L => ({L, label: "Hidden: " + L.name})));
  PY.run(code.value, payloadFor(tests.map(x => S.P.case(x.L)), false)).then(res => {
    if (runState === "running") setRunState(PY.ready ? "ready" : "loading");
    if (S.P !== forP) return;
    S.run = null; S.t = 0; syncTransport(); draw();
    $("phase").textContent = "Submitted"; $("phaseSub").textContent = "";
    if (res.stopped || res.compileError){
      writeConsole([{text: res.error || res.compileError, cls: "err"}]);
      showVerdict({title: res.stopped ? "Submission stopped" : "Your code didn’t start", text: res.stopped ? res.error : "Fix the error shown in the output below."});
      $("vTests").innerHTML = ""; $("verdict").className = "verdict show fail";
      if (iv && res.stopped) recordSubmission(0, tests.length, false);
      return;
    }
    const out = tests.map((x, i) => Object.assign({label: x.label}, evaluate(x.L, res.results[i], S.P.tier)));
    const pass = out.filter(v => v.status === "pass").length, long = out.filter(v => v.status === "long").length;
    const allPass = pass + long === out.length, slow = out.some(v => v.slow);
    const longs = out.filter(v => v.status === "long").sort((a, b) => (b.ratio || 0) - (a.ratio || 0));
    const firstBad = out.find(v => v.status === "fail") || longs[0];
    const stdout = res.results.map(r => r.stdout).filter(Boolean).join("").replace(/\n$/, "");
    writeConsole([{text: stdout}, firstBad && firstBad.status === "fail" ? {text: firstBad.label + ": " + firstBad.text, cls: "err"} : {}]);
    const title = allPass && !long ? "All " + out.length + " tests passed" : allPass ? "All tests pass, with a note" : pass + " of " + out.length + " tests passed";
    showVerdict({title, text: allPass && !long ? (iv ? "Nice work. This counts toward your interview rating." : "Solved. This problem is marked done for L" + S.P.tier + ".") : (firstBad.label + ". " + firstBad.title + ". " + firstBad.text)});
    $("vTests").innerHTML = out.map(v => `<li class="${v.status}"><i>${v.status === "pass" ? "✓" : v.status === "long" ? "!" : "✗"}</i>${esc(v.label)}</li>`).join("");
    $("verdict").className = "verdict show " + (allPass && !long ? "pass" : allPass ? "long" : "fail");
    if (allPass && !slow){ progress.solved[S.P.id] = true; saveProgress(); }
    if (iv) recordSubmission(pass + long, out.length, allPass, slow);
    renderTabs();
  });
}
function recordSubmission(pass, total, allPass, slow){
  if (!iv) return;
  (iv.subs[S.P.id] = iv.subs[S.P.id] || []).push({pass, total, allPass, slow: !!slow, at: Date.now()});
  saveIv();
  const doneAll = iv.pids.every(id => (iv.subs[id] || []).some(s => s.allPass && !s.slow));
  if (doneAll){ const b = $("bEndIv"); if (b){ b.classList.add("ready"); b.textContent = "Both solved: finish interview"; } }
}
$("bSubmit").onclick = doSubmit;

/* ---------- theme ---------- */
$("bTheme").onclick = () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark"; store.set("aisle.theme", root.dataset.theme);
  readColors(); draw();
};
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); draw(); });

/* ---------- init ---------- */
const th = store.get("aisle.theme", null); if (th) document.documentElement.dataset.theme = th;
$("speed").value = store.get("aisle.speed", 45); updateSpeedLabel();
readColors();
code.value = "";
switchTier(tierCur);
new ResizeObserver(() => resize()).observe($("floorWrap"));
window.addEventListener("resize", resize);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw());
startPython();
