"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { BlogModal } from "./BlogModal";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function Blog() {
    const { t, language } = useLanguage();
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "blogs"), (snapshot) => {
            const blogsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
            blogsData.sort((a, b) => (a.order || 0) - (b.order || 0));
            setBlogs(blogsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Helper functions for localization
    const getLocalizedTitle = (post: BlogPost) => {
        return language === "tr" && post.title_tr ? post.title_tr : post.title;
    };

    const getLocalizedExcerpt = (post: BlogPost) => {
        return language === "tr" && post.excerpt_tr ? post.excerpt_tr : post.excerpt;
    };

    const getLocalizedCategory = (post: BlogPost) => {
        return language === "tr" && post.category_tr ? post.category_tr : post.category;
    };

    return (
        <section id="blog" className="py-16 sm:py-32 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-green-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-16"
                >
                    <span className="text-green-500 font-bold tracking-wider uppercase mb-1 sm:mb-2 block text-sm">{t("blog.title")}</span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{t("blog.heading")}</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base px-4">
                        {t("blog.description")}
                    </p>
                </motion.div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-36 sm:h-48 bg-zinc-800 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
                                </div>
                                <div className="p-4 sm:p-6 space-y-3">
                                    <div className="h-4 w-1/3 bg-zinc-800 rounded" />
                                    <div className="h-6 w-3/4 bg-zinc-800 rounded" />
                                    <div className="h-4 w-full bg-zinc-800 rounded" />
                                    <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-8 sm:py-16">
                        <p className="text-zinc-500 text-sm sm:text-lg">{t("blog.empty")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {blogs.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedBlog(post)}
                                className="group bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative h-36 sm:h-48 bg-zinc-800 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={getLocalizedTitle(post)}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-black text-[10px] sm:text-xs font-bold rounded-full">
                                            {getLocalizedCategory(post)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500 mb-2 sm:mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(post.date).toLocaleDateString(language === "tr" ? 'tr-TR' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        {post.readTime && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {language === "tr" && post.readTime_tr ? post.readTime_tr : post.readTime}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    {/* Title */}
                                    <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                                        {getLocalizedTitle(post)}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
                                        {getLocalizedExcerpt(post)}
                                    </p>

                                    {/* Read More */}
                                    <div className="flex items-center gap-1 sm:gap-2 text-green-400 font-medium text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                                        {t("blog.readMore")} <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}

            </div>

            {/* Blog Modal */}
            <BlogModal
                blog={selectedBlog}
                onClose={() => setSelectedBlog(null)}
            />

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />
        </section >
    );
}
