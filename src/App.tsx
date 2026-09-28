import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Navbar } from "./components/ui/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Education } from "./components/sections/Education";
import { GitHubActivity } from "./components/sections/GitHubActivity";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/ui/Footer";
import { GeminiChatModal } from "./components/chat/GeminiChatModal";
import { FadeInSection } from "./components/ui/FadeInSection";

function PortfolioContent() {
  const { scrollTo } = useSmoothScroll();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "about", "skills", "projects", "experience", "education", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050805] text-[#111827] dark:text-white transition-colors duration-200">
      {/* Sticky Navigation */}
      <Navbar
        onNavigate={(hash) => scrollTo(hash)}
        activeSection={activeSection}
      />

      <main>
        {/* Hero Section with Interactive 3D Canvas */}
        <Hero
          onExploreProjects={() => scrollTo("#projects")}
          onExploreAbout={() => scrollTo("#about")}
        />

        {/* Static Personal / About Section */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <About />
        </FadeInSection>

        {/* Technical Capabilities & Skills */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <Skills />
        </FadeInSection>

        {/* Dynamic GitHub Source of Truth Section */}
        <FadeInSection threshold={0.08} distance={28} duration={800}>
          <Projects />
        </FadeInSection>

        {/* Career Timeline */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <Experience />
        </FadeInSection>

        {/* Academic Foundation */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <Education />
        </FadeInSection>

        {/* Real-time GitHub Activity */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <GitHubActivity />
        </FadeInSection>

        {/* Transmission & Contact */}
        <FadeInSection threshold={0.1} distance={28} duration={800}>
          <Contact />
        </FadeInSection>
      </main>

      {/* Clean Footer */}
      <Footer onScrollToTop={() => scrollTo("#home")} />

      {/* Floating Gemini Chatbot */}
      <GeminiChatModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}
