import type { PDFDocumentProxy } from "pdfjs-dist";

// pdf.js is ~700 KB over the wire, so it is never part of the initial
// bundle: every entry point here imports it on demand and the promise is
// memoised, which also means a plan frame and the lightbox that opens from
// it share one parsed document — the modal has nothing left to fetch.

// Copied into public/ by scripts/copy-pdfjs-assets.mjs at install/build.
const PDFJS_ASSETS = "/pdfjs/";

type PdfjsModule = typeof import("pdfjs-dist");

let modulePromise: Promise<PdfjsModule> | undefined;

function loadPdfjs(): Promise<PdfjsModule> {
  modulePromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS_ASSETS}pdf.worker.min.mjs`;
    return pdfjs;
  });
  return modulePromise;
}

const documents = new Map<string, Promise<PDFDocumentProxy>>();

export function loadPdfDocument(url: string): Promise<PDFDocumentProxy> {
  const cached = documents.get(url);
  if (cached) return cached;

  const pending = loadPdfjs().then((pdfjs) =>
    pdfjs.getDocument({
      url,
      // Standard 14 fonts and CJK tables the worker fetches only when a
      // document actually references them.
      standardFontDataUrl: `${PDFJS_ASSETS}standard_fonts/`,
      cMapUrl: `${PDFJS_ASSETS}cmaps/`,
      cMapPacked: true,
    }).promise
  );

  // A failed fetch shouldn't poison the URL for the rest of the session.
  pending.catch(() => documents.delete(url));
  documents.set(url, pending);
  return pending;
}

/**
 * Caps a render so a very wide plan can't ask for a canvas the browser
 * refuses to allocate — Safari in particular tops out well below the
 * sizes a 2x retina viewport would otherwise request.
 */
export const MAX_CANVAS_EDGE = 4096;
export const MAX_CANVAS_PIXELS = 8_000_000;

export function fitCanvasScale(scale: number, width: number, height: number): number {
  const byEdge = Math.min(MAX_CANVAS_EDGE / width, MAX_CANVAS_EDGE / height);
  const byArea = Math.sqrt(MAX_CANVAS_PIXELS / (width * height));
  return Math.max(0.1, Math.min(scale, byEdge, byArea));
}
