import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { Code2, Server, BrainCircuit, Layout, Database } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".skill-group-card");
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      title: "Languages",
      icon: <Code2 className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />,
      description: "Systems programming & algorithms",
      items: portfolioConfig.skills.languages,
    },
    {
      title: "AI / ML & LLMs",
      icon: <BrainCircuit className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />,
      description: "Generative architectures & retrieval",
      items: portfolioConfig.skills.aiMl,
    },
    {
      title: "Backend & Systems",
      icon: <Server className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />,
      description: "High-throughput APIs & microservices",
      items: portfolioConfig.skills.backend,
    },
    {
      title: "Frontend & Spatial",
      icon: <Layout className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />,
      description: "Performant UIs & WebGL graphics",
      items: portfolioConfig.skills.frontend,
    },
    {
      title: "Infrastructure & Data",
      icon: <Database className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />,
      description: "Distributed storage & deployment",
      items: portfolioConfig.skills.infrastructure,
    },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
              02. Technical Competencies
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
              Core Technical Stack & Tooling
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#A7B0AA] max-w-xl">
              Organized by systems layer and domain competence. Each technology is backed by real production implementation experience.
            </p>
          </div>

          {/* Categorized Skills Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="skill-group-card p-6 bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#DDE8E1] dark:border-[#1B3022]">
                  <div className="p-1.5 bg-white dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022]">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111827] dark:text-white">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-[#4B5563] dark:text-[#A7B0AA]">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {cat.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <span className="font-medium text-[#111827] dark:text-white">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#4B5563] dark:text-[#A7B0AA]">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
