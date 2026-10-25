import { S } from "./state.js";
import { $ } from "./util.js";

/* ---------- Python runtime: Web Worker first, main thread as fallback ---------- */
const BRYTHON = ["https://cdn.jsdelivr.net/npm/brython@3.14.3/brython.min.js", "https://cdn.jsdelivr.net/npm/brython@3.14.3/brython_stdlib.js"];
const TIME_LIMIT = 10000;
let HARNESS = "";   // Python source of harness.py, fetched by startPython()
const WORKER_SRC = `
self.onmessage = function(e){
  var m = e.data;
  if (m.type === "init"){
    try{
      importScripts(m.urls[0], m.urls[1]);
      try{ brython({debug:1}); }catch(err){}
      __BRYTHON__.runPythonSource(m.harness, {});
      if (typeof self.pyRun !== "function") throw new Error("harness did not load");
      self.postMessage({type:"ready"});
    }catch(err){ self.postMessage({type:"fail", msg:String(err && err.message || err)}); }
  } else if (m.type === "run"){
    var out;
    try{ out = self.pyRun(m.code, m.payload); }
    catch(err){ out = JSON.stringify({compileError:"The Python runtime failed: " + (err && err.message || err)}); }
    self.postMessage({type:"result", id:m.id, json:out});
  }
};`;
export const PY = {
  mode: null, worker: null, ready: false, job: null, seq: 0, initTimer: 0, blobUrl: null,
  start(){
    if (window.Worker && !this.noWorker) this.startWorker(); else this.startMain();
  },
  startWorker(){
    this.ready = false; this.mode = "worker"; setRunState("loading");
    try{
      this.blobUrl = this.blobUrl || URL.createObjectURL(new Blob([WORKER_SRC], {type:"text/javascript"}));
      const w = new Worker(this.blobUrl);
      this.worker = w;
      w.onmessage = e => this.onMessage(e.data);
      w.onerror = e => { e.preventDefault && e.preventDefault(); if (!this.ready) this.workerFailed(); };
      w.postMessage({type:"init", urls:BRYTHON, harness:HARNESS});
      clearTimeout(this.initTimer);
      this.initTimer = setTimeout(() => { if (!this.ready && this.worker === w) this.workerFailed(); }, 40000);
    }catch(e){ this.workerFailed(); }
  },
  workerFailed(){
    clearTimeout(this.initTimer);
    if (this.worker){ try{ this.worker.terminate(); }catch(e){} this.worker = null; }
    if (this.mode === "main") return;
    this.noWorker = true; this.startMain();
  },
  startMain(){
    this.mode = "main"; this.ready = false; setRunState("loading");
    if (window.pyReady){ this.ready = true; setRunState("ready"); return; }
    const load = (src, cb) => { const s = document.createElement("script"); s.src = src; s.onload = cb; s.onerror = () => setRunState("failed"); document.head.appendChild(s); };
    load(BRYTHON[0], () => load(BRYTHON[1], () => {
      try{
        try{ brython({debug:1}); }catch(e){}
        __BRYTHON__.runPythonSource(HARNESS, {});
      }catch(e){ console.error(e); }
      if (window.pyReady){ this.ready = true; setRunState("ready"); } else setRunState("failed");
    }));
  },
  onMessage(m){
    if (m.type === "ready"){ clearTimeout(this.initTimer); this.ready = true; setRunState("ready"); }
    else if (m.type === "fail"){ this.workerFailed(); }
    else if (m.type === "result" && this.job && m.id === this.job.id){
      const j = this.job; this.job = null; clearTimeout(j.timer);
      let res; try{ res = JSON.parse(m.json); }catch(e){ res = {compileError:"Couldn’t read the result from Python."}; }
      j.resolve(res);
    }
  },
  run(code, payload){
    return new Promise(resolve => {
      if (this.mode === "worker"){
        const id = ++this.seq;
        this.job = {id, resolve, timer: setTimeout(() => this.kill("Stopped after " + (TIME_LIMIT/1000) + " seconds. Your code may be stuck in a loop that never ends."), TIME_LIMIT)};
        this.worker.postMessage({type:"run", id, code, payload});
      } else {
        setTimeout(() => {
          let res;
          try{ res = JSON.parse(window.pyRun(code, payload)); }
          catch(e){ res = {compileError:"The Python runtime failed: " + (e && e.message || e)}; }
          resolve(res);
        }, 30);
      }
    });
  },
  canStop(){ return this.mode === "worker" && !!this.job; },
  kill(msg){
    const j = this.job; this.job = null;
    if (j){ clearTimeout(j.timer); j.resolve({stopped:true, error:msg}); }
    if (this.worker){ try{ this.worker.terminate(); }catch(e){} this.worker = null; }
    this.startWorker();
  }
};
export let runState = "loading";
export function setRunState(s){
  runState = s;
  const b = $("bRun"), lab = $("runLabel"), hint = $("runHint"), sb = $("bSubmit");
  const live = s === "running";
  b.classList.toggle("stop", live && PY.mode === "worker");
  sb.disabled = s !== "ready";
  if (s === "loading"){ b.disabled = true; lab.textContent = PY.worker === null && PY.mode === "worker" ? "Restarting Python…" : "Loading Python…"; }
  else if (s === "ready"){ b.disabled = false; lab.textContent = "Run"; $("submitLabel").textContent = "Submit"; hint.textContent = PY.mode === "worker" ? "" : "Long loops may freeze the page in this browser."; }
  else if (live){ b.disabled = PY.mode !== "worker"; lab.textContent = PY.mode === "worker" ? "Stop" : "Running…"; if (S.runKind === "submit") $("submitLabel").textContent = "Testing…"; }
  else if (s === "failed"){ b.disabled = true; lab.textContent = "Python didn’t load"; hint.textContent = "Reload the page to try again."; }
}

/* =====================================================================
   Tiers, progress and mock interviews
   ===================================================================== */

export function startPython(){
  fetch(new URL("../harness.py", import.meta.url))
    .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(src => { HARNESS = src; PY.start(); })
    .catch(err => { console.error("Couldn’t load harness.py", err); setRunState("failed"); });
}
