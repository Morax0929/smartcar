"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Dashboard sahifalarda Navbar va Footer ko'rsatilmaydi
const DASHBOARD_PREFIXES = ["/admin", "/user", "/login", "/register"];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
