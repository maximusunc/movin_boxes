# Aisle Runner

Interview practice you can watch: write Python in the browser and see your
algorithm drive a warehouse robot (grid BFS/Dijkstra, belts, trees, and more).

Python runs client-side via [Brython](https://brython.info/) loaded from jsDelivr.

## Files

- `index.html` — page markup
- `styles.css` — all styles, including light/dark theme tokens
- `app.js` — UI, problems, simulation, judging, and the Brython runtime loader
- `harness.py` — Python harness that runs inside Brython: instruments inputs,
  records reads/writes for the replay, and executes `solve()` against test cases

## Run locally

`app.js` fetches `harness.py` at startup, so the page must be served over HTTP
(opening `index.html` directly from disk won't load Python):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Originally published as a Claude artifact:
https://claude.ai/artifact/QMV17TMWzFFbG7jTt6nFLm
