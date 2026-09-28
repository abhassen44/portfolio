import React from "react";
import { portfolioConfig } from "../../config/portfolio";
import { ArrowUp } from "lucide-react";

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Identity & Copyright */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold tracking-tight text-[#111827] dark:text-white font-mono">
              {portfolioConfig.name}
            </div>
            <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
              © {new Date().getFullYear()} {portfolioConfig.name}. Designed with solid geometric principles & dynamic GitHub data.
            </p>
          </div>

          {/* Quick links & Back to top */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href={portfolioConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#166534] dark:text-[#22C55E] font-semibold hover:underline transition-colors"
            >
              Resume
            </a>
            <span aria-hidden="true" className="text-[#DDE8E1] dark:text-[#1B3022]">/</span>
            <a
              href={portfolioConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#166534] dark:hover:text-[#22C55E] transition-colors"
            >
              GitHub
            </a>
            <span aria-hidden="true" className="text-[#DDE8E1] dark:text-[#1B3022]">/</span>
            <a
              href={portfolioConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#166534] dark:hover:text-[#22C55E] transition-colors"
            >
              LinkedIn
            </a>
            <span aria-hidden="true" className="text-[#DDE8E1] dark:text-[#1B3022]">/</span>
            <button
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1 text-[#166534] dark:text-[#22C55E] hover:underline cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
