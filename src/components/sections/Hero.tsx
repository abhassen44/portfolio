import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { HeroScene } from "../3d/HeroScene";
import { useTheme } from "../../hooks/useTheme";
import { ArrowDown, Github, Linkedin, ExternalLink, Code2, FileText } from "lucide-react";
import gsap from "gsap";

interface HeroProps {
  onExploreProjects: () => void;
  onExploreAbout: () => void;
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProjects, onExploreAbout, onOpenResume }) => {
  const { isDark } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
        .from(
          titleRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          bioRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
          },
          "-=0.3"
        )
        .from(
          statsRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
          },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white dark:bg-[#050805]"
    >
      {/* 3D Scene Layer */}
      <HeroScene isDark={isDark} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Details */}
          <div className="lg:col-span-8 max-w-3xl">
            {/* Status Indicator */}
            <div
              ref={badgeRef}
              className="flex items-center gap-2 mb-6 text-xs font-mono tracking-wider uppercase text-[#166534] dark:text-[#22C55E]"
            >
              <span className="w-2 h-2 rounded-full bg-[#166534] dark:bg-[#22C55E] animate-pulse" />
              <span>IIIT Guwahati</span>
              <span aria-hidden="true" className="text-[#4B5563] dark:text-[#A7B0AA]">·</span>
              <span className="text-[#4B5563] dark:text-[#A7B0AA]">{portfolioConfig.status}</span>
            </div>

            {/* Name & Title */}
            <div ref={titleRef} className="space-y-2 mb-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] dark:text-white uppercase leading-[1.05]">
                {portfolioConfig.name}
              </h1>
              <p className="text-lg sm:text-2xl font-mono font-medium tracking-tight text-[#166534] dark:text-[#22C55E]">
                {portfolioConfig.title}
              </p>
            </div>

            {/* Intro Narrative from portfolio */}
            <p
              ref={bioRef}
              className="text-base sm:text-lg text-[#4B5563] dark:text-[#A7B0AA] max-w-2xl leading-relaxed mb-8"
            >
              {portfolioConfig.tagline}
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={onExploreProjects}
                className="px-6 py-3 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider bg-[#166534] hover:bg-[#14532D] text-white dark:bg-[#22C55E] dark:hover:bg-[#16a34a] dark:text-black transition-colors cursor-pointer border border-[#166534] dark:border-[#22C55E]"
              >
                View Projects
              </button>

              {onOpenResume ? (
                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-white bg-[#14532D] hover:bg-[#166534] dark:hover:bg-[#22C55E] dark:hover:text-black border border-[#166534] dark:border-[#22C55E] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              ) : (
                <a
                  href={portfolioConfig.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-white bg-[#14532D] hover:bg-[#166534] dark:hover:bg-[#22C55E] dark:hover:text-black border border-[#166534] dark:border-[#22C55E] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}

              <a
                href={portfolioConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-[#111827] dark:text-white bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a
                href={portfolioConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-[#111827] dark:text-white bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>

              <a
                href={portfolioConfig.social.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-[#111827] dark:text-white bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
              >
                <Code2 className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />
                <span>LeetCode</span>
              </a>
            </div>

            {/* Quick Technical Summary Strip */}
            <div
              ref={statsRef}
              className="pt-6 border-t border-[#DDE8E1] dark:border-[#1B3022] grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div>
                <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] uppercase tracking-wider">
                  Degree & College
                </div>
                <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-0.5">
                  IIIT Guwahati (CSE)
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] uppercase tracking-wider">
                  LeetCode Solved
                </div>
                <div className="text-sm font-bold font-mono text-[#166534] dark:text-[#22C55E] mt-0.5">
                  450+ Problems
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] uppercase tracking-wider">
                  Fellowship
                </div>
                <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-0.5">
                  Buildspace S5
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] uppercase tracking-wider">
                  Source of Truth
                </div>
                <div className="text-sm font-bold font-mono text-[#111827] dark:text-white mt-0.5">
                  GitHub @abhassen44
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Profile Photo Display */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Solid geometric frame accent */}
              <div className="absolute -inset-1.5 border border-[#166534] dark:border-[#22C55E] pointer-events-none translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
              <div className="relative w-56 h-64 sm:w-64 sm:h-72 lg:w-72 lg:h-80 bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] overflow-hidden">
                <img
                  src={portfolioConfig.photo}
                  alt={portfolioConfig.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to profile_pic.jpeg if necessary
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("profile_pic.jpeg")) {
                      target.src = "/profile_pic.jpeg";
                    }
                  }}
                />
                {/* Photo Tag */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-white/95 dark:bg-[#050805]/95 border-t border-[#DDE8E1] dark:border-[#1B3022] flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-[#111827] dark:text-white">{portfolioConfig.name}</span>
                  <span className="text-[#166534] dark:text-[#22C55E]">IIITG '27</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
