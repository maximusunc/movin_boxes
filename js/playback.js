import { ctx, cv } from "./canvas.js";
import { S } from "./state.js";
import { $, store } from "./util.js";
import { drawArray, sizeArray } from "./views/array.js";
import { drawChain, sizeChain } from "./views/chain.js";
import { drawGraph, sizeGraph } from "./views/graph.js";
import { drawIntervals, sizeIntervals } from "./views/intervals.js";
import { drawTree, sizeTree } from "./views/tree.js";

/* ---------- canvas ---------- */
const VIEWS = {
  array: {size: sizeArray, draw: drawArray}, intervals: {size: sizeIntervals, draw: drawIntervals},
  graph: {size: sizeGraph, draw: drawGraph}, tree: {size: sizeTree, draw: drawTree},
  chain: {size: sizeChain, draw: drawChain}
};
export function resize(){
  if (!S.level || !S.P) return;
  const w = $("floorWrap").clientWidth || 320;
  const [W, H] = S.P.size ? S.P.size(w) : VIEWS[S.P.view].size(w);
  S.dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(W * S.dpr); cv.height = Math.round(H * S.dpr);
  cv.style.width = W + "px"; cv.style.height = H + "px";
  draw();
}
export function draw(){
  if (!S.level || !S.P) return;
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  if (S.P.draw) S.P.draw(); else VIEWS[S.P.view].draw();
}

/* ---------- playback ---------- */
const speedOf = () => Math.round(Math.pow(10, (+$("speed").value)/100 * 2.3));
export function updateSpeedLabel(){ $("speedOut").textContent = speedOf() + " / sec"; }
export function setPlaying(p){
  S.playing = p;
  $("bPlay").setAttribute("aria-label", p ? "Pause" : "Play"); $("bPlay").title = p ? "Pause" : "Play";
  $("playIcon").innerHTML = p ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>' : '<path d="M7 5v14l12-7z"/>';
  if (p){ S.lastTs = 0; requestAnimationFrame(tick); }
}
function tick(ts){
  if (!S.playing || !S.run) return;
  if (!S.lastTs) S.lastTs = ts;
  const dt = Math.min(.1, (ts - S.lastTs) / 1000); S.lastTs = ts;
  const sp = speedOf();
  S.t += dt * (S.t >= S.run.E ? (S.P.finalRate ? S.P.finalRate(sp) : 1.4) : sp);
  if (S.t >= S.run.T){ S.t = S.run.T; setPlaying(false); }
  syncTransport(); draw();
  if (S.playing) requestAnimationFrame(tick);
}
function defaultPhase(){
  if (!S.run.hasRet && S.t >= S.run.T) return ["Stopped", S.run.E + " reads before the error"];
  if (S.t < S.run.E || !S.run.hasRet){
    const idx = Math.min(S.run.E, Math.max(1, Math.ceil(S.t))) - 1;
    return ["Running", "Read " + (idx + 1) + " of " + S.run.E + (S.P.phaseExtra ? S.P.phaseExtra(S.run.wAt[idx]) : "")];
  }
  if (S.P.path && Array.isArray(S.run.ret) && S.run.verdict && S.run.verdict.ref){
    if (S.t < S.run.T) return ["Driving", "Move " + Math.min(S.run.verdict.valid, Math.floor(S.t - S.run.E) + 1) + " of " + Math.max(0, S.run.ret.length - 1)];
    const st = S.run.verdict.status;
    return [!S.run.ret.length ? "Done" : st === "pass" ? "Arrived" : st === "long" ? "Arrived, with a note" : "Stopped", S.run.ret.length ? (S.run.ret.length - 1) + " moves returned" : "Empty path returned"];
  }
  return [S.run.verdict.status === "fail" ? "Not quite" : "Done", S.run.E + " reads"];
}
export function syncTransport(){
  const has = !!S.run && S.run.T > 0;
  ["bRestart","bBack","bPlay","bFwd","scrub"].forEach(id => $(id).disabled = !has);
  if (!S.run){ $("scrub").max = 0; $("scrub").value = 0; return; }
  $("scrub").max = S.run.T; $("scrub").value = Math.floor(S.t);
  const [a, b] = S.P.phase ? S.P.phase() : defaultPhase(); $("phase").textContent = a; $("phaseSub").textContent = b;
  if (S.run.verdict && !S.run.submitView) $("verdict").className = S.t >= S.run.T ? "verdict show " + S.run.verdict.status : "verdict";
}
$("bPlay").onclick = () => { if (!S.run) return; if (S.t >= S.run.T) S.t = 0; setPlaying(!S.playing); };
$("bRestart").onclick = () => { S.t = 0; setPlaying(false); syncTransport(); draw(); };
$("bBack").onclick = () => { if (!S.run) return; setPlaying(false); S.t = Math.max(0, Math.ceil(S.t) - 1); syncTransport(); draw(); };
$("bFwd").onclick = () => { if (!S.run) return; setPlaying(false); S.t = Math.min(S.run.T, Math.floor(S.t) + 1); syncTransport(); draw(); };
$("scrub").oninput = e => { setPlaying(false); S.t = +e.target.value; syncTransport(); draw(); };
$("speed").oninput = () => { updateSpeedLabel(); store.set("aisle.speed", +$("speed").value); };
