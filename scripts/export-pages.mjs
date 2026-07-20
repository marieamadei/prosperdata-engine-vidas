import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const port = Number(process.env.PAGES_EXPORT_PORT || 4173);
const serverUrl = `http://127.0.0.1:${port}/`;
const vinext = path.join(root, "node_modules", ".bin", "vinext");

const server = spawn(vinext, ["start"], {
  cwd: root,
  env: {
    ...process.env,
    PATH: `${path.dirname(process.execPath)}:${process.env.PATH ?? ""}`,
    PORT: String(port),
    WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
  },
  stdio: "inherit",
});

async function readRenderedPage() {
  let lastError;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) return response.text();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw lastError ?? new Error("Production server did not become ready.");
}

function makeAssetPathsPortable(html) {
  return html
    .replaceAll('href="/', 'href="./')
    .replaceAll('src="/', 'src="./')
    .replaceAll('import("/', 'import("./')
    .replaceAll('\\"/assets/', '\\"./assets/')
    .replaceAll('\\"/vidas.png', '\\"./vidas.png')
    .replaceAll('\\"/dataprosper.png', '\\"./dataprosper.png')
    .replaceAll('\\"/kiwi.png', '\\"./kiwi.png');
}

try {
  const renderedHtml = await readRenderedPage();
  const staticHtml = makeAssetPathsPortable(renderedHtml);

  await rm(path.join(root, "out"), { recursive: true, force: true });
  await cp(path.join(root, "dist", "client"), path.join(root, "out"), {
    recursive: true,
  });
  await mkdir(path.join(root, "out"), { recursive: true });
  await writeFile(path.join(root, "out", "index.html"), staticHtml);
  await writeFile(path.join(root, "out", "404.html"), staticHtml);
  await writeFile(path.join(root, "out", ".nojekyll"), "");
} finally {
  server.kill("SIGTERM");
}
