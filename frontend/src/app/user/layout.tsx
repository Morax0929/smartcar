"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, CarFront, User, LogOut, ShieldAlert, CalendarClock, Files } from 'lucide-react';
import Chatbot from '@/components/chat/Chatbot';
import Cookies from 'js-cookie';

const PAGE_TITLES: Record<string, string> = {
  '/user': 'Bosh Sahifa',
  '/user/cars': 'Avtomobil Katalogi',
  '/user/profile': 'Shaxsiy Profil',
  '/user/bookings': 'Mening Ijaralarim',
  '/user/documents': 'Mening Hujjatlarim',
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('Foydalanuvchi');
  const [userInitials, setUserInitials] = useState('F');

  useEffect(() => {
    const token = Cookies.get('access_token');
    const role = Cookies.get('user_role');

    if (!token) { router.push('/login'); return; }
    if (role === 'admin') { router.push('/admin'); return; }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email: string = payload.sub || '';
      const name = email.split('@')[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      setUserName(displayName);
      setUserInitials(displayName.charAt(0).toUpperCase());
    } catch { setUserName('Foydalanuvchi'); }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user_role');
    router.push('/login');
  };

  const navLinks = [
    { href: '/user', label: 'Bosh Sahifa', icon: Home },
    { href: '/user/cars', label: 'Avtomobillar Katalogi', icon: CarFront },
    { href: '/user/bookings', label: 'Mening Ijaralarim', icon: CalendarClock },
    { href: '/user/documents', label: 'Mening Hujjatlarim', icon: Files },
    { href: '/user/profile', label: 'Shaxsiy Profil', icon: User },
  ];

  const pageTitle = PAGE_TITLES[pathname] || 'Mijoz Paneli';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0">
        {/* Logo */}
        <Link href="/" className="h-16 flex items-center px-5 border-b border-slate-800 text-white hover:bg-slate-800 transition-colors">
          <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-bold text-base">SmartCar AI</span>
        </Link>

        {/* Foydalanuvchi Profili */}
        <div className="px-3 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{userName}</p>
              <p className="text-amber-400 text-xs font-medium">Mijoz</p>
            </div>
          </div>
        </div>

        {/* Navigatsiya */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Menyu</p>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Chiqish */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* Asosiy Kontent */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{pageTitle}</h2>
          <Link href="/user/profile" className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors">
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs">
              {userInitials}
            </div>
            <span className="text-sm font-bold text-slate-700">{userName}</span>
          </Link>
        </header>

        {/* Sahifa Mazmuni */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}
