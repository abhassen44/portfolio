import React, { useRef, useState } from "react";
import { GitHubRepo } from "../../lib/github/types";
import { formatRelativeDate, getLanguageColor, cleanRepoTitle } from "../../lib/github/transform";
import { Star, GitFork, ExternalLink, Github, ArrowUpRight, BookOpen } from "lucide-react";

interface ProjectCardProps {
  repo: GitHubRepo;
  onOpenModal: (repo: GitHubRepo) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ repo, onOpenModal }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Subtle tilt: max 5 deg
    const tiltX = ((y - centerY) / centerY) * -4;
    const tiltY = ((x - centerX) / centerX) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.2s ease",
      }}
      className="project-card group flex flex-col justify-between p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-all relative overflow-hidden"
    >
      {/* Top Header: Category & Featured tag */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA]">
            <span>{repo.category || "General"}</span>
            {repo.isFeatured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#166534] dark:text-[#22C55E] font-semibold">
                  Featured
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA]">
            {formatRelativeDate(repo.pushed_at || repo.updated_at)}
          </div>
        </div>

        {/* Repository Title */}
        <h3
          onClick={() => onOpenModal(repo)}
          className="text-lg font-bold font-mono tracking-tight text-[#111827] dark:text-white group-hover:text-[#166534] dark:group-hover:text-[#22C55E] transition-colors cursor-pointer flex items-center justify-between"
        >
          <span>{cleanRepoTitle(repo.name)}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#166534] dark:text-[#22C55E]" />
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#4B5563] dark:text-[#A7B0AA] line-clamp-3 leading-relaxed">
          {repo.description || "Production-grade repository with modular architecture and clean documentation."}
        </p>

        {/* Topics (Clean unboxed tags) */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic, i) => (
              <span
                key={i}
                className="text-[10px] font-mono text-[#166534] dark:text-[#22C55E] bg-[#F7FAF8] dark:bg-[#050805] px-1.5 py-0.5 border border-[#DDE8E1] dark:border-[#1B3022]"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-[10px] font-mono text-[#4B5563] dark:text-[#A7B0AA] self-center">
                +{repo.topics.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Bottom: Metadata and Buttons */}
      <div className="mt-6 pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022] flex flex-col gap-3">
        {/* Languages, Stars, Forks */}
        <div className="flex items-center justify-between text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            <span className="text-[#111827] dark:text-white font-medium">
              {repo.language || "Plain"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title={`${repo.stargazers_count} GitHub Stars`}>
              <Star className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1" title={`${repo.forks_count} Forks`}>
              <GitFork className="w-3.5 h-3.5" />
              <span>{repo.forks_count}</span>
            </div>
          </div>
        </div>

        {/* Functional Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onOpenModal(repo)}
            className="flex-1 py-1.5 px-2 text-[11px] font-mono font-medium uppercase tracking-wider text-center border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805] text-[#111827] dark:text-white hover:border-[#166534] dark:hover:border-[#22C55E] hover:text-[#166534] dark:hover:text-[#22C55E] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3 h-3" />
            <span>Details / README</span>
          </button>

          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 border border-[#166534] dark:border-[#22C55E] bg-[#166534] text-white dark:bg-[#22C55E] dark:text-black hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-colors"
              title="Open Live Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#050805] text-[#111827] dark:text-white hover:text-[#166534] dark:hover:text-[#22C55E] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
            title="View on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
