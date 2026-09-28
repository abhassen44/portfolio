import React, { useState, useRef, useEffect } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { Mail, Copy, Check, Send, Github, Linkedin, ArrowUpRight, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.social.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;

    // Trigger user mail client with pre-filled content
    const mailtoUri = `mailto:${portfolioConfig.social.email}?subject=${encodeURIComponent(
      formState.subject || `Inquiry from ${formState.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )}`;

    window.location.href = mailtoUri;
    setFormSent(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0A120D]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="space-y-12">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
              06. Transmission & Channels
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
              Initiate Contact
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#A7B0AA] max-w-xl">
              Currently available for software engineering roles, distributed systems projects, and generative AI research collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Direct Info & Social Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA]">
                    Direct Communication
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#111827] dark:text-white break-all">
                    {portfolioConfig.social.email}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono border border-[#166534] dark:border-[#22C55E] bg-[#F7FAF8] dark:bg-[#050805] text-[#166534] dark:text-[#22C55E] hover:bg-[#166534] hover:text-white dark:hover:bg-[#22C55E] dark:hover:text-black transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? "Email Copied!" : "Copy Email Address"}</span>
                  </button>

                  <a
                    href={`mailto:${portfolioConfig.social.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono border border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] text-[#111827] dark:text-white hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Mail Client</span>
                  </a>
                </div>

                {/* Social Profiles */}
                <div className="pt-4 border-t border-[#DDE8E1] dark:border-[#1B3022] space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA]">
                    Verified Profiles
                  </div>

                  <div className="space-y-2">
                    <a
                      href={portfolioConfig.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-xs font-mono text-[#111827] dark:text-white hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />
                        <span>github.com/abhassen44</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4B5563] dark:text-[#A7B0AA]" />
                    </a>

                    <a
                      href={portfolioConfig.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-xs font-mono text-[#111827] dark:text-white hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />
                        <span>abhas-sen-1a0862282</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4B5563] dark:text-[#A7B0AA]" />
                    </a>

                    <a
                      href={portfolioConfig.social.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-xs font-mono text-[#111827] dark:text-white hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-xs text-[#166534] dark:text-[#22C55E]">LC</span>
                        <span>leetcode.com/abhassen44</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4B5563] dark:text-[#A7B0AA]" />
                    </a>

                    <a
                      href={portfolioConfig.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#F7FAF8] dark:bg-[#050805] border border-[#166534] dark:border-[#22C55E] text-xs font-mono text-[#166534] dark:text-[#22C55E] font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Resume (Google Drive)</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-5"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E]">
                  Send a Direct Message
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                    Subject / Project Context
                  </label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="Engineering Role / AI Architecture Project"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Briefly describe the requirements, team, or opportunity..."
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none resize-none"
                  />
                </div>

                {formSent && (
                  <div className="p-3 bg-[#F7FAF8] dark:bg-[#050805] border border-[#166534] dark:border-[#22C55E] text-xs font-mono text-[#166534] dark:text-[#22C55E] flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Message formatted and redirected to your email client.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-mono font-semibold uppercase tracking-wider bg-[#166534] dark:bg-[#22C55E] text-white dark:text-black hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message via Email</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
