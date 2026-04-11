"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ChevronLeft, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";

interface Booking {
  id: number;
  car_id: number;
  user_id: number;
  car_name: string;
  car_brand: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
}

export default function RentalAgreement() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) { router.push("/login"); return; }

    // Get user name from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.sub.split('@')[0].toUpperCase());
    } catch {}

    fetch(`http://localhost:8000/api/bookings/my`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const found = data.find((b: any) => b.id === Number(id));
      if (found) setBooking(found);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-20 text-center">Yuklanmoqda...</div>;
  if (!booking) return <div className="p-20 text-center text-red-500">Shartnoma topilmadi</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 flex flex-col items-center">
      {/* Action Bars (Hidden on print) */}
      <div className="max-w-4xl w-full mb-6 flex justify-between items-center print:hidden">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ChevronLeft className="w-5 h-5" /> Orqaga
         </button>
         <button onClick={handlePrint} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <Printer className="w-4 h-4" /> Chop etish / PDF saqlash
         </button>
      </div>

      {/* The Agreement Document */}
      <div className="max-w-4xl w-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-slate-200 p-12 md:p-20 rounded-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
           <div>
              <div className="flex items-center gap-2 text-slate-900 mb-2">
                 <ShieldCheck className="w-8 h-8 text-amber-500" />
                 <span className="font-black text-2xl tracking-tighter">SmartCar AI</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Sifatli avtomobil ijarasi xizmati</p>
           </div>
           <div className="text-right">
              <h1 className="text-2xl font-black text-slate-900 uppercase mb-1">Ijara Shartnomasi</h1>
              <p className="text-sm font-bold text-slate-500">N: {String(booking.id).padStart(6, '0')}</p>
              <p className="text-xs text-slate-400 mt-1">Sana: {new Date().toLocaleDateString()}</p>
           </div>
        </div>

        {/* content */}
        <div className="space-y-8 text-slate-800 leading-relaxed font-serif">
           <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-l-4 border-amber-500 pl-3">1. Tomonlar</h2>
              <p className="text-sm">
                 Ushbu shartnoma bir tomondan <strong>"SmartCar AI" MCHJ</strong> (bundan buyon matnda "Ijaraga beruvchi") va ikkinchi tomondan 
                 <strong> Foydalanuvchi: {userName}</strong> (bundan buyon matnda "Ijaraga oluvchi") o'rtasida quyidagilar haqida tuzildi:
              </p>
           </section>

           <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-l-4 border-amber-500 pl-3">2. Shartnoma Predmeti</h2>
              <p className="text-sm mb-4">
                 Ijaraga beruvchi tomonidan Ijaraga oluvchiga quyidagi ko'rsatilgan avtomobil vaqtinchalik foydalanish uchun topshiriladi:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 grid grid-cols-2 gap-y-4">
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Marka va Model</p>
                    <p className="text-sm font-black text-slate-900">{booking.car_brand} {booking.car_name}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Ijara muddati</p>
                    <p className="text-sm font-black text-slate-900">{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Jami summa</p>
                    <p className="text-sm font-black text-amber-600">{booking.total_price.toLocaleString()} UZS</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">To'lov holati</p>
                    <p className="text-sm font-black text-green-600 uppercase flex items-center gap-1">
                       <CheckCircle2 className="w-3.5 h-3.5" /> To'langan
                    </p>
                 </div>
              </div>
           </section>

           <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-l-4 border-amber-500 pl-3">3. Majburiyatlar</h2>
              <ul className="text-[13px] list-disc pl-5 space-y-2 text-slate-600">
                 <li>Ijaraga oluvchi avtomobilni belgilangan muddatda va tozza holda qaytarishi shart.</li>
                 <li>Avtomobildan foydalanishda yo'l harakati qoidalariga (YHQ) qat'iy amal qilishi shart.</li>
                 <li>Avtomobilga yetkazilgan har qanday zarar Ijaraga oluvchi tomonidan qoplanadi (KASKO sug'urtasi bo'lmagan holda).</li>
                 <li>Avtomobilni uchinchi shaxslarga boshqaruvga berish qat'iyan man etiladi.</li>
              </ul>
           </section>

           <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-l-4 border-amber-500 pl-3">4. Yakuniy qoidalar</h2>
              <p className="text-[13px] text-slate-600">
                 Ushbu shartnoma elektron ko'rinishda tasdiqlangan va qonuniy kuchga ega. Tomonlar o'rtasida kelib chiqadigan nizolar O'zbekiston Respublikasi qonunlariga muvofiq hal qilinadi.
              </p>
           </section>
        </div>

        {/* Signature Area */}
        <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 gap-20">
           <div className="space-y-6">
              <p className="text-xs font-bold text-slate-400 uppercase">Ijaraga beruvchi:</p>
              <div className="h-16 flex items-end">
                 <div className="w-full border-b border-slate-900 relative">
                    <span className="absolute bottom-1 right-0 text-[10px] font-bold text-slate-300">SmartCar AI Signature</span>
                    <div className="absolute -top-10 left-5">
                       {/* Mock Stamp */}
                       <div className="w-20 h-20 rounded-full border-4 border-amber-500/30 flex items-center justify-center -rotate-12">
                          <span className="text-amber-600/30 font-black text-[10px] text-center px-1">SMARTCAR AI SEAL</span>
                       </div>
                    </div>
                 </div>
              </div>
              <p className="text-xs font-black text-slate-900 tracking-wider">ADMINISTRATOR</p>
           </div>
           <div className="space-y-6 text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Ijaraga oluvchi:</p>
              <div className="h-16 flex items-end">
                 <div className="w-full border-b border-slate-900 relative">
                    <span className="absolute bottom-1 left-0 text-[10px] font-bold text-slate-300">Digital Signature Code: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                 </div>
              </div>
              <p className="text-xs font-black text-slate-900 tracking-wider">{userName}</p>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">Hujjat elektron tizim orqali yaratilgan • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
