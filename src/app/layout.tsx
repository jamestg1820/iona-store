import type { Metadata } from "next";
import { Inter, Italiana } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "sonner";

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
  title: "Tienda Oficial Totto | Morrales, Viaje, Accesorios y Ropa",
  description: "En Totto encuentra maletas y ropa para mujer, hombre y niños, maletas de viaje y complementos, accesorios y artículos para tu mascota.",
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
