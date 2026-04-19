"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Car as CarIcon, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface Booking {
  id: number;
  car_id: number;
  car_name: string;
  car_brand: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get('/bookings/my');
        setBookings(res.data);
      } catch (err) {
        console.error("Foydalanuvchi ijaralarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <CalendarClock className="w-6 h-6 text-amber-500" /> Mening Ijaralarim
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Sizning barcha faol va o'tgan buyurtmalaringiz</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 py-16 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <CarIcon className="w-10 h-10" />
             </div>
             <div>
               <p className="text-lg font-bold text-slate-900">Hozircha ijaralar mavjud emas</p>
               <p className="text-sm text-slate-400">O'zingizga yoqqan mashinani tanlang va birinchi ijarani amalga oshiring.</p>
             </div>
             <Link href="/user/cars" className="inline-block bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 px-8 py-3 rounded-2xl font-bold transition-all">
               Katalogni ko'rish
             </Link>
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-amber-200 transition-colors">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-50 transition-colors">
                <CarIcon className="w-8 h-8 text-slate-400 group-hover:text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{item.car_brand}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{item.id}</span>
                </div>
                <h3 className="font-black text-slate-900 text-xl">{item.car_name}</h3>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                     <Clock className="w-4 h-4" />
                     {new Date(item.start_date).toLocaleDateString('uz-UZ')} → {new Date(item.end_date).toLocaleDateString('uz-UZ')}
                   </div>
                </div>
              </div>
              <div className="text-left md:text-right space-y-2">
                <p className="font-black text-slate-900 text-xl">{item.total_price.toLocaleString()} UZS</p>
                <div className="flex md:justify-end gap-2">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
                    item.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {item.status === "confirmed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {item.status === "confirmed" ? "Tasdiqlangan" : "Kutilmoqda"}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                    item.payment_status === "paid" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"
                  }`}>
                    {item.payment_status === "paid" ? "To'langan" : "To'lanmagan"}
                  </span>
                </div>
                {item.payment_status !== "paid" && (
                  <div className="flex md:justify-end mt-4">
                    <Link href={`/user/bookings/payment/${item.id}`} className="w-full md:w-auto text-center bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-slate-900/10">
                      Ijarani To'lash
                    </Link>
                  </div>
                )}
                {item.status === "confirmed" && (
                  <div className="flex md:justify-end mt-3">
                    <Link href={`/user/bookings/${item.id}/return`} className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Mashinani qaytarish
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {bookings.length > 0 && (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Yangi sayohatni rejalashtiring!</h3>
            <p className="text-slate-400 text-sm mb-6">Sizning keyingi sarguzashtingiz uchun bizda har qanday avtomobil mavjud.</p>
            <Link href="/user/cars" className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20">
              Katalogni ko'rish
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
