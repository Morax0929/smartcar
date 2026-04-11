import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { LanguageProvider } from "@/context/LanguageContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartCar AI - Sifatli Ijara",
  description: "Avtomobil ijarasida Sun'iy Intellekt davri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${outfit.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
