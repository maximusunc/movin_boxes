import { codeKey, starterFor } from "./interview.js";
import { doRun } from "./main.js";
import { S } from "./state.js";
import { $, store } from "./util.js";

/* ---------- verdict + console ---------- */
export function showVerdict(v, extra){
  $("vTitle").textContent = v.title; $("vText").textContent = v.text + (extra || "");
  $("vStats").innerHTML = "";
}
export function esc(s){ return String(s).replace(/[&<>]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch])); }
export function writeConsole(parts){
  const html = parts.filter(p => p.text).map(p => '<span class="' + (p.cls || "") + '">' + esc(p.text) + "</span>").join("\n");
  $("out").innerHTML = html || '<span class="empty">No output. Use print() to log values while you work.</span>';
}

/* ---------- editor ---------- */
export const code = $("code"), gutter = $("gutter");
export function syncGutter(){
  const n = code.value.split("\n").length;
  let s = ""; for (let i = 1; i <= n; i++) s += i + "\n";
  gutter.textContent = s; gutter.scrollTop = code.scrollTop;
}
let saveTimer = 0;
code.addEventListener("input", () => { syncGutter(); clearTimeout(saveTimer); const k = codeKey(S.P); saveTimer = setTimeout(() => store.set(k, code.value), 300); });
code.addEventListener("scroll", () => { gutter.scrollTop = code.scrollTop; });
function insertText(txt){
  if (!document.execCommand || !document.execCommand("insertText", false, txt)){
    const a = code.selectionStart, b = code.selectionEnd;
    code.value = code.value.slice(0, a) + txt + code.value.slice(b);
    code.selectionStart = code.selectionEnd = a + txt.length;
    code.dispatchEvent(new Event("input"));
  }
}
code.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter"){ e.preventDefault(); doRun(); return; }
  if (e.key === "Tab" && !e.shiftKey){ e.preventDefault(); insertText("    "); return; }
  if (e.key === "Tab" && e.shiftKey){
    e.preventDefault();
    const a = code.selectionStart, ls = code.value.lastIndexOf("\n", a - 1) + 1;
    const m = code.value.slice(ls).match(/^ {1,4}/);
    if (m){ code.setSelectionRange(ls, ls + m[0].length); insertText(""); const p = Math.max(ls, a - m[0].length); code.setSelectionRange(p, p); }
    return;
  }
  if (e.key === "Enter" && !e.shiftKey && !e.altKey){
    const a = code.selectionStart, ls = code.value.lastIndexOf("\n", a - 1) + 1;
    const line = code.value.slice(ls, a);
    let ind = (line.match(/^\s*/) || [""])[0];
    if (/:\s*(#.*)?$/.test(line)) ind += "    ";
    e.preventDefault(); insertText("\n" + ind);
  }
});
let resetArmed = 0;
$("bReset").onclick = () => {
  if (code.value !== starterFor(S.P) && Date.now() - resetArmed > 3000){
    resetArmed = Date.now(); $("bReset").textContent = "Tap again to replace your code";
    setTimeout(() => { if (Date.now() - resetArmed >= 3000) $("bReset").textContent = "Reset code"; }, 3100);
    return;
  }
  resetArmed = 0; $("bReset").textContent = "Reset code";
  code.value = starterFor(S.P); syncGutter(); store.set(codeKey(S.P), code.value);
};
