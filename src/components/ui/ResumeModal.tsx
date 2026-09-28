import React, { useEffect, useState } from "react";
import { X, ExternalLink, Download, FileText, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { portfolioConfig } from "../../config/portfolio";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setZoom(1);
      setImgError(false);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] bg-[#0E1510] border border-[#166534] dark:border-[#22C55E] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-3 bg-[#0A120D] border-b border-[#1B3022]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#166534] text-white dark:bg-[#22C55E] dark:text-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white">
                Abhas_Sen_Resume.pdf
              </h3>
              <p className="text-[10px] font-mono text-[#A7B0AA]">
                Verified Resume · IIIT Guwahati (CSE)
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 bg-[#132017] border border-[#1B3022] text-xs font-mono text-white">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.6}
                className="p-1 hover:text-[#22C55E] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-[11px] font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2.0}
                className="p-1 hover:text-[#22C55E] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 hover:text-[#22C55E] border-l border-[#1B3022] pl-1.5"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href="/Abhas_Sen_Resume.pdf"
              download="Abhas_Sen_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-[#132017] hover:bg-[#1B3022] border border-[#1B3022] hover:border-[#22C55E] transition-colors"
              title="Download PDF file"
            >
              <Download className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Google Drive Link */}
            <a
              href={portfolioConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-black bg-[#22C55E] hover:bg-[#16a34a] transition-colors"
              title="Open Google Drive document"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Drive</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#A7B0AA] hover:text-white border border-transparent hover:border-[#1B3022] transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewing Area */}
        <div className="flex-1 w-full h-full bg-[#050805] overflow-auto flex justify-center p-4 sm:p-6 select-none custom-scrollbar">
          <div
            className="transition-transform duration-150 origin-top flex flex-col items-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {!imgError ? (
              <div className="shadow-2xl border border-[#1B3022] bg-white rounded-none overflow-hidden max-w-full">
                <img
                  src="/resume_preview.png"
                  alt="Abhas Sen Resume"
                  className="w-[780px] max-w-full h-auto block select-auto pointer-events-auto"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="w-[780px] max-w-full h-[1000px] bg-white text-black p-8 shadow-2xl flex flex-col items-center justify-center gap-4 text-center">
                <FileText className="w-12 h-12 text-[#166534]" />
                <h4 className="text-lg font-bold font-mono">Abhas Sen — Resume</h4>
                <p className="text-xs text-gray-600 max-w-md">
                  Click below to view the verified PDF document or open directly in Google Drive.
                </p>
                <div className="flex gap-3">
                  <a
                    href="/Abhas_Sen_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#166534] text-white text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Open PDF Tab
                  </a>
                  <a
                    href={portfolioConfig.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Google Drive
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2 bg-[#0A120D] border-t border-[#1B3022] flex items-center justify-between text-[11px] font-mono text-[#A7B0AA]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>Abhas Sen · B.Tech CSE (IIIT Guwahati)</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/Abhas_Sen_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C55E] hover:underline"
            >
              Open raw PDF in tab
            </a>
            <span aria-hidden="true">·</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
