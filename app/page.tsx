"use client";

import { Navbar } from "@/components/Navbar";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Certificates } from "@/components/Certificates";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <About />
      <Projects />
      <Certificates />
      <Blog />
      <Contact />

      {/* Footer */}
      <footer className="py-8 sm:py-12 pb-24 md:pb-12 bg-black border-t border-zinc-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:text-left md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-serif italic text-xs sm:text-sm">
                A
              </div>
              <span className="font-bold text-sm sm:text-base">Arda Bölükbaşı</span>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm order-last md:order-none">
              © 2024 {t("footer.rights")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-400">
              <a href="#about" className="hover:text-white transition-colors">{t("nav.about")}</a>
              <a href="#projects" className="hover:text-white transition-colors">{t("nav.projects")}</a>
              <a href="#blog" className="hover:text-white transition-colors">{t("nav.blog")}</a>
              <a href="#contact" className="hover:text-white transition-colors">{t("nav.contact")}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
