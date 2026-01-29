"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectModal } from "./ProjectModal";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function Projects() {
    const { t, language } = useLanguage();
    const [filter, setFilter] = useState("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project));
            projectsData.sort((a, b) => (a.order || 0) - (b.order || 0));
            setProjects(projectsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const categories = [
        { en: "All", tr: t("projects.all") },
        { en: "Mobile App", tr: t("projects.mobileApp") },
        { en: "Web Development", tr: t("projects.webDevelopment") },
        { en: "Tools", tr: t("projects.tools") },
    ];

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter((p) => p.category === filter);

    // Get localized title and description
    const getLocalizedTitle = (project: Project) => {
        return language === "tr" && project.title_tr ? project.title_tr : project.title;
    };

    const getLocalizedDescription = (project: Project) => {
        return language === "tr" && project.description_tr ? project.description_tr : project.description;
    };

    const getLocalizedCategory = (project: Project) => {
        // Simple mapping for categories if they are stored as English strings
        const categoryMap: Record<string, string> = {
            "All": t("projects.all"),
            "Mobile App": t("projects.mobileApp"),
            "Web Development": t("projects.webDevelopment"),
            "Tools": t("projects.tools")
        };
        return language === "tr" ? (categoryMap[project.category] || project.category) : project.category;
    };

    return (
        <section id="projects" className="py-16 sm:py-32 bg-black relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-16"
                >
                    <span className="text-purple-500 font-bold tracking-wider uppercase mb-1 sm:mb-2 block text-sm">{t("projects.title")}</span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-8">{t("projects.heading")}</h2>

                    {/* Filter Tabs - Scrollable on mobile */}
                    <div className="w-full md:w-auto overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-2 bg-zinc-900/50 p-1.5 sm:p-2 rounded-full border border-zinc-800 w-fit mx-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.en}
                                    onClick={() => setFilter(cat.en)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filter === cat.en
                                        ? "bg-purple-600 text-white"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                        }`}
                                >
                                    {language === "tr" ? cat.tr : cat.en}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="h-6 w-3/4 bg-zinc-800 rounded mb-2" />
                                    <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative">
                                        {/* Project Image */}
                                        <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-800 relative shadow-xl sm:shadow-2xl border border-zinc-800/50 group-hover:border-purple-500/30 transition-colors">
                                            <Image
                                                src={project.image}
                                                alt={getLocalizedTitle(project)}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Category Badge - Top Left */}
                                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500 text-black text-[10px] sm:text-xs font-bold rounded-full uppercase shadow-lg">
                                                    {getLocalizedCategory(project)}
                                                </span>
                                            </div>

                                            {/* Featured Badge */}
                                            {project.featured && (
                                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-500 text-black text-[10px] sm:text-xs font-bold rounded-full uppercase">
                                                    Featured
                                                </div>
                                            )}

                                            {/* Overlay - Always visible on mobile */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                                    <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">{getLocalizedTitle(project)}</h3>
                                                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2">{getLocalizedDescription(project)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tech Stack Pills */}
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {project.technologies.slice(0, 4).map(tech => (
                                                <span key={tech} className="text-[10px] sm:text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 sm:py-1 rounded-md border border-zinc-800">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
}
