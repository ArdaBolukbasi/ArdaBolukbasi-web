"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogModalProps {
    blog: BlogPost | null;
    onClose: () => void;
}

export function BlogModal({ blog, onClose }: BlogModalProps) {
    const { t, language } = useLanguage();

    if (!blog) return null;

    // Get localized content
    const title = language === "tr" && blog.title_tr ? blog.title_tr : blog.title;
    const excerpt = language === "tr" && blog.excerpt_tr ? blog.excerpt_tr : blog.excerpt;
    const content = language === "tr" && blog.content_tr ? blog.content_tr : blog.content;
    const category = language === "tr" && blog.category_tr ? blog.category_tr : blog.category;

    return (
        <AnimatePresence>
            {blog && (
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
                        className="relative w-full sm:max-w-3xl bg-zinc-900 border-0 sm:border border-zinc-800 rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] mb-16 md:mb-0"
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

                            {/* Header Image */}
                            <div className="relative w-full h-40 sm:h-64 bg-zinc-800">
                                <Image
                                    src={blog.image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-black text-[10px] sm:text-xs font-bold rounded-full">
                                        {category}
                                    </span>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-4 sm:p-8 -mt-8 sm:-mt-16 relative z-10">
                                {/* Meta */}
                                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-400 mb-3 sm:mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(blog.date).toLocaleDateString(language === "tr" ? 'tr-TR' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    {blog.readTime && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {language === "tr" && blog.readTime_tr ? blog.readTime_tr : blog.readTime}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                    {title}
                                </h1>

                                {/* Excerpt */}
                                <p className="text-sm sm:text-lg text-green-400 mb-4 sm:mb-6 font-medium border-l-4 border-green-500 pl-3 sm:pl-4">
                                    {excerpt}
                                </p>

                                {/* Full Content */}
                                <div className="prose prose-invert prose-sm sm:prose-lg max-w-none">
                                    {content.split('\n').map((paragraph, index) => (
                                        paragraph.trim() && (
                                            <p key={index} className="text-zinc-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                                                {paragraph}
                                            </p>
                                        )
                                    ))}
                                </div>

                                {/* Back Button */}
                                <button
                                    onClick={onClose}
                                    className="mt-6 sm:mt-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                                >
                                    <ArrowLeft size={16} />
                                    {t("blog.back")}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
