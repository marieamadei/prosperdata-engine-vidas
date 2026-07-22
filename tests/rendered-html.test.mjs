import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the corrected VIDAS proposal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ProsperData Engine \| Proposta VIDAS 2027<\/title>/i);
  assert.match(html, /I modelli vengono scritti in Mentor/);
  assert.match(html, /Cronoprogramma · Gantt annuale/);
  assert.match(html, /BOZZA DI LAVORO/);
  assert.match(html, /Competenze trasversali dedicate al progetto VIDAS/);

  assert.doesNotMatch(html, />81%?</);
  assert.doesNotMatch(html, /Protezione deliverability/);
  assert.doesNotMatch(html, />245k</);
  assert.doesNotMatch(html, /La qualità della decisione/);
});

test("keeps the source reconciled with the team review", async () => {
  const [page, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview", import.meta.url)),
  ]);

  assert.match(page, /ProsperData/);
  assert.match(page, /VIDAS/);
  assert.match(page, /metric: "FEDELTÀ"/);
  assert.match(page, /AREE DEL MODELLO CHE GENERANO LO SCORE/);
  assert.doesNotMatch(page, /metric: "81%"/);
  assert.doesNotMatch(page, /Protezione deliverability/);
  assert.match(layout, /ProsperData Engine \| Proposta VIDAS 2027/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.deepEqual(previewFiles, []);
});
