"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, CarFront, Car, User, LogOut, CalendarClock, Files, Menu, X } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-60
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link href="/" className="flex items-center text-white hover:text-amber-500 transition-colors">
            <div className="bg-slate-800 rounded-md p-1.5 flex items-center justify-center mr-2">
              <Car className="h-4 w-4 text-amber-500" />
            </div>
            <span className="font-bold text-base">SmartCar AI</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

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
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base lg:text-lg font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">{pageTitle}</h2>
          </div>
          
          <Link href="/user/profile" className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors shrink-0">
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
              {userInitials}
            </div>
            <span className="hidden sm:inline text-sm font-bold text-slate-700">{userName}</span>
          </Link>
        </header>

        {/* Sahifa Mazmuni */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}
