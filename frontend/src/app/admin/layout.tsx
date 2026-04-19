"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Car, CalendarDays, Users, Bot, LogOut, ShieldAlert, Wrench, Menu, X } from 'lucide-react';
import Cookies from 'js-cookie';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Boshqaruv Paneli',
  '/admin/cars': 'Avtomobillar Boshqaruvi',
  '/admin/bookings': 'Buyurtmalar Nazorati',
  '/admin/users': 'Mijozlar va Reytinglar',
  '/admin/ai-agent': '🤖 AI Komandir',
  '/admin/maintenance': 'Texnik Xizmat (AI Maintenance)',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('Administrator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    const role = Cookies.get('user_role');

    if (!token) { router.push('/login'); return; }
    if (role !== 'admin') { router.push('/user'); return; }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email: string = payload.sub || '';
      const name = email.split('@')[0];
      setAdminName(name.charAt(0).toUpperCase() + name.slice(1));
    } catch { setAdminName('Administrator'); }
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
    { href: '/admin', label: 'Boshqaruv Paneli', icon: LayoutDashboard },
    { href: '/admin/cars', label: 'Avtomobillar', icon: Car },
    { href: '/admin/bookings', label: 'Buyurtmalar', icon: CalendarDays },
    { href: '/admin/users', label: 'Mijozlar', icon: Users },
    { href: '/admin/maintenance', label: 'Texnik Xizmat', icon: Wrench },
  ];

  const pageTitle = PAGE_TITLES[pathname] || 'Boshqaruv Paneli';

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
            <div className="bg-slate-700 rounded-md p-1.5 flex items-center justify-center mr-2">
              <Car className="h-4 w-4 text-amber-500" />
            </div>
            <span className="font-bold text-base">SmartCar AI</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profili */}
        <div className="px-3 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{adminName}</p>
              <p className="text-amber-400 text-xs font-medium flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5" /> Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigatsiya */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Asosiy</p>
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

          <div className="pt-3">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Sun'iy Intellekt</p>
            <Link
              href="/admin/ai-agent"
              className={`flex items-center px-3 py-2.5 rounded-xl font-bold text-sm transition-colors border ${
                pathname === '/admin/ai-agent'
                  ? 'bg-amber-500 text-slate-900 border-amber-500'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              <Bot className="w-4 h-4 mr-3" />
              AI Komandir
            </Link>
          </div>
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

      {/* Asosiy kontent */}
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
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-sm font-bold text-slate-700">{adminName}</span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </header>

        {/* Sahifa Mazmuni */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
