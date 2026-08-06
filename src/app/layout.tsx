import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOVVA — Ropa de Hombre",
  description:
    "NOVVA es una tienda de ropa de hombre con estilo urbano nocturno. Descubre prendas exclusivas, minimalistas y versátiles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-novva-black text-novva-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
