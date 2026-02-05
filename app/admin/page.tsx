"use client";

import { useState, useEffect } from "react";
import { Project, initialProjects } from "@/types/project";
import { BlogPost, initialBlogs } from "@/types/blog";
import { Certificate, initialCertificates } from "@/types/certificate";
import { Lock, Plus, Trash2, Download, X, Edit3, Check, FolderOpen, FileText, Settings, Globe, Award, Database, ChevronUp, ChevronDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // ... (isAuthenticated state remains) ...

    // Firestore Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    // Profile State
    const [profile, setProfile] = useState<{ cv_en?: string; cv_tr?: string }>({});

    // Subscribe to Realtime Updates
    useEffect(() => {
        if (!isAuthenticated) return;

        // Projects
        const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project));
            data.sort((a, b) => (a.order || 0) - (b.order || 0));
            setProjects(data);
        });

        // Blogs
        const unsubBlogs = onSnapshot(collection(db, "blogs"), (snap) => {
            const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as BlogPost));
            data.sort((a, b) => (a.order || 0) - (b.order || 0));
            setBlogs(data);
        });

        // Certificates
        const unsubCerts = onSnapshot(collection(db, "certificates"), (snap) => {
            const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Certificate));
            data.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCertificates(data);
        });

        // Profile/Settings Listener
        const unsubProfile = onSnapshot(doc(db, "settings", "profile"), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data() as any);
            }
        });

        return () => {
            unsubProjects();
            unsubBlogs();
            unsubCerts();
            unsubProfile();
        };
    }, [isAuthenticated]);

    const updateProfile = async (key: string, value: string) => {
        try {
            const ref = doc(db, "settings", "profile");
            // Use setDoc with merge to ensure document exists
            // Note: setDoc needs to be imported if not already, or use updateDoc if sure it exists. 
            // Ideally we imported setDoc at top. Checking imports.. 
            // Actually, let's use setDoc imported from firestore to be safe.
            await setDoc(ref, { [key]: value }, { merge: true });
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update settings");
        }
    };

    // UI State
    const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "certificates" | "settings">("projects");

    // Projects UI State
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editGalleryUrl, setEditGalleryUrl] = useState("");
    const [newProject, setNewProject] = useState<Partial<Project>>({
        category: "Web Development",
        technologies: [],
        gallery: [],
    });
    const [newGalleryUrl, setNewGalleryUrl] = useState("");
    const [newTechInput, setNewTechInput] = useState("");
    const [editTechInput, setEditTechInput] = useState("");

    // Blogs UI State
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
    const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({
        category: "General",
        content: "",
    });

    // Certificates UI State
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [editCertGalleryUrl, setEditCertGalleryUrl] = useState("");
    const [newCert, setNewCert] = useState<Partial<Certificate>>({});
    const [newCertGalleryUrl, setNewCertGalleryUrl] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "BMR8828loxer") {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect Password!");
        }
    };

    // ===== PROJECT HANDLERS =====
    const handleAddGalleryImage = () => {
        if (!newGalleryUrl.trim()) return;
        setNewProject({
            ...newProject,
            gallery: [...(newProject.gallery || []), newGalleryUrl.trim()]
        });
        setNewGalleryUrl("");
    };

    const handleRemoveGalleryImage = (index: number) => {
        setNewProject({
            ...newProject,
            gallery: (newProject.gallery || []).filter((_, i) => i !== index)
        });
    };

    const handleAddEditGalleryImage = () => {
        if (!editGalleryUrl.trim() || !editingProject) return;
        setEditingProject({
            ...editingProject,
            gallery: [...(editingProject.gallery || []), editGalleryUrl.trim()]
        });
        setEditGalleryUrl("");
    };

    const handleRemoveEditGalleryImage = (index: number) => {
        if (!editingProject) return;
        setEditingProject({
            ...editingProject,
            gallery: (editingProject.gallery || []).filter((_, i) => i !== index)
        });
    };

    // Cert Gallery Handlers
    const handleAddCertGalleryImage = () => {
        if (!newCertGalleryUrl.trim()) return;
        setNewCert({
            ...newCert,
            gallery: [...(newCert.gallery || []), newCertGalleryUrl.trim()]
        });
        setNewCertGalleryUrl("");
    };

    const handleRemoveCertGalleryImage = (index: number) => {
        setNewCert({
            ...newCert,
            gallery: (newCert.gallery || []).filter((_, i) => i !== index)
        });
    };

    const handleAddEditCertGalleryImage = () => {
        if (!editCertGalleryUrl.trim() || !editingCert) return;
        setEditingCert({
            ...editingCert,
            gallery: [...(editingCert.gallery || []), editCertGalleryUrl.trim()]
        });
        setEditCertGalleryUrl("");
    };

    const handleRemoveEditCertGalleryImage = (index: number) => {
        if (!editingCert) return;
        setEditingCert({
            ...editingCert,
            gallery: (editingCert.gallery || []).filter((_, i) => i !== index)
        });
    };

    const handleAddProject = async () => {
        if (!newProject.title) return alert("Title (EN) is required");
        try {
            await addDoc(collection(db, "projects"), {
                ...newProject,
                technologies: newProject.technologies || [],
                gallery: newProject.gallery || [],
                createdAt: new Date().toISOString()
            });
            setNewProject({ category: "Web Development", technologies: [], gallery: [] });
            setNewGalleryUrl("");
            alert("Project Added!");
        } catch (error) {
            console.error("Error adding project: ", error);
            alert("Error adding project");
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (confirm("Are you sure?")) {
            await deleteDoc(doc(db, "projects", id));
        }
    };

    const handleStartEditProject = (project: Project) => {
        setEditingProject({ ...project });
        setEditGalleryUrl("");
    };

    const handleSaveEditProject = async () => {
        if (!editingProject) return;
        try {
            const { id, ...data } = editingProject;
            await updateDoc(doc(db, "projects", id), data);
            setEditingProject(null);
            alert("Project Updated!");
        } catch (error) {
            console.error("Error updating project: ", error);
            alert("Error updating project");
        }
    };



    const handleMoveItem = async (collectionName: string, items: any[], item: any, direction: "up" | "down") => {
        const currentIndex = items.findIndex(i => i.id === item.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const targetItem = items[targetIndex];

        // Ensure we have valid order values to swap
        // If order is missing, use the array index as the baseline
        const currentOrder = item.order ?? currentIndex;
        const targetOrder = targetItem.order ?? targetIndex;

        // If they happen to be equal (e.g. both 0 or undefined), we need to force a difference
        // Best strategy: assign precise indices to BOTH based on their new desired positions
        // Actually, just swapping their 'order' values works IF the array was already sorted by order.
        // But if they were both 0, swapping 0 with 0 does nothing.
        // So, we should assign 'targetIndex' to the moving item and 'currentIndex' to the other one.
        // This effectively swaps their positions in a 0-indexed sorted list.

        try {
            await updateDoc(doc(db, collectionName, item.id), { order: targetIndex });
            await updateDoc(doc(db, collectionName, targetItem.id), { order: currentIndex });
        } catch (error) {
            console.error(`Error moving ${collectionName}:`, error);
            alert("Error reordering item");
        }
    };


    // ===== BLOG HANDLERS =====
    const handleAddBlog = async () => {
        if (!newBlog.title) return alert("Title (EN) is required");
        try {
            await addDoc(collection(db, "blogs"), {
                ...newBlog,
                date: newBlog.date || new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            });
            setNewBlog({ category: "General", content: "" });
            alert("Blog Post Added!");
        } catch (error) {
            console.error("Error adding blog: ", error);
            alert("Error adding blog");
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (confirm("Delete this blog post?")) {
            await deleteDoc(doc(db, "blogs", id));
        }
    };

    const handleStartEditBlog = (blog: BlogPost) => {
        setEditingBlog({ ...blog });
    };

    const handleSaveEditBlog = async () => {
        if (!editingBlog) return;
        try {
            const { id, ...data } = editingBlog;
            await updateDoc(doc(db, "blogs", id), data);
            setEditingBlog(null);
            alert("Blog Post Updated!");
        } catch (error) {
            console.error("Error updating blog: ", error);
            alert("Error updating blog");
        }
    };

    // ===== DOWNLOAD HANDLERS =====
    const handleDownloadProjects = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "projects.json");
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleDownloadBlogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blogs, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "blogs.json");
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // ===== MIGRATION HANDLER =====
    const handleMigrateToFirebase = async () => {
        if (!confirm("This will upload all local data (Projects, Blogs, Certificates) to Firebase Firestore. Continue?")) return;

        try {
            const batch = writeBatch(db);

            // Migrating Projects
            projects.forEach(p => {
                const ref = doc(db, "projects", p.id);
                batch.set(ref, p);
            });

            // Migrating Blogs
            blogs.forEach(b => {
                const ref = doc(db, "blogs", b.id);
                batch.set(ref, b);
            });

            // Migrating Certificates
            certificates.forEach(c => {
                const ref = doc(db, "certificates", c.id);
                batch.set(ref, c);
            });

            await batch.commit();
            alert("Migration Successful! All data has been seeded to Firestore. 🚀");
        } catch (error) {
            console.error("Migration failed:", error);
            alert("Migration Failed! Check console for details.");
        }
    };

    // ===== LOGIN SCREEN =====
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-md w-full max-w-sm">
                    <div className="flex items-center gap-2 justify-center mb-4">
                        <Lock className="text-cyan-500" />
                        <h1 className="text-xl font-bold">Admin Access</h1>
                    </div>
                    <input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/50 border border-zinc-700 rounded-lg p-3 focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Unlock Panel
                    </button>
                </form>
            </div>
        );
    }

    // ===== MAIN ADMIN PANEL =====
    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        Admin Panel
                    </h1>
                    <div className="flex gap-2 sm:gap-4 flex-wrap">
                        {activeTab !== "settings" && (
                            <button
                                onClick={activeTab === "projects" ? handleDownloadProjects : handleDownloadBlogs}
                                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                <Download size={16} /> <span className="hidden sm:inline">Download</span> JSON
                            </button>
                        )}
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-red-900/20 text-red-400 hover:bg-red-900/40 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm ${activeTab === "projects"
                            ? "bg-cyan-500 text-black"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                    >
                        <FolderOpen size={16} /> Projects ({projects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("blogs")}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm ${activeTab === "blogs"
                            ? "bg-green-500 text-black"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                    >
                        <FileText size={16} /> Blogs ({blogs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm ${activeTab === "settings"
                            ? "bg-purple-500 text-black"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                    >
                        <Settings size={16} /> Settings
                    </button>
                    <button
                        onClick={() => setActiveTab("certificates")}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm ${activeTab === "certificates"
                            ? "bg-yellow-500 text-black"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                    >
                        <Award size={16} /> Certificates ({certificates.length})
                    </button>
                </div>

                {/* ===== PROJECTS TAB ===== */}
                {activeTab === "projects" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Add/Edit Project Form */}
                        <div className="lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 sm:p-6 h-fit lg:sticky lg:top-8">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                {editingProject ? (
                                    <><Edit3 size={18} className="text-yellow-500" /> Edit Project</>
                                ) : (
                                    <><Plus size={18} className="text-cyan-500" /> Add New Project</>
                                )}
                            </h2>

                            {editingProject ? (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN)" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-yellow-500 outline-none" />
                                    <textarea rows={2} placeholder="Description (EN)" value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={editingProject.title_tr || ""} onChange={e => setEditingProject({ ...editingProject, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-500 outline-none" />
                                    <textarea rows={2} placeholder="Açıklama (TR)" value={editingProject.description_tr || ""} onChange={e => setEditingProject({ ...editingProject, description_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <select value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none">
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Tools">Tools</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Cover Image</label>
                                        <ImageUploader
                                            value={editingProject.image}
                                            onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                                            folder="projects/covers"
                                            placeholder="Cover Image URL"
                                        />
                                    </div>

                                    {/* Gallery */}
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Gallery</label>
                                        <div className="flex gap-2 mb-2">
                                            <div className="flex-1">
                                                <ImageUploader
                                                    value={editGalleryUrl}
                                                    onChange={setEditGalleryUrl}
                                                    folder="projects/gallery"
                                                    placeholder="Add image URL or Upload"
                                                />
                                            </div>
                                            <button type="button" onClick={handleAddEditGalleryImage} className="px-3 bg-yellow-600 rounded-lg"><Plus size={14} /></button>
                                        </div>
                                        {(editingProject.gallery?.length || 0) > 0 && (
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {editingProject.gallery?.map((url, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded p-1 text-xs">
                                                        <span className="truncate flex-1">{url}</span>
                                                        <button onClick={() => handleRemoveEditGalleryImage(i)} className="text-red-400"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Technologies</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" placeholder="Add technology" value={editTechInput} onChange={e => setEditTechInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && editTechInput.trim() && editingProject) { e.preventDefault(); setEditingProject({ ...editingProject, technologies: [...(editingProject.technologies || []), editTechInput.trim()] }); setEditTechInput(""); } }} className="flex-1 bg-black/50 border border-zinc-700 rounded-lg p-2 text-xs outline-none" />
                                            <button type="button" onClick={() => { if (editTechInput.trim() && editingProject) { setEditingProject({ ...editingProject, technologies: [...(editingProject.technologies || []), editTechInput.trim()] }); setEditTechInput(""); } }} className="px-3 bg-purple-600 rounded-lg"><Plus size={14} /></button>
                                        </div>
                                        {(editingProject.technologies?.length || 0) > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {editingProject.technologies?.map((tech, i) => (
                                                    <span key={i} className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs">
                                                        {tech}
                                                        <button onClick={() => setEditingProject({ ...editingProject, technologies: editingProject.technologies?.filter((_, idx) => idx !== i) })} className="hover:text-red-400"><X size={10} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <input type="text" placeholder="GitHub URL" value={editingProject.githubUrl || ""} onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Demo URL" value={editingProject.demoUrl || ""} onChange={e => setEditingProject({ ...editingProject, demoUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleSaveEditProject} className="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 flex items-center justify-center gap-2 text-sm"><Check size={16} /> Save</button>
                                        <button onClick={() => setEditingProject(null)} className="px-4 bg-zinc-700 py-2.5 rounded-lg hover:bg-zinc-600 text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN) *" value={newProject.title || ""} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-cyan-500 outline-none" />
                                    <textarea rows={2} placeholder="Description (EN)" value={newProject.description || ""} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={newProject.title_tr || ""} onChange={e => setNewProject({ ...newProject, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-500 outline-none" />
                                    <textarea rows={2} placeholder="Açıklama (TR)" value={newProject.description_tr || ""} onChange={e => setNewProject({ ...newProject, description_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <select value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value as any })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none">
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Tools">Tools</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Cover Image</label>
                                        <ImageUploader
                                            value={newProject.image || ""}
                                            onChange={(url) => setNewProject({ ...newProject, image: url })}
                                            folder="projects/covers"
                                            placeholder="Cover Image URL"
                                        />
                                    </div>

                                    {/* Gallery */}
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Gallery</label>
                                        <div className="flex gap-2 mb-2">
                                            <div className="flex-1">
                                                <ImageUploader
                                                    value={newGalleryUrl}
                                                    onChange={setNewGalleryUrl}
                                                    folder="projects/gallery"
                                                    placeholder="Add image URL or Upload"
                                                />
                                            </div>
                                            <button type="button" onClick={handleAddGalleryImage} className="px-3 bg-cyan-600 rounded-lg"><Plus size={14} /></button>
                                        </div>
                                        {(newProject.gallery?.length || 0) > 0 && (
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {newProject.gallery?.map((url, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded p-1 text-xs">
                                                        <span className="truncate flex-1">{url}</span>
                                                        <button onClick={() => handleRemoveGalleryImage(i)} className="text-red-400"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Technologies</label>
                                        <div className="flex gap-2 mb-2">
                                            <input type="text" placeholder="Add technology (Enter to add)" value={newTechInput} onChange={e => setNewTechInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newTechInput.trim()) { e.preventDefault(); setNewProject({ ...newProject, technologies: [...(newProject.technologies || []), newTechInput.trim()] }); setNewTechInput(""); } }} className="flex-1 bg-black/50 border border-zinc-700 rounded-lg p-2 text-xs outline-none" />
                                            <button type="button" onClick={() => { if (newTechInput.trim()) { setNewProject({ ...newProject, technologies: [...(newProject.technologies || []), newTechInput.trim()] }); setNewTechInput(""); } }} className="px-3 bg-purple-600 rounded-lg"><Plus size={14} /></button>
                                        </div>
                                        {(newProject.technologies?.length || 0) > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {newProject.technologies?.map((tech, i) => (
                                                    <span key={i} className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs">
                                                        {tech}
                                                        <button onClick={() => setNewProject({ ...newProject, technologies: newProject.technologies?.filter((_, idx) => idx !== i) })} className="hover:text-red-400"><X size={10} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <input type="text" placeholder="GitHub URL" value={newProject.githubUrl || ""} onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Demo URL" value={newProject.demoUrl || ""} onChange={e => setNewProject({ ...newProject, demoUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    <button onClick={handleAddProject} className="bg-cyan-500 text-black font-bold py-2.5 rounded-lg hover:bg-cyan-400 flex items-center justify-center gap-2 mt-2 text-sm">
                                        <Plus size={16} /> Add Project
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Projects List */}
                        <div className="lg:col-span-2 space-y-3">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-zinc-700 transition-colors">
                                    <img src={project.image} alt={project.title} className="w-full sm:w-24 h-32 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-sm truncate">{project.title}</h3>
                                            {project.title_tr && <span className="text-xs text-zinc-500">/ {project.title_tr}</span>}
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">{project.category}</span>
                                        </div>
                                        <p className="text-zinc-400 text-xs line-clamp-2 mb-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies?.slice(0, 3).map(t => (
                                                <span key={t} className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMoveItem("projects", projects, project, "up")}
                                                disabled={projects.indexOf(project) === 0}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveItem("projects", projects, project, "down")}
                                                disabled={projects.indexOf(project) === projects.length - 1}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                        </div>
                                        <button onClick={() => handleStartEditProject(project)} className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== BLOGS TAB ===== */}
                {activeTab === "blogs" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Add/Edit Blog Form */}
                        <div className="lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 sm:p-6 h-fit lg:sticky lg:top-8">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                {editingBlog ? (
                                    <><Edit3 size={18} className="text-yellow-500" /> Edit Blog</>
                                ) : (
                                    <><Plus size={18} className="text-green-500" /> Add New Blog</>
                                )}
                            </h2>

                            {editingBlog ? (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN)" value={editingBlog.title} onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Category (EN)" value={editingBlog.category} onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <textarea rows={2} placeholder="Excerpt (EN)" value={editingBlog.excerpt} onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <textarea rows={4} placeholder="Content (EN)" value={editingBlog.content} onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={editingBlog.title_tr || ""} onChange={e => setEditingBlog({ ...editingBlog, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Kategori (TR)" value={editingBlog.category_tr || ""} onChange={e => setEditingBlog({ ...editingBlog, category_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <textarea rows={2} placeholder="Özet (TR)" value={editingBlog.excerpt_tr || ""} onChange={e => setEditingBlog({ ...editingBlog, excerpt_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <textarea rows={4} placeholder="İçerik (TR)" value={editingBlog.content_tr || ""} onChange={e => setEditingBlog({ ...editingBlog, content_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <input type="text" placeholder="Okuma Süresi (TR) (örn: 3 dk)" value={editingBlog.readTime_tr || ""} onChange={e => setEditingBlog({ ...editingBlog, readTime_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mt-2" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Cover Image</label>
                                            <ImageUploader
                                                value={editingBlog.image}
                                                onChange={(url) => setEditingBlog({ ...editingBlog, image: url })}
                                                folder="blogs/covers"
                                                placeholder="Cover Image URL"
                                            />
                                        </div>
                                        <input type="date" value={editingBlog.date} onChange={e => setEditingBlog({ ...editingBlog, date: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mb-2" />
                                        <input type="text" placeholder="Read Time (e.g. 5 min)" value={editingBlog.readTime || ""} onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleSaveEditBlog} className="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 flex items-center justify-center gap-2 text-sm"><Check size={16} /> Save</button>
                                        <button onClick={() => setEditingBlog(null)} className="px-4 bg-zinc-700 py-2.5 rounded-lg hover:bg-zinc-600 text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN) *" value={newBlog.title || ""} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Category (EN)" value={newBlog.category || ""} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <textarea rows={2} placeholder="Excerpt (EN)" value={newBlog.excerpt || ""} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <textarea rows={4} placeholder="Content (EN)" value={newBlog.content || ""} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={newBlog.title_tr || ""} onChange={e => setNewBlog({ ...newBlog, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Kategori (TR)" value={newBlog.category_tr || ""} onChange={e => setNewBlog({ ...newBlog, category_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <textarea rows={2} placeholder="Özet (TR)" value={newBlog.excerpt_tr || ""} onChange={e => setNewBlog({ ...newBlog, excerpt_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <textarea rows={4} placeholder="İçerik (TR)" value={newBlog.content_tr || ""} onChange={e => setNewBlog({ ...newBlog, content_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none resize-none" />
                                    <input type="text" placeholder="Okuma Süresi (TR) (örn: 3 dk)" value={newBlog.readTime_tr || ""} onChange={e => setNewBlog({ ...newBlog, readTime_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mt-2" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Cover Image</label>
                                            <ImageUploader
                                                value={newBlog.image || ""}
                                                onChange={(url) => setNewBlog({ ...newBlog, image: url })}
                                                folder="blogs/covers"
                                                placeholder="Cover Image URL"
                                            />
                                        </div>
                                        <input type="date" value={newBlog.date || ""} onChange={e => setNewBlog({ ...newBlog, date: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mb-2" />
                                        <input type="text" placeholder="Read Time (e.g. 5 min)" value={newBlog.readTime || ""} onChange={e => setNewBlog({ ...newBlog, readTime: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    </div>

                                    <button onClick={handleAddBlog} className="bg-green-500 text-black font-bold py-2.5 rounded-lg hover:bg-green-400 flex items-center justify-center gap-2 mt-2 text-sm">
                                        <Plus size={16} /> Add Blog Post
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Blogs List */}
                        <div className="lg:col-span-2 space-y-3">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-zinc-700 transition-colors">
                                    <img src={blog.image} alt={blog.title} className="w-full sm:w-24 h-32 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-sm truncate">{blog.title}</h3>
                                            {blog.title_tr && <span className="text-xs text-zinc-500">/ {blog.title_tr}</span>}
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{blog.category}</span>
                                        </div>
                                        <p className="text-zinc-400 text-xs line-clamp-2 mb-1">{blog.excerpt}</p>
                                        <span className="text-[10px] text-zinc-500">{blog.date} • {blog.readTime}</span>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMoveItem("blogs", blogs, blog, "up")}
                                                disabled={blogs.indexOf(blog) === 0}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveItem("blogs", blogs, blog, "down")}
                                                disabled={blogs.indexOf(blog) === blogs.length - 1}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                        </div>
                                        <button onClick={() => handleStartEditBlog(blog)} className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"><Edit3 size={14} /></button>
                                        <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {blogs.length === 0 && (
                                <div className="text-center py-12 text-zinc-500">
                                    <FileText size={48} className="mx-auto mb-4 opacity-30" />
                                    <p>No blog posts yet. Add your first post!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== SETTINGS TAB ===== */}
                {activeTab === "settings" && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Settings size={20} className="text-purple-500" /> General Settings
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CV Settings */}
                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700 md:col-span-2">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <FileText size={16} className="text-cyan-500" /> CV / Resume Management
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase mb-2 block font-bold">English CV (PDF)</label>
                                            <ImageUploader
                                                value={profile.cv_en || ""}
                                                onChange={(url) => updateProfile("cv_en", url)}
                                                placeholder="Upload EN CV PDF"
                                                folder="cv"
                                                accept="application/pdf"
                                            />
                                            <p className="text-[10px] text-zinc-600 mt-2">
                                                Upload PDF (Max 700KB). Stored in database.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase mb-2 block font-bold">Turkish CV (PDF)</label>
                                            <ImageUploader
                                                value={profile.cv_tr || ""}
                                                onChange={(url) => updateProfile("cv_tr", url)}
                                                placeholder="Upload TR CV PDF"
                                                folder="cv"
                                                accept="application/pdf"
                                            />
                                            <p className="text-[10px] text-zinc-600 mt-2">
                                                Upload PDF (Max 700KB). Stored in database.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Migration Tool */}
                                <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 md:col-span-2">
                                    <h3 className="font-medium mb-3 flex items-center gap-2 text-orange-500">
                                        <Database size={16} /> Data Migration
                                    </h3>
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-zinc-400 text-sm">
                                            Upload local JSON data to Firestore (Run once).
                                        </p>
                                        <button
                                            onClick={handleMigrateToFirebase}
                                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                                        >
                                            <Database size={16} /> Seed Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== CERTIFICATES TAB ===== */}
                {activeTab === "certificates" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Add/Edit Certificate Form */}
                        <div className="lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 sm:p-6 h-fit lg:sticky lg:top-8">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                {editingCert ? (
                                    <><Edit3 size={18} className="text-yellow-500" /> Edit Certificate</>
                                ) : (
                                    <><Plus size={18} className="text-yellow-500" /> Add New Certificate</>
                                )}
                            </h2>

                            {editingCert ? (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN)" value={editingCert.title} onChange={e => setEditingCert({ ...editingCert, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Issuer (EN)" value={editingCert.issuer} onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Month/Day/Year (e.g. 05/20/2024)" value={editingCert.date} onChange={e => setEditingCert({ ...editingCert, date: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={editingCert.title_tr || ""} onChange={e => setEditingCert({ ...editingCert, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Veren Kurum (TR)" value={editingCert.issuer_tr || ""} onChange={e => setEditingCert({ ...editingCert, issuer_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Gün.Ay.Yıl (örn. 20.05.2024)" value={editingCert.date_tr || ""} onChange={e => setEditingCert({ ...editingCert, date_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Certificate Image</label>
                                            <ImageUploader
                                                value={editingCert.image}
                                                onChange={(url) => setEditingCert({ ...editingCert, image: url })}
                                                folder="certificates"
                                                placeholder="Cover Image URL"
                                            />
                                        </div>

                                        {/* Gallery */}
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Gallery</label>
                                            <div className="flex gap-2 mb-2">
                                                <div className="flex-1">
                                                    <ImageUploader
                                                        value={editCertGalleryUrl}
                                                        onChange={setEditCertGalleryUrl}
                                                        folder="certificates/gallery"
                                                        placeholder="Add image URL or Upload"
                                                    />
                                                </div>
                                                <button type="button" onClick={handleAddEditCertGalleryImage} className="px-3 bg-yellow-600 rounded-lg"><Plus size={14} /></button>
                                            </div>
                                            {(editingCert.gallery?.length || 0) > 0 && (
                                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                                    {editingCert.gallery?.map((url, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded p-1 text-xs">
                                                            <span className="truncate flex-1">{url}</span>
                                                            <button onClick={() => handleRemoveEditCertGalleryImage(i)} className="text-red-400"><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <input type="text" placeholder="Credential URL (optional)" value={editingCert.credentialUrl || ""} onChange={e => setEditingCert({ ...editingCert, credentialUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mb-2" />
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button onClick={async () => {
                                            if (!editingCert) return;
                                            try {
                                                const { id, ...data } = editingCert;
                                                await updateDoc(doc(db, "certificates", id), data);
                                                setEditingCert(null);
                                                alert("Certificate Updated!");
                                            } catch (error) {
                                                console.error("Error updating certificate: ", error);
                                                alert("Error updating certificate");
                                            }
                                        }} className="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 flex items-center justify-center gap-2 text-sm"><Check size={16} /> Save</button>
                                        <button onClick={() => setEditingCert(null)} className="px-4 bg-zinc-700 py-2.5 rounded-lg hover:bg-zinc-600 text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {/* EN Fields */}
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase">
                                        <Globe size={12} /> English
                                    </div>
                                    <input type="text" placeholder="Title (EN) *" value={newCert.title || ""} onChange={e => setNewCert({ ...newCert, title: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Issuer (EN) *" value={newCert.issuer || ""} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Month/Day/Year (e.g. 05/20/2024)" value={newCert.date || ""} onChange={e => setNewCert({ ...newCert, date: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    {/* TR Fields */}
                                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase mt-2">
                                        <Globe size={12} /> Türkçe
                                    </div>
                                    <input type="text" placeholder="Başlık (TR)" value={newCert.title_tr || ""} onChange={e => setNewCert({ ...newCert, title_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Veren Kurum (TR)" value={newCert.issuer_tr || ""} onChange={e => setNewCert({ ...newCert, issuer_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />
                                    <input type="text" placeholder="Gün.Ay.Yıl (örn. 20.05.2024)" value={newCert.date_tr || ""} onChange={e => setNewCert({ ...newCert, date_tr: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none" />

                                    {/* Common Fields */}
                                    <div className="border-t border-zinc-800 pt-3 mt-2">
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Certificate Image</label>
                                            <ImageUploader
                                                value={newCert.image || ""}
                                                onChange={(url) => setNewCert({ ...newCert, image: url })}
                                                folder="certificates"
                                                placeholder="Cover Image URL"
                                            />
                                        </div>

                                        {/* Gallery */}
                                        <div className="mb-2">
                                            <label className="text-xs text-zinc-500 uppercase mb-1 block">Gallery</label>
                                            <div className="flex gap-2 mb-2">
                                                <div className="flex-1">
                                                    <ImageUploader
                                                        value={newCertGalleryUrl}
                                                        onChange={setNewCertGalleryUrl}
                                                        folder="certificates/gallery"
                                                        placeholder="Add image URL or Upload"
                                                    />
                                                </div>
                                                <button type="button" onClick={handleAddCertGalleryImage} className="px-3 bg-yellow-600 rounded-lg"><Plus size={14} /></button>
                                            </div>
                                            {(newCert.gallery?.length || 0) > 0 && (
                                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                                    {newCert.gallery?.map((url, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded p-1 text-xs">
                                                            <span className="truncate flex-1">{url}</span>
                                                            <button onClick={() => handleRemoveCertGalleryImage(i)} className="text-red-400"><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <input type="text" placeholder="Credential URL (optional)" value={newCert.credentialUrl || ""} onChange={e => setNewCert({ ...newCert, credentialUrl: e.target.value })} className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none mb-2" />
                                    </div>

                                    <button onClick={async () => {
                                        if (!newCert.title || !newCert.issuer || !newCert.image) return alert("Title, Issuer and Image are required");
                                        try {
                                            await addDoc(collection(db, "certificates"), {
                                                ...newCert,
                                                createdAt: new Date().toISOString()
                                            });
                                            setNewCert({});
                                            alert("Certificate Added!");
                                        } catch (error) {
                                            console.error("Error adding certificate: ", error);
                                            alert("Error adding certificate");
                                        }
                                    }} className="bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 flex items-center justify-center gap-2 mt-2 text-sm">
                                        <Plus size={16} /> Add Certificate
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Certificates List */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => {
                                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificates, null, 2));
                                        const a = document.createElement('a');
                                        a.setAttribute("href", dataStr);
                                        a.setAttribute("download", "certificates.json");
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                    }}
                                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg transition-colors text-sm"
                                >
                                    <Download size={16} /> Download JSON
                                </button>
                            </div>
                            {certificates.map((cert) => (
                                <div key={cert.id} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-zinc-700 transition-colors">
                                    <img src={cert.image} alt={cert.title} className="w-full sm:w-24 h-32 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-sm truncate">{cert.title}</h3>
                                            {cert.title_tr && <span className="text-xs text-zinc-500">/ {cert.title_tr}</span>}
                                        </div>
                                        <p className="text-zinc-400 text-xs mb-1">{cert.issuer}</p>
                                        <span className="text-[10px] text-zinc-500">{cert.date}</span>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMoveItem("certificates", certificates, cert, "up")}
                                                disabled={certificates.indexOf(cert) === 0}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleMoveItem("certificates", certificates, cert, "down")}
                                                disabled={certificates.indexOf(cert) === certificates.length - 1}
                                                className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                        </div>
                                        <button onClick={() => setEditingCert({ ...cert })} className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"><Edit3 size={14} /></button>
                                        <button onClick={async () => { if (confirm("Delete this certificate?")) await deleteDoc(doc(db, "certificates", cert.id)); }} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {certificates.length === 0 && (
                                <div className="text-center py-12 text-zinc-500">
                                    <Award size={48} className="mx-auto mb-4 opacity-30" />
                                    <p>No certificates yet. Add your first certificate!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );
}
