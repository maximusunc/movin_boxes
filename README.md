# Aisle Runner

Interview practice you can watch: write Python in the browser and see your
algorithm drive a warehouse robot (grid BFS/Dijkstra, belts, trees, and more).

Python runs client-side via [Brython](https://brython.info/) loaded from jsDelivr.

## Files

- `index.html`: page markup
- `styles.css`: all styles, including light/dark theme tokens
- `harness.py`: Python harness that runs inside Brython. It instruments
  inputs, records reads/writes for the replay, and executes `solve()` against
  test cases
- `js/`: native ES modules, no build step
  - `main.js`: entry point; problem/level switching, Run/Submit, startup
  - `state.js`: mutable state shared across modules (`S.P`, `S.level`, `S.run`, ...)
  - `util.js`, `canvas.js`: small helpers and shared canvas drawing
  - `python.js`: loads Brython and the harness (Web Worker, with a main-thread fallback)
  - `interview.js`: tiers, timed interview mode, progress and scoring
  - `playback.js`, `editor.js`, `floor-editor.js`: replay controls, code
    editor, and the input/floor editor
  - `views/`: one canvas view per input kind (grid, belt, array, intervals, graph, tree, chain for
    linked lists, speed). Generic views take hooks from the problem; see the comment at the top of
    `views/graph.js`, `views/intervals.js` and `views/chain.js`
  - `problems/`: one file per problem, registered in `problems/index.js`

### Adding a problem

Copy a similar file in `js/problems/` (e.g. `topk.js` for an array problem, `bfs.js` for a
grid, `bst.js` for a tree, `reverse.js` for a linked list, `minstack.js` for a design class),
give it a new `id` and `tier`, then update `brief`, `starter`, `levels()`, `hidden()` (test
cases), `check()` (grading) and `budget()` (the read limit). Add it to `PROBLEMS` and to a
topic in `TOPICS`, both in `js/problems/index.js`, and add a reference solution in
`tests/solutions/<id>.py` (plus `<id>.slow.py` to check that brute force gets flagged).

## Problems

117 problems across five levels (L1 15, L2 28, L3 28, L4 27, L5 19). L1 gives starter
code with hints; from L3 up, a correct but brute-force answer fails. At each level the
problem bar can be filtered by topic:

| Topic | Covers |
|---|---|
| Arrays & hashing | hash maps, prefix sums, anagram grouping, prefix sum + hash map |
| Two pointers & windows | two pointers, sliding windows, trapping water |
| Stacks | matching, monotonic stack and deque, path cleanup, calculators, decoding |
| Heaps | top-k, quickselect alternative, running median, task cooldown |
| Sorting & searching | binary search (plain, rotated, on the answer, two lists), custom sort, merge sort, partitioning |
| Linked lists | reversing, loops (fast and slow pointers), merging two and k lists, reordering |
| Trees & tries | DFS and BFS, BST checks, LCA, diameter, construction, DP on trees, max path sum, tries |
| Graphs | BFS (multi-source, over extra state, bitmask), flood fill, Dijkstra, Bellman-Ford, topological sort, cycles, bipartite, union-find, MST, bridges, Eulerian paths |
| Dynamic programming | 1D, grid, knapsack and subset sum, LIS, LCS, edit distance, word break, state machines, interval DP |
| Backtracking | subsets, combinations, permutations, parentheses, word search, N-Queens, Sudoku |
| Greedy & intervals | jump game, partition labels, merging and scheduling intervals, gas station, skyline |
| Strings | run-length encoding, palindromes, pattern matching (KMP / rolling hash), text justification |
| Math & bits | XOR, GCD, sieve, geometry, combinatorics, fast exponentiation |
| Simulation | spiral, rotation, Game of Life |
| Design | min stack, iterators, LRU and LFU caches, time-based store, randomized set, snapshot array, autocomplete, segment / Fenwick tree |

Inputs can be lists, strings (instrumented like lists, but they keep `str` methods),
grids, binary trees (`node.val/left/right`, and `TreeNode` to build your own), linked
lists (`node.val/next`, optionally looping), or a class you write for design problems.

## Run locally

`app.js` fetches `harness.py` at startup, so the page must be served over HTTP
(opening `index.html` directly from disk won't load Python):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Originally published as a Claude artifact:
https://claude.ai/artifact/QMV17TMWzFFbG7jTt6nFLm

## Tests

`tests/run.cjs` opens the app in headless Chromium and, for every problem, submits
the reference solution in `tests/solutions/<id>.py` and checks that it passes every
example and hidden test without page errors. Where a `<id>.slow.py` exists, it also
checks that the brute-force version is flagged (a note at L1–L2, a failure from L3 up).

```sh
npm install
npx playwright install chromium
npm test                # every problem
npm test -- pair bst    # just these
```

**Spoiler warning:** `tests/solutions/` contains working solutions to every problem.

`tests/shots.cjs OUT_DIR id ...` saves screenshots of the simulation panel mid-run and
at the end, which is handy when changing a view.

