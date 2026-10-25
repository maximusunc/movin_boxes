export const $ = id => document.getElementById(id);
export const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
export const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const fmt = p => "(" + p[0] + ", " + p[1] + ")";
export const same = (a, b) => a[0] === b[0] && a[1] === b[1];
export const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
export function mkRng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
export function parseMap(map, wet){
  const grid = [], s = [0,0], t = [0,0];
  map.forEach((row, r) => grid.push([...row].map((ch, c) => {
    if (ch === "S"){ s[0]=r; s[1]=c; }
    if (ch === "T"){ t[0]=r; t[1]=c; }
    if (wet) return ch === "#" ? -1 : ch === "~" ? 5 : 1;
    return ch === "#" ? 1 : 0;
  })));
  return {grid, start:s, target:t};
}
export const lvl = (id, name, obj) => Object.assign({id, name}, obj);
export const deep = o => JSON.parse(JSON.stringify(o));
export const isIntArr = (x, n) => Array.isArray(x) && (n == null || x.length === n) && x.every(v => typeof v === "number" && Number.isInteger(v));
export const pyRepr = v => v === null ? "None" : v === true ? "True" : v === false ? "False" : Array.isArray(v) ? "[" + v.map(pyRepr).join(", ") + "]" : typeof v === "object" ? "a " + (v.__t || "value") : String(v);
export const bad = (title, text) => ({status:"fail", title, text});
export const ok = (title, text, extra) => Object.assign({status:"pass", title, text}, extra || {});
