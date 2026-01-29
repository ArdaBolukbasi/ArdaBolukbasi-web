"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "tr" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navbar
        "nav.about": "About",
        "nav.projects": "Projects",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "nav.viewCv": "View CV",

        // About Section
        "about.badge": "Available for Freelance Projects",
        "about.title": "About Me",
        "about.heading": "Full Stack Developer & Problem Solver",
        "about.description1": "I'm Arda, a 2nd-year Software Development student at Istanbul Aydin University. I believe no problem is unsolvable, and I quickly adapt to the necessary technologies.",
        "about.description2": "My Strategic Approach:",
        "about.description3": "My priority is to provide the best system for the user.",
        "about.email": "Email",
        "about.phone": "Phone",
        "about.birthday": "Birthday",
        "about.birthdayValue": "September 3, 2005",
        "about.university": "Istanbul Aydin University",
        "about.role": "Software Developer",
        "about.yearsCoding": "Years Coding",
        "about.projectsCount": "Projects",
        "about.certificates": "Certificates",
        "about.technologies": "Technologies I Work With",
        "about.availableForWork": "Available for Work",
        "about.location": "Istanbul, Turkey",

        // Projects Section
        "projects.title": "Portfolio",
        "projects.heading": "Selected Works",
        "projects.viewProject": "View Project",
        "projects.all": "All",
        "projects.mobileApp": "Mobile App",
        "projects.webDevelopment": "Web Development",
        "projects.tools": "Tools",
        "projects.liveDemo": "Live Demo",
        "projects.sourceCode": "Source Code",
        "projects.technologies": "Technologies",
        "projects.date": "Date",

        // Blog Section
        "blog.title": "Blog",
        "blog.heading": "Latest Articles",
        "blog.description": "Articles about software, technology and my experiences",
        "blog.empty": "No blog posts yet. You can add from admin panel.",
        "blog.readMore": "Read More",
        "blog.back": "Go Back",

        // Contact Section
        "contact.title": "Contact",
        "contact.heading": "Let's Work Together",
        "contact.description": "Have a project in mind? I'd love to hear about it. Send me a message and let's bring your ideas to life.",
        "contact.email": "Email",
        "contact.location": "Location",
        "contact.quickChat": "Prefer a quick chat?",
        "contact.linkedinCta": "Connect with me on LinkedIn for a faster response.",
        "contact.openLinkedin": "Open LinkedIn Profile",
        "contact.yourName": "Your Name",
        "contact.emailAddress": "Email Address",
        "contact.yourMessage": "Your Message",
        "contact.messagePlaceholder": "Tell me about your project...",
        "contact.sendMessage": "Send Message",
        "contact.sending": "Sending...",
        "contact.messageSent": "Message Sent!",
        "contact.tryAgain": "Try Again",

        // Footer
        "footer.rights": "All rights reserved.",

        // CV Modal
        "cv.title": "My CV / Resume",
        "cv.downloadHint": "Click the button to download the PDF",
        "cv.download": "Download CV",

        // Certificates Section
        "certificates.title": "Certificates",
        "certificates.heading": "My Certifications",
        "certificates.description": "Professional certifications and achievements",
        "certificates.viewCredential": "View Credential",
    },
    tr: {
        // Navbar
        "nav.about": "Hakkımda",
        "nav.projects": "Projeler",
        "nav.blog": "Blog",
        "nav.contact": "İletişim",
        "nav.viewCv": "CV Görüntüle",

        // About Section
        "about.badge": "Freelance Projelere Açığım",
        "about.title": "Hakkımda",
        "about.heading": "Full Stack Geliştirici & Problem Çözücü",
        "about.description1": "İstanbul Aydın Üniversitesi'nde 2. sınıf Yazılım Geliştirme öğrencisiyim. Hiçbir problemin çözülemez olmadığına inanıyorum ve gerekli teknolojilere hızla adapte oluyorum.",
        "about.description2": "Stratejik Yaklaşımım:",
        "about.description3": "Önceliğim kullanıcı için en iyi sistemi sağlamak.",
        "about.email": "E-posta",
        "about.phone": "Telefon",
        "about.birthday": "Doğum Günü",
        "about.birthdayValue": "3 Eylül 2005",
        "about.university": "İstanbul Aydın Üniversitesi",
        "about.role": "Yazılım Geliştirici",
        "about.yearsCoding": "Yıl Kodlama",
        "about.projectsCount": "Proje",
        "about.certificates": "Sertifika",
        "about.technologies": "Çalıştığım Teknolojiler",
        "about.availableForWork": "İşe Açığım",
        "about.location": "İstanbul, Türkiye",

        // Projects Section
        "projects.title": "Portföy",
        "projects.heading": "Seçili İşler",
        "projects.viewProject": "Projeyi Görüntüle",
        "projects.all": "Tümü",
        "projects.mobileApp": "Mobil Uygulama",
        "projects.webDevelopment": "Web Geliştirme",
        "projects.tools": "Araçlar",
        "projects.liveDemo": "Canlı Demo",
        "projects.sourceCode": "Kaynak Kod",
        "projects.technologies": "Teknolojiler",
        "projects.date": "Tarih",

        // Blog Section
        "blog.title": "Blog",
        "blog.heading": "Son Yazılar",
        "blog.description": "Yazılım, teknoloji ve deneyimlerim hakkında yazılar",
        "blog.empty": "Henüz blog yazısı yok. Admin panelinden ekleyebilirsiniz.",
        "blog.readMore": "Devamını Oku",
        "blog.back": "Geri Dön",

        // Contact Section
        "contact.title": "İletişim",
        "contact.heading": "Birlikte Çalışalım",
        "contact.description": "Aklınızda bir proje mi var? Duymayı çok isterim. Bana mesaj gönderin ve fikirlerinizi hayata geçirelim.",
        "contact.email": "E-posta",
        "contact.location": "Konum",
        "contact.quickChat": "Hızlı bir sohbet ister misiniz?",
        "contact.linkedinCta": "Daha hızlı yanıt için LinkedIn'den bağlanın.",
        "contact.openLinkedin": "LinkedIn Profilimi Aç",
        "contact.yourName": "Adınız",
        "contact.emailAddress": "E-posta Adresiniz",
        "contact.yourMessage": "Mesajınız",
        "contact.messagePlaceholder": "Projeniz hakkında bilgi verin...",
        "contact.sendMessage": "Mesaj Gönder",
        "contact.sending": "Gönderiliyor...",
        "contact.messageSent": "Mesaj Gönderildi!",
        "contact.tryAgain": "Tekrar Dene",

        // Footer
        "footer.rights": "Tüm hakları saklıdır.",

        // CV Modal
        "cv.title": "CV / Özgeçmiş",
        "cv.downloadHint": "PDF'i indirmek için butona tıklayın",
        "cv.download": "CV İndir",

        // Certificates Section
        "certificates.title": "Sertifikalar",
        "certificates.heading": "Sertifikalarım",
        "certificates.description": "Profesyonel sertifikalar ve başarılar",
        "certificates.viewCredential": "Sertifikayı Görüntüle",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
