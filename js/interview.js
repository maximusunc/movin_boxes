import { toggleEdit } from "./floor-editor.js";
import { switchProblem } from "./main.js";
import { PROBLEMS } from "./problems/index.js";
import { S } from "./state.js";
import { $, store } from "./util.js";

const TIERS = [
  {n:1, name:"Warm-up", minutes:0, blurb:"Starter code with hints. Brute force passes, with a note."},
  {n:2, name:"Fundamentals", minutes:60, blurb:"Just the function signature. Brute force passes, but costs you in the interview."},
  {n:3, name:"New grad", minutes:45, blurb:"Google’s entry level. Brute force fails: the optimal approach is expected."},
  {n:4, name:"Mid-level", minutes:45, blurb:"Coming next."},
  {n:5, name:"Senior", minutes:45, blurb:"Coming next."}
];
const SIGNALS = ["Strong No Hire", "No Hire", "Lean No Hire", "Lean Hire", "Hire", "Strong Hire"];
export let progress = Object.assign({unlocked: 1, best: {}, solved: {}}, store.get("aisle.progress", {}));
export let iv = store.get("aisle.interview", null);
export let tierCur = Math.min(store.get("aisle.tier", 1), progress.unlocked);
if (iv) tierCur = iv.tier;
export const saveProgress = () => store.set("aisle.progress", progress);
export const saveIv = () => iv ? store.set("aisle.interview", iv) : store.del("aisle.interview");
const LEVEL_KEY = {grid:"aisle.current", wet:"aisle.current.wet", belt:"aisle.current.belt", speed:"aisle.current.speed"};
export const levelKey = p => LEVEL_KEY[p.id] || "aisle.lvl." + p.id;
export const codeKey = p => iv ? "aisle.iv." + p.id : (p.codeKey || "aisle.code." + p.id);
export const starterFor = p => p.tier === 1 ? p.starter : "def solve(" + p.sig + "):\n    pass\n";
const tierProblems = n => PROBLEMS.filter(p => p.tier === n);
const signalIndex = s => SIGNALS.indexOf(s);

