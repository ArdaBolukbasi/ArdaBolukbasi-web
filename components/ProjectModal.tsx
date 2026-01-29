"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Calendar, Code2, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/types/project";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
    const { t, language } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Tüm resimleri bir array'de topla (kapak + galeri)
    const allImages = project ? [project.image, ...(project.gallery || [])] : [];

    // Modal kapandığında index'i sıfırla
    useEffect(() => {
        if (!project) {
            setCurrentImageIndex(0);
        }
    }, [project]);

    // Klavye navigasyonu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!project) return;
            if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [project, currentImageIndex, allImages.length]);

    const goToNext = useCallback(() => {
        if (allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    }, [allImages.length]);

    const goToPrevious = useCallback(() => {
        if (allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
    }, [allImages.length]);

    if (!project) return null;

    // Get localized content
    const title = language === "tr" && project.title_tr ? project.title_tr : project.title;
    const description = language === "tr" && project.description_tr ? project.description_tr : project.description;

    return (
        <AnimatePresence>
            {project && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="relative w-full sm:max-w-4xl bg-zinc-900 border-0 sm:border border-zinc-800 rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] mb-16 md:mb-0"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto custom-scrollbar flex-1">

                            {/* Image Gallery Section */}
                            <div className="relative w-full h-48 sm:h-64 md:h-96 bg-zinc-800">
                                {/* Current Image */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={allImages[currentImageIndex]}
                                            alt={`${title} - Image ${currentImageIndex + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Arrows - Only show if more than 1 image */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToPrevious();
                                            }}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all hover:scale-110 backdrop-blur-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToNext();
                                            }}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all hover:scale-110 backdrop-blur-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter & Dots - Only show if more than 1 image */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 sm:gap-3">
                                        {/* Image Counter */}
                                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-black/60 text-white text-xs sm:text-sm font-medium rounded-full backdrop-blur-sm">
                                            {currentImageIndex + 1} / {allImages.length}
                                        </span>
                                        {/* Dots - Hide on very small screens if many images */}
                                        <div className="hidden sm:flex gap-2">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(index);
                                                    }}
                                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${index === currentImageIndex
                                                        ? "bg-purple-500 scale-125"
                                                        : "bg-white/50 hover:bg-white/80"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-zinc-900 to-transparent" />

                                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 md:bottom-10 md:left-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2 mb-1 sm:mb-2"
                                    >
                                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500 text-black text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                            {project.category}
                                        </span>
                                        {project.featured && (
                                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-500 text-black text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                                Featured
                                            </span>
                                        )}
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-xl sm:text-3xl md:text-5xl font-bold text-white shadow-black drop-shadow-lg"
                                    >
                                        {title}
                                    </motion.h2>
                                </div>
                            </div>

                            {/* Details Content */}
                            <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                    {/* Main Description */}
                                    <div className="md:col-span-2 space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-lg">
                                        <p>{description}</p>
                                    </div>

                                    {/* Sidebar / Stats */}
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    className="flex items-center justify-center gap-2 bg-white text-black font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-colors text-sm sm:text-base"
                                                >
                                                    <ExternalLink size={16} /> {t("projects.liveDemo")}
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    className="flex items-center justify-center gap-2 bg-zinc-800 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 text-sm sm:text-base"
                                                >
                                                    <Github size={16} /> {t("projects.sourceCode")}
                                                </a>
                                            )}
                                        </div>

                                        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-zinc-800">
                                            {project.technologies.length > 0 && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-semibold mb-2">
                                                        <Code2 size={14} /> {t("projects.technologies")}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                        {project.technologies.map(tech => (
                                                            <span key={tech} className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-zinc-800 rounded-md border border-zinc-700 text-zinc-300">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-semibold mb-2">
                                                    <Calendar size={14} /> {t("projects.date")}
                                                </h4>
                                                <span className="text-zinc-300 text-sm">2024 - {language === "tr" ? "Devam Ediyor" : "Present"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
