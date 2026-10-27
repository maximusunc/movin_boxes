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

Copy a similar file in `js/problems/` (e.g. `topk.js` for an array problem or
`bfs.js` for a grid problem), give it a new `id` and `tier`, then update `brief`, `starter`, `levels()`,
`hidden()` (test cases) and `check()` (grading). Finally, add it to the
`PROBLEMS` list in `js/problems/index.js`.

## Problems

40 problems across five levels. L1 gives starter code with hints; from L3 up, a
correct but brute-force answer fails.

| Level | Patterns |
|---|---|
| L1 Warm-up | BFS, hash map, flood fill, heap, stack, linked list, binary search, two pointers, prefix sums, bit manipulation |
| L2 Fundamentals | Sliding window, monotonic stack, grid DP, intervals, sorting, hashing with strings, tree BFS, Kadane, greedy |
| L3 New grad | Binary search on the answer, Dijkstra, topological sort, BST validation, prefix sum + hash map, rotated binary search, BST LCA, sliding window + hash |
| L4 Mid-level | Union-find, 1D DP, trie, backtracking, linked list rewiring, BFS over extra state, design (LRU cache) |
| L5 Senior | Monotonic deque, two pointers (trapping water), monotonic stack (histogram), 2D DP (edit distance), minimum spanning tree, two heaps |

Inputs can be lists, strings (instrumented like lists, but they keep `str` methods),
grids, binary trees (`node.val/left/right`) and linked lists (`node.val/next`).

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

