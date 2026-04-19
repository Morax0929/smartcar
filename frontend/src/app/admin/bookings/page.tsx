"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, ChevronRight, CheckCircle2, XCircle, Clock, MoreVertical, RefreshCcw } from "lucide-react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api";

interface Booking {
  id: number;
  user_id: number;
  car_id: number;
  car_name: string;
  car_brand: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  transaction_id: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/bookings/all');
      setBookings(res.data);
    } catch (error) {
      console.error("Buyurtmalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiClient.put(`/bookings/${id}/status?new_status=${status}`);
      setBookings(bookings.map(f => f.id === id ? { ...f, status } : f));
    } catch (error) {
      alert("Statusni o'zgartirishda xatolik");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Buyurtmalar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm">Tizimdagi barcha bronlar va ularning holati</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" /> Yangilash
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Mashina nomi yoki tranzaksiya ID si bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyurtma</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foydalanuvchi</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sana</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Summa</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">Yuklanmoqda...</td></tr>
              ) : filteredBookings.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">Buyurtmalar topilmadi</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{b.car_brand} {b.car_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.transaction_id || `#${b.id}`}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          U{b.user_id}
                        </div>
                        <span className="text-sm font-medium text-slate-600">ID: {b.user_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                         <Calendar className="w-3.5 h-3.5 text-slate-400" />
                         <span className="text-xs font-medium">
                           {new Date(b.start_date).toLocaleDateString()}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{b.total_price.toLocaleString()} UZS</p>
                      <p className={`text-[10px] font-black uppercase mt-0.5 ${b.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                        {b.payment_status === 'paid' ? 'To\'langan' : 'Kutilmoqda'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                         b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                         b.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                         b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {b.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : 
                          b.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                          b.status === 'cancelled' ? <XCircle className="w-3 h-3" /> :
                          <Clock className="w-3 h-3" />}
                         {b.status === 'confirmed' ? 'Tasdiqlangan' : 
                          b.status === 'completed' ? 'Yakunlangan' :
                          b.status === 'cancelled' ? 'Bekor qilingan' :
                          'Kutilmoqda'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         {b.status === 'pending' && (
                           <button 
                             onClick={() => updateStatus(b.id, 'confirmed')}
                             className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                             title="Tasdiqlash"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                         )}
                         {b.status === 'confirmed' && (
                           <button 
                             onClick={() => updateStatus(b.id, 'completed')}
                             className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                             title="Yakunlash"
                           >
                             <RefreshCcw className="w-4 h-4" />
                           </button>
                         )}
                         {(b.status === 'pending' || b.status === 'confirmed') && (
                            <button 
                              onClick={() => updateStatus(b.id, 'cancelled')}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="Bekor qilish"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                         )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
