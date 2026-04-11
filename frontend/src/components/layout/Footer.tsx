import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4 text-white">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            <span className="font-bold text-xl tracking-tight">SmartCar</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Avtomobil ijarasida sun'iy intellektga asoslangan birinchi platforma. Tez, ishonchli va arzon.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Kompaniya</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-amber-500 transition">Biz haqimizda</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">Vakansiyalar</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">Bog'lanish</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Xizmatlar</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-amber-500 transition">Avtomobillar ijarasi</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">Korpaprativ mijozlar uchun</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">Sodiqlik dasturi</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Qo'llab-quvvatlash</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-amber-500 transition">Yordam markazi</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">AI Chatbot yordami</Link></li>
            <li><Link href="/" className="hover:text-amber-500 transition">Qoidalar va shartlar</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} SmartCar AI. Barcha huquqlar himoyalangan.</p>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <span className="cursor-pointer hover:text-white transition">UZ</span>
          <span className="cursor-pointer hover:text-white transition">RU</span>
          <span className="cursor-pointer hover:text-white transition">EN</span>
        </div>
      </div>
    </footer>
  );
}
