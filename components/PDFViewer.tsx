"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";

interface PDFViewerProps {
  src: string;
  downloadHref: string;
  downloadFilename: string;
}

export default function PDFViewer({ src, downloadHref, downloadFilename }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current) return;

    // Cancel any ongoing render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const page = await pdfRef.current.getPage(pageNum);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerWidth = container.clientWidth || 780;
    const viewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    const renderTask = page.render({ canvasContext: context, viewport: scaledViewport });
    renderTaskRef.current = renderTask;

    try {
      await renderTask.promise;
      setLoading(false);
    } catch (err: unknown) {
      // Ignore cancelled renders
      if (err instanceof Error && err.message !== "Rendering cancelled") {
        setError(true);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(false);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        await renderPage(1);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPDF();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [src, renderPage]);

  useEffect(() => {
    if (pdfRef.current && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [currentPage, renderPage]);

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  return (
    <div className="bg-white border-2 border-stone-200 overflow-hidden">
      {/* PDF Canvas Area */}
      <div
        ref={containerRef}
        className="relative bg-stone-100 overflow-auto"
        style={{ maxHeight: "700px" }}
      >
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 z-10 min-h-[400px]">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin mb-3" />
            <p className="text-sm text-stone-500">Loading PDF…</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 p-8">
            <AlertCircle className="w-8 h-8 text-stone-400" />
            <p className="text-sm text-stone-500 text-center">
              Could not render PDF inline.
            </p>
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Open PDF
            </a>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ display: error ? "none" : "block" }}
        />
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Page nav */}
        {numPages > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={currentPage <= 1}
              className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-600 font-medium tabular-nums">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={goToNext}
              disabled={currentPage >= numPages}
              className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Download */}
        <a
          href={downloadHref}
          download={downloadFilename}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download full paper
        </a>
      </div>
    </div>
  );
}
