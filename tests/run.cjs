// Submits a reference solution for every problem in a headless browser and checks that it
// passes all of that problem's tests, without page errors.
//
//   node tests/run.cjs                 # every problem that has tests/solutions/<id>.py
//   node tests/run.cjs pair bst        # just these problems
//
// tests/solutions/<id>.slow.py, when present, is a correct but brute-force solution: it must
// still produce correct answers, and from L3 up the budget must reject it as too slow.
//
// Needs Playwright (npm install). Brython loads from jsDelivr; set BRYTHON_DIR to a folder
// holding brython.min.js and brython_stdlib.js to serve it locally instead.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, ".."), SOL = path.join(__dirname, "solutions");
const TYPES = {".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".py": "text/plain"};

function serve(){
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    const file = p.endsWith(path.sep) ? path.join(p, "index.html") : p;
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){ res.writeHead(404); res.end(); return; }
    res.writeHead(200, {"Content-Type": TYPES[path.extname(file)] || "application/octet-stream"});
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => srv.listen(0, "127.0.0.1", () => r(srv)));
}

async function submit(page, src){
  await page.evaluate(code => { const el = document.getElementById("code"); el.value = code; el.dispatchEvent(new Event("input")); }, src);
  await page.click("#bSubmit");
  await page.waitForFunction(() => document.getElementById("phase").textContent === "Submitted" && !document.getElementById("bSubmit").disabled, null, {timeout: 60000});
  return page.evaluate(() => ({
    title: document.getElementById("vTitle").textContent, text: document.getElementById("vText").textContent,
    cls: document.getElementById("verdict").className,
    tests: [...document.querySelectorAll("#vTests li")].map(li => li.className + " " + li.textContent)
  }));
}
async function runOnce(page, src){
  await page.evaluate(code => { const el = document.getElementById("code"); el.value = code; el.dispatchEvent(new Event("input")); }, src);
  await page.click("#bRun");
  await page.waitForFunction(() => document.getElementById("verdict").classList.contains("show") && !document.getElementById("bRun").disabled, null, {timeout: 60000});
  // step through the replay so every frame of the view gets drawn at least once
  await page.evaluate(() => { const s = document.getElementById("scrub"), max = +s.max; for (let t = 0; t <= max; t += Math.max(1, Math.floor(max / 60))){ s.value = t; s.dispatchEvent(new Event("input")); } s.value = max; s.dispatchEvent(new Event("input")); });
  return page.evaluate(() => document.getElementById("vTitle").textContent);
}

(async () => {
  const only = process.argv.slice(2);
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport: {width: 1280, height: 900}, reducedMotion: "reduce"});
  if (process.env.BRYTHON_DIR) await ctx.route("https://cdn.jsdelivr.net/**", r => r.fulfill({path: path.join(process.env.BRYTHON_DIR, r.request().url().split("/").pop()), contentType: "text/javascript"}));
  await ctx.route("https://fonts.**", r => r.abort());
  await ctx.addInitScript(() => { if (!sessionStorage.getItem("t")){ localStorage.clear(); localStorage.setItem("aisle.progress", JSON.stringify({unlocked: 5, best: {}, solved: {}})); sessionStorage.setItem("t", "1"); } });
  const page = await ctx.newPage(), errors = [];
  page.on("pageerror", e => errors.push(e.stack || e.message));
  await page.goto("http://127.0.0.1:" + port + "/");
  await page.waitForFunction(() => !document.getElementById("bRun").disabled, null, {timeout: 90000});
  const problems = await page.evaluate(async () => (await import("/js/problems/index.js")).PROBLEMS.map(p => ({id: p.id, tier: p.tier, tab: p.tab})));
  let failed = 0, ran = 0;
  const missing = [];
  for (const p of problems){
    if (only.length && !only.includes(p.id)) continue;
    const file = path.join(SOL, p.id + ".py");
    if (!fs.existsSync(file)){ missing.push(p.id); continue; }
    ran++;
    await page.evaluate(async id => { const {PROBLEMS} = await import("/js/problems/index.js"); const {switchProblem} = await import("/js/main.js"); switchProblem(PROBLEMS.find(x => x.id === id)); }, p.id);
    errors.length = 0;
    const src = fs.readFileSync(file, "utf8");
    const runTitle = await runOnce(page, src);
    const res = await submit(page, src);
    const good = /verdict show pass/.test(res.cls) && !errors.length;
    let line = (good ? "ok   " : "FAIL ") + "L" + p.tier + " " + p.id.padEnd(10) + " run: " + runTitle + " | submit: " + res.title;
    if (!good){ failed++; line += "\n       " + res.text + (errors.length ? "\n       page errors:\n         " + errors.join("\n         ") : ""); }
    const slowFile = path.join(SOL, p.id + ".slow.py");
    if (fs.existsSync(slowFile)){
      errors.length = 0;
      const s = await submit(page, fs.readFileSync(slowFile, "utf8"));
      // Brute force must be correct (no ✗ other than "too slow") and must not count as efficient.
      const wrong = s.tests.filter(t => t.startsWith("fail")).length;
      const flagged = p.tier >= 3 ? wrong > 0 && /too slow|Too slow/.test(s.text) : /verdict show long/.test(s.cls);
      const sgood = flagged && !errors.length;
      line += "\n     " + (sgood ? "ok  " : "FAIL") + " brute force: " + s.title + " (" + s.text.slice(0, 140) + ")";
      if (!sgood) failed++;
    }
    console.log(line);
  }
  if (missing.length && !only.length) console.log("no solution file: " + missing.join(", "));
  console.log(ran + " problems checked, " + failed + " failure" + (failed === 1 ? "" : "s"));
  await browser.close(); srv.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
