"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, GraduationCap, Briefcase, Phone, Cake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function About() {
    const { t, language } = useLanguage();

    const stats = [
        { value: "4+", label: t("about.yearsCoding") },
        { value: "10+", label: t("about.projectsCount") },
        { value: "3", label: t("about.certificates") },
    ];

    const technologies = [
        { name: "Python", icon: "🐍" },
        { name: "SQL", icon: "🗄️" },
        { name: "JavaScript", icon: "⚡" },
        { name: "React", icon: "⚛️" },
        { name: "Flutter", icon: "📱" },
        { name: "AI/ML", icon: "🧠" },
    ];

    const contactInfo = [
        { icon: Mail, label: t("about.email"), value: "info@ardabolukbasi.com", href: "mailto:info@ardabolukbasi.com" },
        { icon: Phone, label: t("about.phone"), value: "+90 531 252 4640", href: "tel:+905312524640" },
        { icon: Cake, label: t("about.birthday"), value: t("about.birthdayValue"), href: null },
    ];

    return (
        <section id="about" className="pt-20 md:pt-28 pb-16 sm:pb-32 bg-black relative overflow-hidden min-h-screen">

            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">

                {/* Available Badge - Centered at Top */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-6 sm:mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-cyan-300 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        {t("about.badge")}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left: Profile Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative order-1 lg:order-1"
                    >
                        {/* Mobile: small, Desktop: large square */}
                        <div className="relative w-48 sm:w-64 md:w-80 lg:w-96 aspect-square mx-auto">

                            {/* Decorative Border */}
                            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl opacity-20 blur-lg sm:blur-xl" />

                            {/* Image Container - SQUARE */}
                            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-zinc-800 bg-zinc-900">
                                <Image
                                    src="https://github.com/ArdaBolukbasi.png"
                                    alt="Arda Bölükbaşı"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Badge: Status */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="hidden md:flex absolute -bottom-4 -right-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 items-center gap-3 shadow-xl"
                            >
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-white">{t("about.availableForWork")}</span>
                            </motion.div>

                            {/* Floating Badge: Location */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="hidden md:flex absolute -top-4 -left-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 items-center gap-2 shadow-xl"
                            >
                                <MapPin size={16} className="text-cyan-500" />
                                <span className="text-sm font-medium text-white">{t("about.location")}</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-5 sm:space-y-8 order-2 lg:order-2"
                    >
                        <div>
                            <span className="text-cyan-500 font-bold tracking-wider uppercase mb-1 sm:mb-2 block text-sm sm:text-base">{t("about.title")}</span>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-6">
                                {t("about.heading")}
                            </h2>
                            <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed mb-3 sm:mb-4">
                                {t("about.description1")}
                            </p>
                            <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed">
                                <strong className="text-white">{t("about.description2")}</strong> {t("about.description3")}
                            </p>
                        </div>

                        {/* Personal Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {contactInfo.map((info) => (
                                <motion.div
                                    key={info.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-cyan-500/30 transition-colors"
                                >
                                    <div className="flex items-center gap-2 text-cyan-500 mb-1 sm:mb-2">
                                        <info.icon size={14} />
                                        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">{info.label}</span>
                                    </div>
                                    {info.href ? (
                                        <a href={info.href} className="text-white font-medium hover:text-cyan-400 transition-colors text-xs sm:text-sm break-all">
                                            {info.value}
                                        </a>
                                    ) : (
                                        <span className="text-white font-medium text-xs sm:text-sm">{info.value}</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Info Badges */}
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                                <GraduationCap size={14} className="text-cyan-500" />
                                <span className="text-xs sm:text-sm text-zinc-300">{t("about.university")}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                                <Briefcase size={14} className="text-cyan-500" />
                                <span className="text-xs sm:text-sm text-zinc-300">{t("about.role")}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-8 border-y border-zinc-800">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</div>
                                    <div className="text-[10px] sm:text-sm text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Technologies */}
                        <div>
                            <h4 className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider mb-2 sm:mb-4">{t("about.technologies")}</h4>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {technologies.map((tech) => (
                                    <div
                                        key={tech.name}
                                        className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 hover:border-cyan-500/50 transition-colors"
                                    >
                                        <span className="text-sm sm:text-lg">{tech.icon}</span>
                                        <span className="text-xs sm:text-sm font-medium text-zinc-300">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <a
                                href="https://github.com/ArdaBolukbasi"
                                target="_blank"
                                className="p-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl hover:bg-zinc-800 hover:border-cyan-500/50 transition-all"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/ardabolukbasi/"
                                target="_blank"
                                className="p-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl hover:bg-zinc-800 hover:border-blue-500/50 transition-all"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:info@ardabolukbasi.com"
                                className="p-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl hover:bg-zinc-800 hover:border-green-500/50 transition-all"
                            >
                                <Mail size={18} />
                            </a>
                        </div>

                    </motion.div>
                </div>

            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
