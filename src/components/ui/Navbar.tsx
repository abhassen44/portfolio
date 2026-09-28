import React, { useState, useEffect } from "react";
import { portfolioConfig } from "../../config/portfolio";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon, Menu, X, Github, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onNavigate: (id: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Education", id: "education" },
    { label: "Contact", id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(`#${id}`);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "py-3 bg-white/95 dark:bg-[#050805]/95 backdrop-blur-md border-b border-[#DDE8E1] dark:border-[#1B3022] shadow-sm"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group text-left cursor-pointer focus-visible:outline-none"
            aria-label="Back to home"
          >
            <div className="w-8 h-8 rounded-none border border-[#166534] dark:border-[#22C55E] bg-[#F7FAF8] dark:bg-[#0D1711] flex items-center justify-center font-mono font-semibold text-xs text-[#166534] dark:text-[#22C55E] transition-colors group-hover:bg-[#166534] group-hover:text-white dark:group-hover:bg-[#22C55E] dark:group-hover:text-black">
              AS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#111827] dark:text-white">
                {portfolioConfig.name}
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#4B5563] dark:text-[#A7B0AA] font-mono">
                {portfolioConfig.title.split("&")[0].trim()}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors relative cursor-pointer ${
                    isActive
                      ? "text-[#166534] dark:text-[#22C55E] font-semibold"
                      : "text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#166534] dark:bg-[#22C55E]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub Profile Icon Link */}
            <a
              href={portfolioConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0D1711] text-[#111827] dark:text-white hover:text-[#166534] dark:hover:text-[#22C55E] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              className="p-2 border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0D1711] text-[#111827] dark:text-white hover:text-[#166534] dark:hover:text-[#22C55E] hover:border-[#166534] dark:hover:border-[#22C55E] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Resume Button */}
            <a
              href={portfolioConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium tracking-wider uppercase border border-[#166534] dark:border-[#22C55E] bg-[#166534] text-white dark:bg-[#22C55E] dark:text-black hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-colors"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 md:hidden border border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0D1711] text-[#111827] dark:text-white hover:text-[#166534] dark:hover:text-[#22C55E] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805] px-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeSection === item.id
                    ? "text-[#166534] dark:text-[#22C55E] font-semibold bg-[#F7FAF8] dark:bg-[#0D1711]"
                    : "text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 space-y-2">
              <a
                href={portfolioConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#166534] dark:bg-[#22C55E] dark:text-black border border-[#166534] dark:border-[#22C55E]"
              >
                <span>Resume (Google Drive)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={portfolioConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#166534] dark:text-[#22C55E] border border-[#166534] dark:border-[#22C55E]"
              >
                <span>GitHub Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
