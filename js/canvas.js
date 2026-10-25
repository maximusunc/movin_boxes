import { S } from "./state.js";
import { $ } from "./util.js";

export const cv = $("floor"), ctx = cv.getContext("2d");
export const COL = {};
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
export function readColors(){ ["wet","floor","seam","rack","beam","checked","visited","frontier","flash","robot","dock","target","bad","ink","panel","muted","box","box-edge","box-ink","belt","roller"].forEach(k => COL[k] = css("--" + k)); }
export function rr(x, y, w, h, r){ r = Math.max(0, Math.min(r, w/2, h/2)); ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r); ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath(); }
export function drawRobot(r, c, heading){
  const s = S.cell, X = c*s + s/2, Y = r*s + s/2, rad = s*.34;
  ctx.save(); ctx.translate(X, Y); ctx.rotate(heading);
  ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.arc(1.5, 2, rad, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = COL.robot; ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = COL.ink; ctx.globalAlpha = .85; rr(-rad*.45, -rad*.45, rad*.9, rad*.9, rad*.15); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = COL.robot; ctx.beginPath(); ctx.arc(0, 0, rad*.22, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = COL.panel; ctx.beginPath(); ctx.moveTo(rad*.98, 0); ctx.lineTo(rad*.62, -rad*.26); ctx.lineTo(rad*.62, rad*.26); ctx.closePath(); ctx.fill();
  ctx.restore();
}


function chipText(v){
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(Math.round(v * 100) / 100);
  if (typeof v === "string") return v === "inf" ? "∞" : v;
  if (Array.isArray(v)) return "(" + v.map(chipText).join(", ") + ")";
  if (v.n !== undefined) return "node " + (S.treeVals[v.n] !== undefined ? S.treeVals[v.n] : v.n);
  if (v.__d) return "{…}";
  if (v.__s) return "{…}";
  return "?";
}

function watchItems(v){
  if (v && v.__d) return v.__d.map(([k, x]) => chipText(k) + "→" + chipText(x));
  if (v && v.__s) return v.__s.map(chipText);
  if (Array.isArray(v)) return v.map(chipText);
  return null;
}
// Draws rows of watched variables. Returns nothing; uses up to `rows` rows of 28px.
export function drawWatch(x, y, w, watch, names, rows){
  ctx.textBaseline = "middle";
  let row = 0;
  for (const name of names){
    if (row >= rows) break;
    if (!watch || watch[name] === undefined) continue;
    const v = watch[name], cy = y + row*30 + 13;
    ctx.font = "600 12px Barlow, system-ui, sans-serif"; ctx.fillStyle = COL.muted; ctx.textAlign = "left";
    ctx.fillText(name, x, cy);
    let cx = x + 64;
    const items = watchItems(v);
    ctx.font = "500 12px 'JetBrains Mono', ui-monospace, monospace";
    if (items === null){
      ctx.fillStyle = COL.ink; ctx.font = "600 13px 'JetBrains Mono', ui-monospace, monospace"; ctx.fillText(chipText(v), cx, cy);
    } else if (!items.length){
      ctx.fillStyle = COL.muted; ctx.fillText("empty", cx, cy);
    } else {
      for (let i = 0; i < items.length; i++){
        const txt = items[i], tw = ctx.measureText(txt).width + 12;
        if (cx + tw > x + w - 34 && i < items.length){
          ctx.fillStyle = COL.muted; ctx.fillText("+" + (items.length - i), cx + 2, cy); break;
        }
        ctx.fillStyle = COL.floor; rr(cx, cy - 10, tw, 20, 5); ctx.fill();
        ctx.fillStyle = COL.ink; ctx.fillText(txt, cx + 6, cy + 1);
        cx += tw + 4;
      }
    }
    row++;
  }
}
export function resultLine(x, y, w){
  if (!S.run || !S.run.hasRet || S.t < S.run.E) return;
  const v = S.run.verdict;
  ctx.font = "600 14px Barlow, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillStyle = v.status === "pass" ? COL.target : v.status === "long" ? COL.ink : COL.bad;
  let s = "Returned " + (S.P.showRet ? S.P.showRet(S.run.ret) : chipText(S.run.ret));
  while (ctx.measureText(s).width > w && s.length > 10) s = s.slice(0, -2);
  ctx.fillText(s, x, y);
}
export function liveIndex(){
  if (!S.run) return -1;
  return (S.t >= S.run.E ? S.run.E : Math.floor(S.t)) - 1;
}
