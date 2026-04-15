import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { headers, cookies } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import NextTopLoader from 'nextjs-toploader';
import { NavigationLoader } from "@/components/NavigationLoader";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "Migra | Contextual Library",
  description: "Modern e-commerce platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("migra_lang")?.value || "en") as any;

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50/50">
        <NextTopLoader
          color="#000"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #000,0 0 5px #000"
        />
        <LanguageProvider initialLanguage={lang}>
          <Header />
          {children}

          {/* Global Navigation Overlay (Visible only when nprogress is active via CSS) */}
          <div id="global-nav-loader" className="fixed inset-0 z-[9998] opacity-0 pointer-events-none flex items-center justify-center bg-white/40 backdrop-blur-[2px] transition-all duration-700 ease-in-out">
            <NavigationLoader />
          </div>
          <ToastContainer />
        </LanguageProvider>
      </body>
    </html>
  );
}
