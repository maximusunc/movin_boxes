// Screenshots the simulation panel for the given problems, mid-run and at the end.
//   node tests/shots.cjs OUT_DIR id [id ...]     (same BRYTHON_DIR option as run.cjs)
const fs = require("fs"), path = require("path"), http = require("http");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, ".."), [out, ...ids] = process.argv.slice(2);
(async () => {
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, new URL(q.url, "http://x").pathname.replace(/\/$/, "/index.html")); if (!fs.existsSync(f)){ r.writeHead(404); r.end(); return; } r.writeHead(200, {"Content-Type": {".js": "text/javascript", ".html": "text/html", ".css": "text/css"}[path.extname(f)] || "text/plain"}); fs.createReadStream(f).pipe(r); });
  await new Promise(r => srv.listen(0, "127.0.0.1", r));
  const b = await chromium.launch(), ctx = await b.newContext({viewport: {width: 1280, height: 1000}, reducedMotion: "reduce", colorScheme: process.env.DARK ? "dark" : "light"});
  if (process.env.BRYTHON_DIR) await ctx.route("https://cdn.jsdelivr.net/**", r => r.fulfill({path: path.join(process.env.BRYTHON_DIR, r.request().url().split("/").pop()), contentType: "text/javascript"}));
  await ctx.route("https://fonts.**", r => r.abort());
  await ctx.addInitScript(() => { localStorage.setItem("aisle.progress", JSON.stringify({unlocked: 5, best: {}, solved: {}})); });
  const p = await ctx.newPage(); p.on("pageerror", e => console.log("PAGE ERROR", e.message));
  await p.goto("http://127.0.0.1:" + srv.address().port + "/");
  await p.waitForFunction(() => !document.getElementById("bRun").disabled, null, {timeout: 90000});
  for (const id of ids){
    await p.evaluate(async id => { const {PROBLEMS} = await import("/js/problems/index.js"); (await import("/js/main.js")).switchProblem(PROBLEMS.find(x => x.id === id)); }, id);
    const sol = path.join(__dirname, "solutions", id + ".py");
    if (fs.existsSync(sol)){
      await p.evaluate(c => { const el = document.getElementById("code"); el.value = c; el.dispatchEvent(new Event("input")); }, fs.readFileSync(sol, "utf8"));
      await p.click("#bRun");
      await p.waitForFunction(() => document.getElementById("verdict").classList.contains("show") && !document.getElementById("bRun").disabled, null, {timeout: 60000});
      await p.evaluate(() => { const s = document.getElementById("scrub"); s.value = Math.floor(+s.max * 0.45); s.dispatchEvent(new Event("input")); });
      await p.locator(".sim").screenshot({path: path.join(out, id + "-mid.png")});
      await p.evaluate(() => { const s = document.getElementById("scrub"); s.value = s.max; s.dispatchEvent(new Event("input")); });
    }
    await p.locator(".sim").screenshot({path: path.join(out, id + "-end.png")});
  }
  await b.close(); srv.close();
})();
