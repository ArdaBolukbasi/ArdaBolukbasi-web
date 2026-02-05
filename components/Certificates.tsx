"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Certificate } from "@/types/certificate";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function Certificates() {
    const { language, t } = useLanguage();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "certificates"), (snapshot) => {
            const certsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Certificate));
            certsData.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCertificates(certsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getLocalizedTitle = (cert: Certificate) => {
        return language === "tr" && cert.title_tr ? cert.title_tr : cert.title;
    };

    const getLocalizedIssuer = (cert: Certificate) => {
        return language === "tr" && cert.issuer_tr ? cert.issuer_tr : cert.issuer;
    };

    const openCertificate = (cert: Certificate, index: number) => {
        setSelectedCert(cert);
        setCurrentIndex(index);
        setGalleryIndex(0);
    };

    const closeCertificate = () => {
        setSelectedCert(null);
    };

    const nextCert = () => {
        const newIndex = (currentIndex + 1) % certificates.length;
        setCurrentIndex(newIndex);
        setSelectedCert(certificates[newIndex]);
    };

    const prevCert = () => {
        const newIndex = (currentIndex - 1 + certificates.length) % certificates.length;
        setCurrentIndex(newIndex);
        setSelectedCert(certificates[newIndex]);
        setGalleryIndex(0);
    };

    const nextGalleryImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedCert) return;
        const images = [selectedCert.image, ...(selectedCert.gallery || [])];
        setGalleryIndex((prev) => (prev + 1) % images.length);
    };

    const prevGalleryImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedCert) return;
        const images = [selectedCert.image, ...(selectedCert.gallery || [])];
        setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);
    };



    return (
        <section id="certificates" className="py-16 sm:py-24 bg-black relative overflow-hidden">
            {/* Top Gradient for Smooth Transition */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/50 to-transparent z-10 pointer-events-none" />

            {/* Background - Right Top Glow */}
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-16"
                >
                    <span className="text-yellow-500 font-bold tracking-wider uppercase mb-1 sm:mb-2 block text-sm">
                        {t("certificates.title")}
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                        {t("certificates.heading")}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                        {t("certificates.description")}
                    </p>
                </motion.div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-video bg-zinc-800 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-zinc-800 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => openCertificate(cert, index)}
                                className="group cursor-pointer bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all hover:scale-[1.02]"
                            >
                                {/* Image */}
                                <div className="relative aspect-video overflow-hidden bg-zinc-950 p-3 sm:p-6">
                                    <img
                                        src={cert.image}
                                        alt={getLocalizedTitle(cert)}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute top-3 right-3">
                                        <div className="p-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg">
                                            <Award size={16} className="text-yellow-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-2 sm:p-3">
                                    <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                                        {getLocalizedTitle(cert)}
                                    </h3>
                                    <p className="text-zinc-500 text-[10px] mb-1.5 line-clamp-1">
                                        {getLocalizedIssuer(cert)}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[9px] sm:text-[10px] text-zinc-600">
                                            {language === "tr" && cert.date_tr ? cert.date_tr : cert.date}
                                        </span>
                                        {cert.credentialUrl && (
                                            <ExternalLink size={10} className="text-zinc-600 group-hover:text-yellow-400" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCertificate}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeCertificate}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>

                            {/* Navigation */}
                            {certificates.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevCert(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                                    >
                                        <ChevronLeft size={24} className="text-white" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextCert(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                                    >
                                        <ChevronRight size={24} className="text-white" />
                                    </button>
                                </>
                            )}

                            {/* Certificate Image or Gallery */}
                            <div className="aspect-[16/10] overflow-hidden relative group/image">
                                <AnimatePresence mode="wait">
                                    {(() => {
                                        const displayImages = (selectedCert.gallery && selectedCert.gallery.length > 0)
                                            ? selectedCert.gallery
                                            : [selectedCert.image];
                                        return (
                                            <>
                                                <motion.img
                                                    key={galleryIndex}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    src={displayImages[galleryIndex]}
                                                    alt={getLocalizedTitle(selectedCert)}
                                                    className="w-full h-full object-contain bg-black"
                                                />

                                                {/* Gallery Navigation */}
                                                {displayImages.length > 1 && (
                                                    <>
                                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10">
                                                            {galleryIndex + 1} / {displayImages.length}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setGalleryIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
                                                            }}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/image:opacity-100 transition-opacity"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setGalleryIndex(prev => (prev + 1) % displayImages.length);
                                                            }}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover/image:opacity-100 transition-opacity"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        );
                                    })()}
                                </AnimatePresence>
                            </div>

                            {/* Info */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {getLocalizedTitle(selectedCert)}
                                    </h3>
                                    <p className="text-zinc-400">
                                        {getLocalizedIssuer(selectedCert)} • {new Date(selectedCert.date).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
                                            year: "numeric",
                                            month: "long"
                                        })}
                                    </p>
                                </div>
                                {selectedCert.credentialUrl && (
                                    <a
                                        href={selectedCert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        {t("certificates.viewCredential")}
                                    </a>
                                )}
                            </div>

                            {/* Counter */}
                            {certificates.length > 1 && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-zinc-500 text-sm">
                                    {currentIndex + 1} / {certificates.length}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
