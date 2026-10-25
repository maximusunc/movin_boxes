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
  - `views/`: one canvas view per input kind (grid, belt, array, intervals, graph, tree, speed)
  - `problems/`: one file per problem, registered in `problems/index.js`

### Adding a problem

Copy a similar file in `js/problems/` (e.g. `topk.js` for an array problem or
`bfs.js` for a grid problem), give it a new `id` and `tier`, then update `brief`, `starter`, `levels()`,
`hidden()` (test cases) and `check()` (grading). Finally, add it to the
`PROBLEMS` list in `js/problems/index.js`.

## Run locally

`app.js` fetches `harness.py` at startup, so the page must be served over HTTP
(opening `index.html` directly from disk won't load Python):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Originally published as a Claude artifact:
https://claude.ai/artifact/QMV17TMWzFFbG7jTt6nFLm
