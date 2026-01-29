"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Contact() {
    const { t } = useLanguage();
    const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("loading");

        try {
            const response = await fetch("https://formspree.io/f/myzrbwgz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setFormState("success");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setFormState("idle"), 5000);
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error("Form error:", error);
            setFormState("error");
            setTimeout(() => setFormState("idle"), 5000);
        }
    };

    const contactInfo = [
        { icon: Mail, label: t("contact.email"), value: "info@ardabolukbasi.com", href: "mailto:info@ardabolukbasi.com" },
        { icon: MapPin, label: t("contact.location"), value: t("about.location"), href: "#" },
    ];

    return (
        <section id="contact" className="py-16 sm:py-32 bg-black relative overflow-hidden">

            {/* Background Gradient */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[400px] bg-cyan-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-16"
                >
                    <span className="text-cyan-500 font-bold tracking-wider uppercase mb-1 sm:mb-2 block text-sm">{t("contact.title")}</span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{t("contact.heading")}</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base px-4">
                        {t("contact.description")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-12 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-4 sm:space-y-8"
                    >
                        <div className="space-y-3 sm:space-y-6">
                            {contactInfo.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl hover:border-cyan-500/30 transition-colors group"
                                >
                                    <div className="p-2 sm:p-3 bg-zinc-800 rounded-lg sm:rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                                        <item.icon size={20} className="text-cyan-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm text-zinc-500 mb-0.5 sm:mb-1">{item.label}</div>
                                        <div className="text-white font-medium text-sm sm:text-base">{item.value}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Social CTA */}
                        <div className="p-4 sm:p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl sm:rounded-2xl">
                            <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{t("contact.quickChat")}</h4>
                            <p className="text-zinc-400 text-xs sm:text-sm mb-3 sm:mb-4">{t("contact.linkedinCta")}</p>
                            <a
                                href="https://www.linkedin.com/in/ardabolukbasi/"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors text-sm"
                            >
                                {t("contact.openLinkedin")} →
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3"
                    >
                        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">{t("contact.yourName")}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">{t("contact.emailAddress")}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors text-sm sm:text-base"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">{t("contact.yourMessage")}</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/50 border border-zinc-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                                    placeholder={t("contact.messagePlaceholder")}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formState === "loading" || formState === "success"}
                                className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all text-sm sm:text-base ${formState === "success"
                                    ? "bg-green-500 text-white"
                                    : formState === "error"
                                        ? "bg-red-500 text-white"
                                        : "bg-white text-black hover:bg-cyan-50 hover:scale-[1.02]"
                                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                {formState === "loading" && <Loader2 size={18} className="animate-spin" />}
                                {formState === "success" && <CheckCircle size={18} />}
                                {formState === "error" && <AlertCircle size={18} />}
                                {formState === "idle" && <Send size={18} />}

                                {formState === "idle" && t("contact.sendMessage")}
                                {formState === "loading" && t("contact.sending")}
                                {formState === "success" && t("contact.messageSent")}
                                {formState === "error" && t("contact.tryAgain")}
                            </button>

                        </form>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
