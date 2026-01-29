"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, X, Loader2, FileText } from "lucide-react";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    placeholder?: string;
    accept?: string; // e.g. "image/*" or "application/pdf"
}

export function ImageUploader({ value, onChange, placeholder = "Image URL", accept = "image/*" }: ImageUploaderProps) {
    const [mode, setMode] = useState<"url" | "upload">("upload");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isPdf = accept.includes("pdf");

    const handleFile = async (file: File) => {
        if (!file) return;
        setErrorMsg(null);

        // Validation
        if (isPdf && file.type !== "application/pdf") {
            setErrorMsg("Please upload a PDF file");
            return;
        }
        if (!isPdf && !file.type.startsWith("image/")) {
            setErrorMsg("Please upload an image file");
            return;
        }

        // Size Check for PDF (Firestore limit ~1MB, safe limit 700KB)
        if (isPdf && file.size > 700 * 1024) {
            setErrorMsg(`File too large (${(file.size / 1024).toFixed(0)}KB). Max 700KB for PDF.`);
            return;
        }

        setUploading(true);
        try {
            if (isPdf) {
                const base64 = await fileToBase64(file);
                onChange(base64);
            } else {
                // Compress images
                const base64 = await compressImage(file);
                onChange(base64);
            }
        } catch (error: any) {
            console.error("Processing failed:", error);
            setErrorMsg("Failed to process file.");
        } finally {
            setUploading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Client-side image compression
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    const newWidth = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
                    const newHeight = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, newWidth, newHeight);

                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            {/* Mode Switcher */}
            <div className="flex gap-2 mb-2 bg-black/30 w-fit p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setMode("upload")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "upload"
                        ? "bg-zinc-700 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                        }`}
                >
                    <Upload size={14} /> Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "url"
                        ? "bg-zinc-700 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                        }`}
                >
                    <LinkIcon size={14} /> URL
                </button>
            </div>

            {mode === "url" ? (
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-cyan-500 transition-colors"
                />
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors flex flex-col items-center justify-center gap-2 min-h-[100px] ${dragActive
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-zinc-700 hover:border-zinc-500 bg-black/20"
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                            <Loader2 size={24} className="animate-spin text-cyan-500" />
                            <span className="text-xs">Processing & Saving...</span>
                        </div>
                    ) : (
                        <>
                            <input
                                type="file"
                                id={`file-upload-${placeholder}`}
                                className="hidden"
                                accept={accept}
                                onChange={handleChange}
                            />
                            <div className="flex flex-col items-center gap-1 text-center pointer-events-none">
                                <Upload size={20} className="text-zinc-500" />
                                <p className="text-xs text-zinc-400">
                                    <span className="font-semibold text-cyan-400">Click</span> or drag {isPdf ? "PDF" : "image"}
                                </p>
                                <p className="text-[10px] text-zinc-600">
                                    {isPdf ? "Max 700KB (DB Storage)" : "Auto-compressed"}
                                </p>
                            </div>
                            <label
                                htmlFor={`file-upload-${placeholder}`}
                                className="absolute inset-0 cursor-pointer"
                            />
                        </>
                    )}
                </div>
            )}

            {/* Error Message */}
            {errorMsg && (
                <div className="mt-2 text-red-400 text-xs px-2">
                    ⚠️ {errorMsg}
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="mt-2 relative w-full h-32 bg-black/50 rounded-lg overflow-hidden border border-zinc-800 group flex items-center justify-center">
                    {/* Image Preview */}
                    {!value.startsWith("data:application/pdf") && !value.endsWith(".pdf") ? (
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        /* PDF Preview Icon */
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                            <FileText size={32} className="text-red-400" />
                            <span className="text-xs">PDF Document</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                        <X size={14} />
                    </button>
                    {!value.startsWith("data:application/pdf") && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-[10px] text-zinc-300 truncate max-w-[90%]">
                            {value.substring(0, 30)}...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
