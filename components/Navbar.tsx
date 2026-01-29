"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { X, Github, Linkedin, FileText, Download, Home, FolderOpen, BookOpen, Mail, Globe, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [cvModalOpen, setCvModalOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    // CV Data from Firestore
    const [cvData, setCvData] = useState<{ cv_en?: string; cv_tr?: string }>({});

    useEffect(() => {
        // Scroll handler
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch CV Data
        const getCVs = async () => {
            try {
                // We use dynamic import to avoid SSR issues with Firebase if any, though "use client" handles it.
                // Better: just direct usage since we have "use client"
                const { doc, onSnapshot } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
                    if (doc.exists()) {
                        setCvData(doc.data() as any);
                    }
                });
                return unsub;
            } catch (e) {
                console.error("Error fetching CVs:", e);
            }
        };

        let unsub: any;
        getCVs().then(u => unsub = u);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (unsub) unsub();
        };
    }, []);

    // Smooth scroll function
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "tr" : "en");
    };

    const navLinks = [
        { name: t("nav.about"), href: "#about", icon: Home },
        { name: t("nav.projects"), href: "#projects", icon: FolderOpen },
        { name: t("certificates.title"), href: "#certificates", icon: Award },
        { name: t("nav.blog"), href: "#blog", icon: BookOpen },
        { name: t("nav.contact"), href: "#contact", icon: Mail },
    ];

    return (
        <>
            {/* Desktop Navbar - Top */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:flex justify-center pt-4 px-4",
                )}
            >
                <div
                    className={cn(
                        "w-full max-w-5xl rounded-full border border-transparent px-6 py-3 flex items-center justify-between transition-all duration-300",
                        scrolled
                            ? "bg-black/60 backdrop-blur-md border-white/10 shadow-lg"
                            : "bg-transparent"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-serif italic">
                            A
                        </div>
                        <span>Arda Bölükbaşı</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group cursor-pointer"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all text-sm font-medium"
                        >
                            <Globe size={14} />
                            <span className={language === "tr" ? "text-cyan-400" : "text-zinc-400"}>TR</span>
                            <span className="text-zinc-600">/</span>
                            <span className={language === "en" ? "text-cyan-400" : "text-zinc-400"}>EN</span>
                        </button>

                        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                            <a href="https://github.com/ArdaBolukbasi" target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-white/10 hover:text-cyan-400 transition-all">
                                <Github size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/ardabolukbasi/" target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-white/10 hover:text-blue-400 transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                        <button
                            onClick={() => setCvModalOpen(true)}
                            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-cyan-50 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <FileText size={16} />
                            {t("nav.viewCv")}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Bottom Navigation - Rounded Pill Style */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-4 left-4 right-4 z-50 lg:hidden flex justify-center"
            >
                <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 shadow-lg shadow-black/50 flex items-center gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-zinc-400 hover:text-cyan-400 active:scale-95 transition-all rounded-full hover:bg-white/5"
                        >
                            <link.icon size={18} />
                            <span className="text-[8px] font-medium">{link.name}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setCvModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-zinc-400 hover:text-cyan-300 active:scale-95 transition-all rounded-full hover:bg-white/5"
                    >
                        <FileText size={18} />
                        <span className="text-[8px] font-medium">CV</span>
                    </button>
                    {/* Language Toggle - Mobile */}
                    <button
                        onClick={toggleLanguage}
                        className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-cyan-400 active:scale-95 transition-all rounded-full bg-cyan-500/10"
                    >
                        <Globe size={18} />
                        <span className="text-[8px] font-bold">{language.toUpperCase()}</span>
                    </button>
                </div>
            </motion.nav>

            {/* CV Modal */}
            <AnimatePresence>
                {cvModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCvModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="relative w-full sm:max-w-4xl h-[80vh] sm:h-[85vh] bg-zinc-900 border-0 sm:border border-zinc-800 rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col mb-20 md:mb-0"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-800">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <FileText size={18} className="text-cyan-500" />
                                    {t("cv.title")}
                                </h3>
                                <button
                                    onClick={() => setCvModalOpen(false)}
                                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* CV Preview */}
                            <div className="flex-1 bg-zinc-950 overflow-hidden relative">
                                {((language === "en" && cvData?.cv_en) || (language === "tr" && cvData?.cv_tr)) ? (
                                    <iframe
                                        src={language === "en" ? cvData.cv_en : cvData.cv_tr}
                                        className="w-full h-full border-none"
                                        title="CV Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-zinc-500 flex-col gap-4">
                                        <FileText size={48} className="opacity-20" />
                                        <p>CV not uploaded yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer with Download Button */}
                            <div className="p-3 sm:p-4 border-t border-zinc-800 flex items-center justify-between gap-4">
                                <p className="text-xs sm:text-sm text-zinc-500 hidden sm:block">
                                    {t("cv.downloadHint")}
                                </p>
                                {((language === "en" && cvData?.cv_en) || (language === "tr" && cvData?.cv_tr)) && (
                                    <a
                                        href={language === "en" ? cvData.cv_en : cvData.cv_tr}
                                        download={`Arda_Bolukbasi_CV_${language.toUpperCase()}.pdf`}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-cyan-50 transition-colors text-sm sm:text-base"
                                    >
                                        <Download size={16} />
                                        {t("cv.download")}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
