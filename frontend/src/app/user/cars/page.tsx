"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, Users, Fuel, Settings2, SlidersHorizontal, Sparkles } from "lucide-react";

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

const FUEL_TYPES = ["Benzin", "Dizel", "Elektr", "Gibrid"];

export default function UserCarsCatalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/cars/")
      .then(res => res.json())
      .then(data => { setCars(data); setLoading(false); })
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
    <div className="flex gap-6 pb-24 min-h-full">

      {/* === LEFT FILTER PANEL === */}
      <aside className="w-56 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6 sticky top-0">

          <div className="flex items-center gap-2 font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            Filtrlar
          </div>

          {/* Qidiruv */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qidiruv</p>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-amber-500 transition-colors">
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kunlik Narx (Maks)</p>
            <input
              type="range" min={100000} max={5000000} step={100000}
              value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="text-amber-500 font-bold text-sm mt-1">{maxPrice.toLocaleString()} UZS</div>
          </div>

          {/* Toifa — API dan dinamik */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Toifa</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === ""} onChange={() => setSelectedCategory("")} className="accent-amber-500" />
                <span className="text-sm text-slate-700">Barchasi</span>
              </label>
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="accent-amber-500" />
                  <span className="text-sm text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Yoqilg'i turi */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Yoqilg'i Turi</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="fuel" checked={selectedFuel === ""} onChange={() => setSelectedFuel("")} className="accent-amber-500" />
                <span className="text-sm text-slate-700">Barchasi</span>
              </label>
              {FUEL_TYPES.map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fuel" checked={selectedFuel === f} onChange={() => setSelectedFuel(f)} className="accent-amber-500" />
                  <span className="text-sm text-slate-700">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mavjudlar toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-700 font-medium leading-tight">Faqat mavjudlarini ko'rsatish</span>
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-2 ${onlyAvailable ? 'bg-amber-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${onlyAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* === RIGHT CARS GRID === */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900">Avtomobil Katalogi</h2>
          <span className="text-sm text-slate-500 font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            {filtered.length} ta topildi
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-semibold text-lg">Hech qanday mashina topilmadi</p>
            <p className="text-sm mt-1">Filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((car, idx) => (
              <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                {/* Rasm */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" /> AI Narx
                  </div>
                  <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {car.brand.toUpperCase()}
                  </div>
                  {!car.is_available && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-20">
                      <span className="bg-red-500 text-white font-bold px-4 py-1.5 rounded-full text-sm">Band</span>
                    </div>
                  )}
                  <img
                    src={car.image_url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop"}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Karta tanasi */}
                <div className="p-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">
                    {car.brand} • {car.category} · {car.year}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-extrabold text-slate-900">{car.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700">{(4.2 + (idx * 0.15) % 0.8).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Xususiyatlar */}
                  <div className="flex items-center justify-around text-slate-400 text-xs border-y border-slate-100 py-3 mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>5 o'rin</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      <span>Benzin</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Settings2 className="w-4 h-4" />
                      <span>{idx % 2 === 0 ? 'Avto' : 'Mexanik'}</span>
                    </div>
                  </div>

                  {/* Narx va Tugma */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {car.price_per_day.toLocaleString()} UZS
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">kuniga</div>
                    </div>
                    <Link
                      href={`/user/cars/${car.id}`}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all inline-block ${
                        car.is_available
                          ? 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 hover:shadow-lg hover:shadow-amber-500/20'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      Batafsil
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
