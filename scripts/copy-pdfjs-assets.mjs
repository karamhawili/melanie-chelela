// pdf.js needs three things at runtime that a bundler can't inline: its
// worker, the Standard 14 font data (for PDFs that reference Helvetica &
// co. without embedding them) and the CMap tables (CJK text). Copy them
// into public/ so they're served from our own origin — no CDN, no
// bundler-specific `new URL(..., import.meta.url)` handling.
//
// public/pdfjs/ is generated, not committed; see .gitignore.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const pkgPath = require.resolve("pdfjs-dist/package.json");
const pdfjsDir = path.dirname(pkgPath);
const { version } = JSON.parse(await readFile(pkgPath, "utf8"));

const outDir = path.join(process.cwd(), "public", "pdfjs");
const stampPath = path.join(outDir, ".version");

const stamp = await readFile(stampPath, "utf8").catch(() => null);
if (stamp === version) {
  process.exit(0);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await cp(path.join(pdfjsDir, "build", "pdf.worker.min.mjs"), path.join(outDir, "pdf.worker.min.mjs"));
await cp(path.join(pdfjsDir, "standard_fonts"), path.join(outDir, "standard_fonts"), { recursive: true });
await cp(path.join(pdfjsDir, "cmaps"), path.join(outDir, "cmaps"), { recursive: true });

await writeFile(stampPath, version);
console.log(`pdfjs assets → public/pdfjs (v${version})`);
