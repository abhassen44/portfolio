import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { Briefcase, Calendar, MapPin, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (items && items.length > 0) {
        gsap.from(items, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
              04. Career Timeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
              Professional Experience
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#A7B0AA] max-w-xl">
              Chronological track record of architecting distributed architectures, real-time inference pipelines, and production systems.
            </p>
          </div>

          {/* Timeline Container */}
          <div ref={timelineRef} className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-[#DDE8E1] dark:before:bg-[#1B3022]">
            {portfolioConfig.experience.map((item, idx) => (
              <div
                key={idx}
                className="timeline-item relative pl-10 sm:pl-16 group"
              >
                {/* Node Indicator (Solid square / node) */}
                <div className="absolute left-[11px] sm:left-[19px] top-6 w-3 h-3 bg-white dark:bg-[#050805] border-2 border-[#166534] dark:border-[#22C55E] group-hover:bg-[#166534] dark:group-hover:bg-[#22C55E] transition-colors" />

                {/* Entry Card */}
                <div className="p-6 sm:p-8 bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] group-hover:border-[#166534] dark:group-hover:border-[#22C55E] transition-all">
                  {/* Top Bar: Role & Company */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#DDE8E1] dark:border-[#1B3022]">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
                        {item.role}
                      </h3>
                      <div className="text-sm font-semibold text-[#166534] dark:text-[#22C55E] font-mono mt-0.5">
                        {item.company}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.period}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="mt-4 space-y-2.5">
                    {item.description.map((desc, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                        <ArrowRight className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E] shrink-0 mt-1" />
                        <span>{desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technology Badges (Unboxed solid styling) */}
                  <div className="mt-6 pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022] flex flex-wrap gap-2">
                    {item.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono px-2 py-0.5 border border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805] text-[#111827] dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