function renderTiers(){
  const nav = $("tiers"); nav.innerHTML = "";
  TIERS.forEach(T => {
    const b = document.createElement("button");
    const locked = T.n > progress.unlocked;
    b.className = "tier"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", T.n === tierCur);
    b.disabled = locked || (iv && iv.tier !== T.n);
    const best = progress.best[T.n];
    const sub = locked ? "Locked" : best ? best : T.n < progress.unlocked ? "Passed" : "Open";
    b.innerHTML = "<b>L" + T.n + "</b><span>" + T.name + "</span><small>" + (locked ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>' : "") + sub + "</small>";
    if (!b.disabled) b.onclick = () => { if (T.n !== tierCur) switchTier(T.n); };
    nav.appendChild(b);
  });
}
export function switchTier(n){
  if (iv && iv.tier !== n) return;
  if (S.editing) toggleEdit(false);
  tierCur = n; store.set("aisle.tier", n);
  const pool = iv ? iv.pids.map(id => PROBLEMS.find(p => p.id === id)) : tierProblems(n);
  document.body.classList.toggle("soon", !pool.length);
  renderTiers(); renderIvBar();
  if (!pool.length){ renderSoon(); return; }
  const want = store.get("aisle.problem." + n, null);
  switchProblem(pool.find(p => p.id === want) || pool[0]);
}
function renderSoon(){
  $("soonBody").innerHTML = `<h2>L${tierCur} is next on the build list</h2>
<p>You’ve unlocked it, and the problems are on the way. L4 and L5 will add the remaining interview patterns, each with a follow-up that unlocks after you solve the first part:</p>
<p>backtracking (pack the truck exactly), one-dimensional DP (fewest boxes for an order), linked lists (re-couple the cart train), union-find (merging warehouse zones), tries (barcode prefixes), and BFS over extra state (knock down shelves, collect every package).</p>`;
}

export function renderTabs(){
  const nav = $("probs"); nav.innerHTML = "";
  const pool = iv ? iv.pids.map(id => PROBLEMS.find(p => p.id === id)) : tierProblems(tierCur);
  pool.forEach(p => {
    const b = document.createElement("button");
    b.className = "prob"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", p === S.P);
    const done = iv ? (iv.subs[p.id] || []).some(s => s.allPass) : progress.solved[p.id];
    b.innerHTML = "<span>" + p.tab + (done ? ' <i class="tick" aria-label="solved">✓</i>' : "") + "</span><small>" + (iv ? "Problem " + (iv.pids.indexOf(p.id) + 1) : p.pattern) + "</small>";
    b.onclick = () => { if (p !== S.P) switchProblem(p); };
    nav.appendChild(b);
  });
}

let ivTimer = 0;
function renderIvBar(){
  const bar = $("ivBar"), T = TIERS[tierCur - 1];
  clearInterval(ivTimer);
  if (!tierProblems(tierCur).length){ bar.innerHTML = ""; bar.hidden = true; return; }
  bar.hidden = false;
  if (!iv){
    const next = tierCur < 5 && progress.unlocked <= tierCur;
    bar.className = "iv-bar";
    bar.innerHTML = `<div class="iv-text"><b>L${tierCur} ${T.name}.</b> ${T.blurb} ${next ? "Get <b>Hire</b> or better in the mock interview to unlock L" + (tierCur + 1) + "." : progress.best[tierCur] ? "Your best mock interview: <b>" + progress.best[tierCur] + "</b>." : ""}</div>
<button class="iv-start" id="bStartIv">Start mock interview</button>`;
    $("bStartIv").onclick = startInterview;
    return;
  }
  bar.className = "iv-bar live";
  bar.innerHTML = `<div class="iv-text"><b>Mock interview, L${iv.tier}.</b> Two problems. <span id="ivClock"></span></div><button class="iv-start" id="bEndIv">Finish interview</button>`;
  $("bEndIv").onclick = () => finishInterview(false);
  const tickClock = () => {
    const el = $("ivClock"); if (!el || !iv) return;
    if (!iv.limit){ const m = Math.floor((Date.now() - iv.start) / 60000); el.textContent = "Untimed, " + m + " min so far."; return; }
    const left = iv.start + iv.limit - Date.now();
    if (left <= 0){ finishInterview(true); return; }
    const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
    el.textContent = m + ":" + String(s).padStart(2, "0") + " left.";
    el.classList.toggle("low", left < 5 * 60000);
  };
  tickClock(); ivTimer = setInterval(tickClock, 1000);
}
function startInterview(){
  const pool = tierProblems(tierCur).slice().sort(() => Math.random() - .5);
  const T = TIERS[tierCur - 1];
  iv = {tier: tierCur, pids: pool.slice(0, 2).map(p => p.id), start: Date.now(), limit: T.minutes * 60000, subs: {}};
  iv.pids.forEach(id => { const p = PROBLEMS.find(x => x.id === id); store.set("aisle.iv." + id, starterFor(p)); });
  saveIv();
  $("out").innerHTML = '<span class="empty">The interview has started. Run checks the example; Submit runs the hidden tests and counts toward your rating.</span>';
  switchTier(tierCur);
}
function problemScore(id){
  const subs = (iv.subs[id] || []);
  if (!subs.length) return {score: 0, note: "Not submitted"};
  const firstGood = subs.findIndex(s => s.allPass && !s.slow);
  if (firstGood >= 0){
    const misses = Math.min(2, firstGood);
    return {score: 4 - .5 * misses, note: "All tests passed, efficient" + (misses ? ", after " + misses + " failed submission" + (misses > 1 ? "s" : "") : " on the first submission")};
  }
  const slow = subs.find(s => s.allPass && s.slow);
  if (slow) return {score: 2.5, note: "All tests passed, but brute force"};
  const best = subs.reduce((a, s) => s.pass / s.total > a.pass / a.total ? s : a, subs[0]);
  const frac = best.pass / best.total;
  return {score: frac >= .5 ? 1.5 : frac > 0 ? 1 : .5, note: best.pass + " of " + best.total + " tests passed"};
}
function finishInterview(timeUp){
  if (!iv) return;
  clearInterval(ivTimer);
  const T = iv.tier, used = Math.round((Date.now() - iv.start) / 60000);
  const rows = iv.pids.map(id => Object.assign({p: PROBLEMS.find(x => x.id === id)}, problemScore(id)));
  const avg = rows.reduce((a, r) => a + r.score, 0) / rows.length;
  const sig = avg >= 3.75 ? "Strong Hire" : avg >= 3 ? "Hire" : avg >= 2.25 ? "Lean Hire" : avg >= 1.5 ? "Lean No Hire" : avg >= .75 ? "No Hire" : "Strong No Hire";
  const prevBest = progress.best[T];
  if (!prevBest || signalIndex(sig) > signalIndex(prevBest)) progress.best[T] = sig;
  const passed = signalIndex(sig) >= signalIndex("Hire");
  let unlockedNow = false;
  if (passed && T < 5 && progress.unlocked <= T){ progress.unlocked = T + 1; unlockedNow = true; }
  saveProgress();
  iv.pids.forEach(id => store.del("aisle.iv." + id));
  iv = null; saveIv();
  const good = signalIndex(sig) >= 4, mid = signalIndex(sig) === 3;
  $("resSignal").textContent = sig; $("resSignal").className = "res-signal " + (good ? "good" : mid ? "mid" : "low");
  $("resLead").textContent = (timeUp ? "Time’s up. " : "") + "L" + T + " mock interview, " + (used < 1 ? "under a minute" : used + " minute" + (used === 1 ? "" : "s")) + ". " +
    (unlockedNow ? "L" + (T + 1) + " is now unlocked." : passed ? "You’ve already unlocked the next level." : "You need Hire or better to unlock L" + (T + 1) + ". Practice, then try again.");
  $("resRows").innerHTML = rows.map(r => `<li><b>${r.p.tab}</b> <span>${r.p.pattern}</span><em>${r.note}</em></li>`).join("");
  $("resNext").hidden = !(passed && T < 5); $("resNext").textContent = "Go to L" + (T + 1);
  $("resNext").onclick = () => { closeResults(); switchTier(T + 1); };
  $("results").hidden = false; $("results").querySelector("button").focus();
  switchTier(T);
}
function closeResults(){ $("results").hidden = true; }
$("resClose").onclick = closeResults;

/* =====================================================================
   Problems and levels
   ===================================================================== */
