"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, Users, Fuel, Settings2, SlidersHorizontal, Sparkles, X, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

interface Car {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  image_url: string;
  description: string;
  is_available: boolean;
  year: number;
}



export default function UserCarsCatalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    apiClient.get('/cars/')
      .then(res => { setCars(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Kategoriyalarni API dan dinamik olish
  const categories = Array.from(new Set(cars.map(c => c.category)));

  const filtered = cars.filter(car => {
    if (search && !car.name.toLowerCase().includes(search.toLowerCase()) && !car.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (car.price_per_day > maxPrice) return false;
    if (selectedCategory && car.category !== selectedCategory) return false;
    if (onlyAvailable && !car.is_available) return false;
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-24 min-h-full relative">

      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold shadow-lg fixed bottom-6 right-6 z-40 transition-transform active:scale-95"
      >
        <SlidersHorizontal className="w-5 h-5 text-amber-500" />
        Filtrlar
      </button>

      {/* === FILTER PANEL OVERLAY (Mobile) === */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* === LEFT FILTER PANEL === */}
      <aside className={`
        fixed inset-y-0 right-0 z-[60] w-72 bg-white p-6 shadow-2xl transition-transform duration-300 transform
        ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none lg:z-0
      `}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6 lg:sticky lg:top-6 h-full lg:h-auto overflow-y-auto">

          <div className="flex items-center justify-between lg:justify-start gap-2 font-bold text-slate-900 border-b lg:border-none pb-4 lg:pb-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filtrlar
            </div>
            <button onClick={() => setIsFilterOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Qidiruv */}
          <div className="pt-2 lg:pt-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qidiruv</p>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 transition-colors">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Brend yoki model"
                className="bg-transparent outline-none text-sm w-full text-slate-700"
              />
            </div>
          </div>

          {/* Narx */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Kunlik Narx (Maks)</p>
            <input
              type="range" min={100000} max={5000000} step={100000}
              value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-amber-500 font-extrabold text-sm mt-2">{maxPrice.toLocaleString()} UZS</div>
          </div>

          {/* Toifa — API dan dinamik */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Toifa</p>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setSelectedCategory("")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === "" ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                <span>Barchasi</span>
                {selectedCategory === "" && <ChevronRight className="w-4 h-4" />}
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <span className="truncate">{cat}</span>
                  {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mavjudlar toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-700 font-bold leading-tight">Faqat mavjudlari</span>
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-2 ${onlyAvailable ? 'bg-amber-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${onlyAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Clear Filters (Mobile only) */}
          <button 
            onClick={() => { setSearch(""); setMaxPrice(5000000); setSelectedCategory(""); setOnlyAvailable(false); setIsFilterOpen(false); }}
            className="lg:hidden w-full py-3 text-slate-400 font-bold text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Filtrlarni tozalash
          </button>
        </div>
      </aside>

      {/* === RIGHT CARS GRID === */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Avtomobillar</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Siz izlagan barcha turdagi mashinalar</p>
          </div>
          <span className="text-sm text-slate-900 font-bold bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
            {filtered.length} ta natija
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Search className="w-12 h-12 opacity-30" />
            </div>
            <p className="font-extrabold text-xl text-slate-900">Hech narsa topilmadi</p>
            <p className="text-sm mt-2 max-w-xs">Afsuski, qidiruvingiz bo'yicha hech qanday natija topilmadi. Filtrlarni tozalab ko'ring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((car, idx) => (
              <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group flex flex-col h-full">
                {/* Rasm */}
                <div className="relative h-48 sm:h-52 bg-slate-50 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> AI Narx
                  </div>
                  <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    {car.brand.toUpperCase()}
                  </div>
                  {!car.is_available && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="bg-red-500 text-white font-extrabold px-5 py-2 rounded-xl text-sm shadow-xl">Band etilgan</span>
                    </div>
                  )}
                  <img
                    src={getImageUrl(car.image_url)}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Karta tanasi */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                      {car.brand} • {car.category}
                    </p>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors uppercase italic">{car.name}</h3>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700">{(4.2 + (idx * 0.15) % 0.8).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-400">{car.year}-yil modeli</p>
                  </div>

                  {/* Xususiyatlar */}
                  <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold border-y border-slate-50 py-4 my-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>5 o'rin</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg">
                      <Fuel className="w-4 h-4 text-slate-400" />
                      <span>Benzin</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      <span>{idx % 2 === 0 ? 'Avto' : 'Mexanik'}</span>
                    </div>
                  </div>

                  {/* Narx va Tugma */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        {car.price_per_day.toLocaleString()} <span className="text-xs font-medium text-slate-400 italic">UZS</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">kunlik ijara</div>
                    </div>
                    <Link
                      href={`/user/cars/${car.id}`}
                      className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all duration-300 shadow-sm ${
                        car.is_available
                          ? 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 hover:shadow-amber-500/30'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      Bron
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
