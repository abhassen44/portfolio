import React, { useEffect, useState } from "react";
import { GitHubRepo } from "../../lib/github/types";
import { fetchRepoReadme } from "../../lib/github/api";
import { formatRelativeDate, getLanguageColor } from "../../lib/github/transform";
import {
  X,
  Star,
  GitFork,
  ExternalLink,
  Github,
  Calendar,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Code,
  Tag,
  BookOpen
} from "lucide-react";

interface ProjectModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ repo, onClose }) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!repo) {
      setReadme(null);
      return;
    }

    let isMounted = true;
    setLoadingReadme(true);

    fetchRepoReadme(repo.owner.login, repo.name).then((data) => {
      if (isMounted) {
        setReadme(data);
        setLoadingReadme(false);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [repo, onClose]);

  if (!repo) return null;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container (Solid colors, no gradients) */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#DDE8E1] dark:border-[#1B3022] overflow-hidden bg-white dark:bg-[#0D1711] shrink-0">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                {repo.owner.login} /
              </div>
              <h2
                id="modal-title"
                className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#111827] dark:text-white"
              >
                {repo.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {repo.isFeatured && (
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 border border-[#166534] dark:border-[#22C55E] text-[#166534] dark:text-[#22C55E]">
                Featured
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA] mb-1">
              Description
            </div>
            <p className="text-sm sm:text-base text-[#111827] dark:text-[#A7B0AA] leading-relaxed">
              {repo.description || "No description provided in GitHub repository."}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022]">
            <div>
              <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                <span>Stars</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-1">
                {repo.stargazers_count}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                <span>Forks</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-1">
                {repo.forks_count}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                <span>Language</span>
              </div>
              <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-1 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span>{repo.language || "Plain Text"}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                <span>Last Push</span>
              </div>
              <div className="text-xs font-bold font-mono text-[#111827] dark:text-white mt-1">
                {formatRelativeDate(repo.pushed_at || repo.updated_at)}
              </div>
            </div>
          </div>

          {/* Topics / Tags (Zero-pill inline typography) */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>GitHub Topics</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-[#166534] dark:text-[#22C55E]">
                {repo.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805]"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Clone Command */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA]">
              Clone Repository
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] font-mono text-xs text-[#111827] dark:text-white">
              <span className="truncate">git clone {repo.html_url}.git</span>
              <button
                onClick={handleCopyClone}
                className="ml-3 p-1 text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#166534] dark:hover:text-[#22C55E] cursor-pointer"
                title="Copy command"
              >
                {copied ? <Check className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* README Section */}
          <div className="space-y-2 pt-2 border-t border-[#DDE8E1] dark:border-[#1B3022]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>README.md Document</span>
              </div>
              {loadingReadme && (
                <span className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                  Fetching from GitHub API...
                </span>
              )}
            </div>

            <div className="p-4 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] font-mono text-xs text-[#111827] dark:text-[#A7B0AA] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
              {loadingReadme ? (
                <div className="text-center py-6 text-[#4B5563] dark:text-[#A7B0AA]">
                  Retrieving repository README via GitHub REST API...
                </div>
              ) : readme ? (
                readme
              ) : (
                <div className="text-[#4B5563] dark:text-[#A7B0AA]">
                  No README found for this repository or README is empty. Visit GitHub to explore source files.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805]">
          <div className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
            {repo.license ? repo.license.name : "Unlicensed / Proprietary"}
          </div>

          <div className="flex items-center gap-3">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider bg-[#166534] text-white hover:bg-[#14532D] dark:bg-[#22C55E] dark:text-black dark:hover:bg-[#16a34a] transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider text-[#111827] dark:text-white bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Open on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
