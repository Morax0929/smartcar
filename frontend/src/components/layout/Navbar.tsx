"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, UserCircle, Globe } from "lucide-react";
import Cookies from "js-cookie";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const token = Cookies.get("access_token");
    const role = Cookies.get("user_role");

    if (token && role) {
      // Token ichidan ismni olish uchun JWT decode
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.sub || "";
        // Email dan ism yasash (email@domain.com → Email)
        const name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
        setUser({ name, role });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user_role");
    setUser(null);
    router.push("/login");
  };

  const dashboardLink = user?.role === "admin" ? "/admin" : "/user";
  const displayName = user?.role === "admin" ? "Admin" : user?.name || "User";

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            <span className="font-bold text-xl tracking-tight">SmartCar AI</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition group">
              {t("home")}
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-amber-500"></span>
            </Link>
            <Link href="/user/cars" className="text-sm font-medium text-slate-300 hover:text-white transition group">
              {t("cars")}
            </Link>
            {user && (
              <Link href={dashboardLink} className="text-sm font-medium text-slate-300 hover:text-white transition group">
                {user.role === "admin" ? t("admin") : t("dashboard")}
              </Link>
            )}
          </div>

          {/* Right side: Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative group flex items-center mr-2">
              <Globe className="w-4 h-4 text-slate-400 mr-2" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-sm font-medium text-slate-300 hover:text-white cursor-pointer focus:outline-none appearance-none pr-4"
              >
                <option value="uz" className="bg-slate-900 text-white">UZ</option>
                <option value="ru" className="bg-slate-900 text-white">RU</option>
                <option value="en" className="bg-slate-900 text-white">EN</option>
              </select>
            </div>

            {user ? (
              <>
                {/* Foydalanuvchi avatari + Ismi */}
                <Link href={dashboardLink} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200">{displayName}</span>
                </Link>
                {/* Chiqish tugmasi */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
              >
                {t("login")}
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
