// Mutable state shared across modules. ES module imports are read-only, so
// anything assigned from more than one module lives on this object.
export const S = {
  P: null,          // current problem
  level: null,      // current input for the current problem
  run: null,        // results of the last traced run
  t: 0, playing: false, lastTs: 0,   // playback position and clock
  editing: false,   // floor/input editor open
  cell: 40, dpr: 1, // grid cell size and device pixel ratio for the canvas
  treeVals: [],     // node values of the tree view, by node id
  runKind: "run"    // "run" or "submit" while Python is busy
};
