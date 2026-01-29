"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Download, Code2, Database, Brain } from "lucide-react";

export function Hero() {
    // CV Data from Firestore
    const [cvEn, setCvEn] = useState<string>("");

    useEffect(() => {
        const getCV = async () => {
            try {
                const { doc, onSnapshot } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // Fetch only once or subscribe? Subscribe is better for consistency.
                onSnapshot(doc(db, "settings", "profile"), (doc) => {
                    if (doc.exists()) {
                        setCvEn(doc.data()?.cv_en || "");
                    }
                });
            } catch (e) {
                console.error("Error fetching CV:", e);
            }
        };
        getCV();
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 bg-black">

            {/* Background Gradient Blob */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-4 text-center z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-cyan-300 mb-8 backdrop-blur-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Available for Freelance Projects
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
                >
                    Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Digital Experiences</span>
                    <br /> that Matter.
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    I'm Arda, a Software Developer specializing in Python, SQL, and Modern Web Technologies.
                    transforming complex problems into elegant, scalable solutions.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a href="#projects" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 group">
                        View My Work
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    {cvEn ? (
                        <a href={cvEn} download="Arda_Bolukbasi_CV_EN.pdf" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                            Download CV
                            <Download size={18} />
                        </a>
                    ) : (
                        <a href="/cv-en.pdf" download className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                            Download CV
                            <Download size={18} />
                        </a>
                    )}
                </motion.div>

                {/* Tech Stack Floating Icons (Decorative) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                >
                    {/* Simple representation of tech stack */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <Code2 size={24} className="text-blue-400" />
                        </div>
                        <span className="text-xs text-zinc-500">Web</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <Database size={24} className="text-green-400" />
                        </div>
                        <span className="text-xs text-zinc-500">SQL</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <Brain size={24} className="text-purple-400" />
                        </div>
                        <span className="text-xs text-zinc-500">AI</span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
