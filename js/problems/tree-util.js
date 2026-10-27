import { ri } from "../util.js";

/* ---------- helpers for tree problems ----------
   Trees are stored like the harness reads them: level order with None gaps. */
export function buildTree(vals){
  if (!vals.length || vals[0] === null) return null;
  const nodes = vals.map((v, i) => v === null ? null : {id: i, v, l: null, r: null}), q = [nodes[0]]; let i = 1;
  while (q.length && i < vals.length){ const c = q.shift(); if (i < vals.length){ c.l = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } if (i < vals.length){ c.r = nodes[i]; if (nodes[i]) q.push(nodes[i]); i++; } }
  return nodes[0];
}
export const height = n => n ? 1 + Math.max(height(n.l), height(n.r)) : 0;
export const countNodes = vals => vals.filter(v => v !== null).length;
// A seeded random number generator for fixed hidden tests.
export const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// {v, l, r} objects -> level order with gaps (trailing gaps trimmed)
export function levelOrder(root){
  const out = [], q = [root];
  while (q.length){ const n = q.shift(); out.push(n ? n.v : null); if (n){ q.push(n.l); q.push(n.r); } }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
// A BST from inserting keys in order.
export function bstOf(keys){
  if (!keys.length) return [];
  const root = {v: keys[0], l: null, r: null};
  keys.slice(1).forEach(k => { let n = root; for (;;){ const side = k < n.v ? "l" : "r"; if (!n[side]){ n[side] = {v: k, l: null, r: null}; break; } n = n[side]; } });
  return levelOrder(root);
}
// Keys lo..hi in an insertion order that gives a perfectly balanced BST.
export const balancedKeys = (lo, hi) => { const keys = [], go = (a, b) => { if (a > b) return; const m = (a + b) >> 1; keys.push(m); go(a, m - 1); go(m + 1, b); }; go(lo, hi); return keys; };
// A random shape with n nodes; val(k) gives the k-th value.
export function randomShape(rng, n, val){
  if (!n) return [];
  const root = {v: val(0), l: null, r: null}, all = [root];
  for (let k = 1; k < n; k++){
    for (;;){ const p = all[ri(rng, 0, all.length - 1)], side = rng() < .5 ? "l" : "r"; if (!p[side]){ p[side] = {v: val(k), l: null, r: null}; all.push(p[side]); break; } }
  }
  return levelOrder(root);
}
// A chain hanging off one side ("l" or "r"), or zigzagging ("zig").
export function chainOf(n, val, side){
  const root = {v: val(0), l: null, r: null}; let c = root;
  for (let k = 1; k < n; k++){ const s = side === "zig" ? (k % 2 ? "l" : "r") : side; c[s] = {v: val(k), l: null, r: null}; c = c[s]; }
  return levelOrder(root);
}
// A complete tree of n nodes (heap layout, no gaps).
export const completeOf = (n, val) => Array.from({length: n}, (_, k) => val(k));
