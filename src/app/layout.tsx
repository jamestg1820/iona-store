import type { Metadata } from "next";
import { Inter, Italiana } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

import FacebookPixel from "@/components/FacebookPixel";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tienda Oficial IONA | Carteras, Maletas y Accesorios",
  description: "En IONA encuentra carteras y maletas para mujer con diseño exclusivo y elegancia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F5F5]">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-VR4XS3437H'} />
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <Navbar />
        <main className="flex-grow bg-white w-full mx-auto">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: 'none' } }} />
      </body>
    </html>
  );
}
