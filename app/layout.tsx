import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MouseGlow } from "@/components/MouseGlow";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Arda Bölükbaşı | Software Developer",
  description: "Arda Bölükbaşı - Yazılım Geliştirme Öğrencisi. Python, SQL, CustomTkinter ve Veri Bilimi alanında ölçeklenebilir projeler geliştiren Software Developer portfolyosu.",
  keywords: ["Arda Bölükbaşı", "Arda Bolukbasi", "Software Developer", "Yazılım Geliştirici", "Python", "SQL", "Portfolio", "Istanbul", "İstanbul Aydın Üniversitesi", "CustomTkinter"],
  authors: [{ name: "Arda Bölükbaşı" }],
  verification: {
    google: "1PHJhKQEE6o1mOQVxmdcryakaPJaRLkEj8AB9gaH4XQ",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <LanguageProvider>
          <MouseGlow />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
