import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { Cpu, Terminal, Layers, CheckCircle2, Award, BookOpen, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0A120D]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="space-y-12">
          {/* Section Kicker */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
              01. About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
              Academic Excellence & Practical Software Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] dark:text-white leading-snug">
                {portfolioConfig.about.headline}
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                {portfolioConfig.about.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Core Competencies from old portfolio */}
              <div className="pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E]">
                  Core Competencies
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {portfolioConfig.about.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#166534] dark:text-[#22C55E] shrink-0 mt-0.5" />
                      <span className="text-[#111827] dark:text-[#A7B0AA]">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Highlight */}
              <div className="pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022] space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Key Milestones & Achievements</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4B5563] dark:text-[#A7B0AA]">
                  {portfolioConfig.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#166534] dark:text-[#22C55E] font-bold">▪</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Architecture & Focus Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#166534] dark:text-[#22C55E]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                      Education & Academics
                    </h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
                      IIIT Guwahati · CGPA 7.63 / 10.0
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                  B.Tech in Computer Science and Engineering (2023–2027) with deep theoretical roots in algorithms, concurrency, operating systems, and distributed networks.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#166534] dark:text-[#22C55E]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                      Artificial Intelligence & ML
                    </h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
                      RAG, LangGraph & Explainable AI
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                  Developing autonomous multi-agent systems, hybrid dense/sparse retrieval with Qdrant and Celery, and model interpretability via SHAP/LIME algorithms.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#166534] dark:text-[#22C55E]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                      Full-Stack & Systems
                    </h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
                      React, Next.js, FastAPI & Docker
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                  Building sandboxed code execution environments, real-time multi-user WebSocket canvases (DrawSync), and high-performance WebGL graphics with Three.js.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#166534] dark:text-[#22C55E]">
                    <Code2 className="w-5 h-5 text-[#166534] dark:text-[#22C55E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                      Competitive Programming
                    </h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
                      450+ LeetCode Solved
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                  Consistent problem solving across dynamic programming, graph traversals, segment trees, and sliding window paradigms with optimal asymptotic bounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
