"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, Navigation } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Server tomonida prerender qilmasligi uchun "ssr: false"
const LiveMap = dynamic(() => import("@/components/dashboard/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold">Xarita yuklanmoqda...</p>
    </div>
  )
});

export default function AdminMapPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 h-[85vh] flex flex-col">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-500" /> Jonli GPS Kuzatuv
            </h2>
            <p className="text-xs text-slate-500 font-medium">Faol ijaradagi avtomobillarning shahar bo'ylab joylashuvi (Live Tracking)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white p-2 rounded-3xl shadow-sm border border-slate-100 h-full relative">
         <LiveMap />
      </div>
    </div>
  );
}
