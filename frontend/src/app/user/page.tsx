"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Sparkles, TrendingUp, CarFront, Users, DollarSign } from "lucide-react";

interface Car {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  image_url: string;
  description: string;
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  car_id: number;
}

export default function UserDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/cars/available`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/cars/1/reviews`),
        ]);
        const carsData = await carsRes.json();
        const reviewsData = await reviewsRes.json();
        setCars(carsData);
        setReviews(reviewsData);
      } catch (e) {
        console.error("API ulanish xatosi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const aiRecommended = cars.slice(0, 3);

  return (
    <div className="space-y-8 pb-20">

      {/* Statistika kartalar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Mening ijaralarim", value: "0 ta", icon: CarFront, color: "blue" },
          { label: "Bonus ballar", value: "2 500", icon: TrendingUp, color: "amber" },
          { label: "Keyingi daraja", value: "Silver", icon: Star, color: "purple" },
          { label: "Faollik", value: "Yangi", icon: Users, color: "green" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-amber-200 transition-colors">
            <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 mb-2 group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* AI Tavsiyalari */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" /> AI Sizga Tavsiya Qiladi
          </h2>
          <Link href="/user/cars" className="text-sm text-amber-600 font-bold hover:underline">Barchasi →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiRecommended.map((car, idx) => (
              <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                    ⚡ AI #{(idx % 3) + 1} Tavsiya
                  </div>
                  <img 
                    src={car.image_url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop"} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">{car.brand} • {car.category}</p>
                  <h3 className="font-extrabold text-slate-900 text-lg">{car.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm font-extrabold text-slate-900">
                      {car.price_per_day.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal uppercase">UZS/kun</span>
                    </div>
                    <Link href={`/user/cars`} className="bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 text-xs px-4 py-2.5 rounded-xl transition-all font-bold">
                      Band qilish
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mijozlar Sharhlari */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" /> Boshqa Mijozlar Fikri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-sm">
                    {review.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{review.user_name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{new Date(review.created_at).toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-100'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">"{review.comment}"</p>
            </div>
          )) : (
            <div className="col-span-2 py-10 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              Hozircha sharhlar mavjud emas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

