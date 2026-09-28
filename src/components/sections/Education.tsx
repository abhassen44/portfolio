import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { GraduationCap, Award, BookMarked, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Education: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0A120D]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
              05. Academic Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
              Education & Theoretical Foundations
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#A7B0AA] max-w-xl">
              Rigorous computer science curriculum grounding in algorithms, operating systems, distributed architectures, and machine learning.
            </p>
          </div>

          {/* Education Entries */}
          <div ref={cardRef} className="space-y-6">
            {portfolioConfig.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE8E1] dark:border-[#1B3022]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#166534] dark:text-[#22C55E]" />
                      <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
                        {edu.degree} in {edu.field}
                      </h3>
                    </div>
                    <div className="text-sm font-semibold font-mono text-[#166534] dark:text-[#22C55E]">
                      {edu.institution}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.period}</span>
                    </span>
                    {edu.grade && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1.5 text-[#166534] dark:text-[#22C55E] font-medium">
                          <Award className="w-3.5 h-3.5" />
                          <span>{edu.grade}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E]">
                    Specializations & Highlights
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#4B5563] dark:text-[#A7B0AA] leading-relaxed">
                    {edu.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-[#166534] dark:text-[#22C55E] font-bold">▪</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coursework */}
                <div className="space-y-3 pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022]">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                    <span>Relevant Theoretical Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((course, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-xs font-mono px-2.5 py-1 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white"
                      >
                        {course}
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
