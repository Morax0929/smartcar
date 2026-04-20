"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, TrendingUp, Car, DollarSign, Users, Download, Map } from "lucide-react";
import Link from "next/link";
import { AIPriceChart } from "@/components/dashboard/AIChart";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getImageUrl } from "@/lib/utils";

interface CarItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  image_url: string;
  is_available: boolean;
  year: number;
}

export default function AdminDashboard() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({ totalProfit: 0, activeBookings: 0, totalBookings: 0 });
  const [aiSummary, setAiSummary] = useState<string[]>([
    "Ma'lumotlar tahlil qilinmoqda..."
  ]);
  const [newCar, setNewCar] = useState({
    name: "", brand: "", category: "Comfort",
    price_per_day: 0, image_url: "", year: 2024, description: ""
  });

  const [isUploading, setIsUploading] = useState(false);

  const token = typeof window !== "undefined" ? Cookies.get("access_token") : "";

  const fetchCars = async () => {
    try {
      const res = await apiClient.get('/cars/');
      setCars(res.data);
    } catch (err) {
      console.error("Mashinalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('SmartCar_AI_Hisobot.pdf');
    } catch (error) {
      console.error("PDF yuklashda xatolik", error);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewCar({ ...newCar, image_url: res.data.url });
    } catch (err) {
      alert("Rasm yuklashda xatolik yuz berdi");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const addCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.image_url) {
      alert("Iltimos, avval rasm yuklang");
      return;
    }
    try {
      await apiClient.post('/cars/', newCar);
      setNewCar({
        name: "", brand: "", category: "Comfort",
        price_per_day: 0, image_url: "", year: 2024, description: ""
      });
      setShowForm(false);
      fetchCars();
    } catch (err) {
      alert("Mashina qo'shishda xatolik yuz berdi");
    }
  };

  const deleteCar = async (id: number) => {
    if (!confirm("Bu mashinani o'chirishni tasdiqlaysizmi?")) return;
    try {
      await apiClient.delete(`/cars/${id}`);
      fetchCars();
    } catch (err) {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  const [stats, setStats] = useState([
    { label: "Jami Foyda", value: "0 UZS", icon: DollarSign, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "AI Samaradorligi", value: "+18.2%", icon: TrendingUp, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Aktiv Ijaralar", value: "0 ta", icon: Car, bg: "bg-green-50", color: "text-green-600" },
    { label: "Jami Buyurtmalar", value: "0 ta", icon: Users, bg: "bg-purple-50", color: "text-purple-600" },
  ]);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/bookings/all');
      const bookings = res.data;
      
      
      const totalProfit = bookings.reduce((acc: number, b: any) => acc + (b.payment_status === 'paid' ? b.total_price : 0), 0);
      const activeBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
      
      setBookingData({ totalProfit, activeBookings, totalBookings: bookings.length });
      
      setStats([
        { label: "Jami Foyda", value: `${(totalProfit / 1000000).toFixed(1)}M UZS`, icon: DollarSign, bg: "bg-blue-50", color: "text-blue-600" },
        { label: "AI Samaradorligi", value: "+21.4%", icon: TrendingUp, bg: "bg-amber-50", color: "text-amber-600" },
        { label: "Aktiv Ijaralar", value: `${activeBookings} ta`, icon: Car, bg: "bg-green-50", color: "text-green-600" },
        { label: "Jami Buyurtmalar", value: `${bookings.length} ta`, icon: Users, bg: "bg-purple-50", color: "text-purple-600" },
      ]);
    } catch (error) {
       console.error("Statistikani yuklashda xatolik");
    }
  };

  useEffect(() => { 
    fetchCars(); 
    if (token) fetchStats();
  }, [token]);

  useEffect(() => {
    if (!loading && cars.length >= 0) {
      const summary = [];
      const availableCars = cars.filter(c => c.is_available).length;
      
      summary.push(`AI Tahlili: Hozirda jami ${cars.length} ta mashina. Ulardan ${availableCars} tasi bo'sh holatda.`);
      
      if (bookingData.activeBookings > 0) {
        summary.push(`Platformada talab faol. Tizim ${bookingData.activeBookings} ta oqimdagi ijarani boshqarmoqda.`);
      } else {
        summary.push(`Band qilingan transportlar yo'q. AI mijozlarga moslashtirilgan chegirmalar berishni taklif etadi.`);
      }

      if (bookingData.totalProfit > 0) {
        summary.push(`Muvaffaqiyatli optimizatsiya. Daromad hajmi ${(bookingData.totalProfit / 1000000).toFixed(1)}M UZS.`);
      } else {
        summary.push(`Hali to'lovlar amalga oshirilmagan. Qo'shimcha reklamalarga ko'proq e'tibor qarating.`);
      }

      setAiSummary(summary);
    }
  }, [cars, bookingData, loading]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Boshqaruv Paneli</h2>
          <p className="text-xs text-slate-500 font-medium">Barcha tizim statistikalari va boshqaruv</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Link href="/admin/map" className="flex-1 sm:flex-none justify-center bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Map className="w-4 h-4" /> Jonli Xarita
          </Link>
          <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-amber-500/20 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF Hisobot
          </button>
        </div>
      </div>

      <div id="report-content" className="space-y-6 bg-slate-50/50 p-2 -m-2 rounded-3xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-3 ${s.bg} ${s.color} rounded-xl shrink-0`}><s.icon className="w-5 h-5" /></div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{s.label}</p>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* AI Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Dinamik Narxlash</h3>
              <p className="text-sm text-slate-500">Soatlik talab va narx optimizasiyasi</p>
            </div>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Active AI
            </span>
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <AIPriceChart />
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col justify-between shadow-xl">
          <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">AI Xulosasi</h3>
          <ul className="space-y-4 flex-1">
            {aiSummary.map((msg, i) => (
              <li key={i} className="flex items-start group">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-900 font-black flex items-center justify-center mr-3 shrink-0 text-[10px] mt-0.5 group-hover:scale-110 transition-transform">{i+1}</div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{msg}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/ai-agent" className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-xl transition-all text-center block text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            AI Komandirni boshqarish
          </Link>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Avtomobillar</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Barcha transportlarni boshqarish</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
            <Plus className="w-4 h-4" /> {showForm ? 'Yopish' : 'Yangi Qo\'shish'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={addCar} className="p-5 bg-amber-50/50 border-b border-amber-100 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Brend</label>
                <input required value={newCar.brand} onChange={e => setNewCar({...newCar, brand: e.target.value})} placeholder="Masalan: Chevrolet" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-500 transition-colors bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Model</label>
                <input required value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} placeholder="Masalan: Malibu" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-500 transition-colors bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Toifa</label>
                <select value={newCar.category} onChange={e => setNewCar({...newCar, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white focus:border-amber-500 transition-colors">
                  <option>Comfort</option><option>Premium</option><option>Krossover</option><option>Ekonom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kunlik Narx (UZS)</label>
                <input required type="number" value={newCar.price_per_day} onChange={e => setNewCar({...newCar, price_per_day: +e.target.value})} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-500 transition-colors bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Yil</label>
                <input type="number" value={newCar.year} onChange={e => setNewCar({...newCar, year: +e.target.value})} placeholder="2024" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-500 transition-colors bg-white" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mashina rasmi</label>
                <label className={`flex items-center justify-center border-2 border-dashed rounded-xl p-2 cursor-pointer transition-all ${newCar.image_url ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-amber-400 bg-white'}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  {isUploading ? (
                    <span className="text-xs text-slate-500 animate-pulse font-bold">Yuklanmoqda...</span>
                  ) : newCar.image_url ? (
                    <div className="flex items-center gap-2">
                       <img src={newCar.image_url} alt="Preview" className="w-6 h-6 object-cover rounded shadow-sm" />
                       <span className="text-[10px] text-green-600 font-extrabold uppercase tracking-tighter">Rasm tayyor</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Rasm yuklash</span>
                  )}
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input value={newCar.description} onChange={e => setNewCar({...newCar, description: e.target.value})} placeholder="Qisqacha tavsif..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-white focus:border-amber-500 transition-colors" />
              <button type="submit" disabled={isUploading} className="bg-slate-900 hover:bg-amber-500 disabled:bg-slate-300 text-white hover:text-slate-900 font-black px-10 py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                Qo'shish
              </button>
            </div>
          </form>
        )}


        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Avtomobil</th>
                <th className="px-5 py-3">Turkum</th>
                <th className="px-5 py-3">Narx/Kun</th>
                <th className="px-5 py-3">Holati</th>
                <th className="px-5 py-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? [1,2,3].map(i => <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>)
                : cars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {car.image_url && <img src={getImageUrl(car.image_url)} alt="" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop"; }} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div>{car.name}</div>
                        <div className="text-xs text-slate-400 font-normal">{car.brand} • {car.year}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">{car.category}</span></td>
                    <td className="px-5 py-4 font-bold text-slate-900">{car.price_per_day.toLocaleString()} UZS</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${car.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {car.is_available ? 'Bo\'sh' : 'Ijarada'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => deleteCar(car.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Tahlil va Hisobot oxiri */}
      </div>

    </div>
  );
}
