"use client";

import { useEffect, useState } from "react";
import { Wrench, ShieldAlert, CheckCircle2, AlertTriangle, Gauge, ArrowRight } from "lucide-react";

interface Car {
  id: number;
  name: string;
  brand: string;
  mileage: number;
  last_service_mileage: number;
}

export default function AdminMaintenance() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/cars")
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // AI Maintenance Recommendation Engine
  const getStabilityStatus = (car: Car) => {
    const mileage = car.mileage || 0;
    const lastServiceMileage = car.last_service_mileage || 0;
    const drivenSinceLastService = mileage - lastServiceMileage;
    const threshold = 7000; // 7,000 km oil change interval
    
    if (drivenSinceLastService > threshold) {
      return {
        label: "Xizmat vaqti o'tib ketgan",
        color: "text-red-600 bg-red-50",
        icon: < ShieldAlert className="w-4 h-4" />,
        priority: "High",
        action: "Darhol texnik ko'rikdan o'tkazing (Yog' almashtirish)"
      };
    } else if (drivenSinceLastService > threshold * 0.8) {
      return {
        label: "Yaqinda xizmat ko'rsatish kerak",
        color: "text-amber-600 bg-amber-50",
        icon: < AlertTriangle className="w-4 h-4" />,
        priority: "Medium",
        action: `Taxminan ${threshold - drivenSinceLastService} km dan so'ng servisga olib boring`
      };
    } else {
      return {
        label: "Holati juda yaxshi",
        color: "text-green-600 bg-green-50",
        icon: < CheckCircle2 className="w-4 h-4" />,
        priority: "Low",
        action: "Hech qanday amal talab etilmaydi"
      };
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">AI tahlil qilinmoqda...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
               <Wrench className="w-8 h-8 text-amber-500" /> AI Predictive Maintenance
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
               Mashina probeqi va oxirgi servis ma'lumotlari asosida sun'iy intellekt har bir avtomobilning texnik holatini muntazam nazorat qilib boradi.
            </p>
         </div>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Kritik Holat</p>
               <h3 className="text-2xl font-black text-slate-900">{cars.filter(c => ((c.mileage || 0) - (c.last_service_mileage || 0)) > 7000).length} ta</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Yaqin Qolgan</p>
               <h3 className="text-2xl font-black text-slate-900">{cars.filter(c => {
                  const d = (c.mileage || 0) - (c.last_service_mileage || 0);
                  return d > 7000 * 0.8 && d <= 7000;
               }).length} ta</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Ideal Holatda</p>
               <h3 className="text-2xl font-black text-slate-900">{cars.filter(c => ((c.mileage || 0) - (c.last_service_mileage || 0)) <= 7000 * 0.8).length} ta</h3>
            </div>
         </div>
      </div>

      {/* Maintenance List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Avtomobil</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Probeq (Mileage)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">AI Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tavsiya (Next Step)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {cars.map((car) => {
                  const status = getStabilityStatus(car);
                  return (
                    <tr key={car.id} className="group hover:bg-slate-50/30 transition-colors">
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">
                                {car.name[0]}
                             </div>
                             <div>
                                <span className="font-bold text-slate-900 block">{car.brand} {car.name}</span>
                                <span className="text-[10px] text-slate-500">ID: #{car.id}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col items-center">
                             <div className="flex items-center gap-1.5 text-sm font-black text-slate-700">
                                <Gauge className="w-4 h-4 text-slate-300" /> {(car.mileage || 0).toLocaleString()} km
                             </div>
                             <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500" 
                                  style={{ width: `${Math.min(((car.mileage || 0) % 7000) / 7000 * 100, 100)}%` }}
                                ></div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${status.color}`}>
                             {status.icon} {status.label}
                          </span>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-semibold text-slate-600 max-w-[180px]">{status.action}</span>
                             <button className="bg-white border border-slate-200 text-slate-900 p-2 rounded-xl hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100">
                                <ArrowRight className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
    </div>
  );
}
