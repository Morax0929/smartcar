"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Star, Users, Fuel, Settings2, ShieldCheck, 
  CreditCard, Calendar, CheckCircle2, Sparkles, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

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

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/cars/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Server xatoligi");
        return res.json();
      })
      .then(data => {
        setCar(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setCar(null);
      });
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalPrice(diffDays * car.price_per_day);
    }
  }, [startDate, endDate, car]);

  const handleBooking = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          car_id: Number(id),
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          total_price: totalPrice
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setBookingId(data.id);
        setShowPayment(true);
      } else {
        alert(data.detail || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server bilan aloqa uzildi");
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    const token = Cookies.get("access_token");
    
    // Simulate processing
    setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/bookings/${bookingId}/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            method: paymentMethod,
            card_number: cardNumber,
            expiry,
            cvv
          })
        });
        
        if (res.ok) {
          setPaymentSuccess(true);
          setTimeout(() => {
            router.push("/user/bookings");
          }, 2000);
        } else {
          const data = await res.json();
          alert(data.detail || "To'lovda xatolik");
        }
      } catch (err) {
        alert("To'lov serveri bilan aloqa yo'q");
      } finally {
        setIsPaying(false);
      }
    }, 1500);
  };

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;
  if (!car) return <div className="p-10 text-center">Avtomobil topilmadi</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Image and Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="relative h-[400px]">
               <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
               <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-bold">
                 {car.year} yilda ishlab chiqarilgan
               </div>
            </div>
            <div className="p-8">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-1">{car.brand} • {car.category}</p>
                    <h1 className="text-4xl font-black text-slate-900">{car.name}</h1>
                 </div>
                 <div className="bg-amber-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="text-lg font-bold text-slate-900">4.9</span>
                    <span className="text-slate-400 text-sm">(12 ta sharh)</span>
                 </div>
               </div>
               
               <p className="text-slate-600 leading-relaxed text-lg mb-8">
                 {car.description || "Ushbu avtomobil haqida batafsil ma'lumot tez orada qo'shiladi. SmartCar AI tizimi orqali eng yaxshi narxlarda ijaraga oling."}
               </p>

               <div className="grid grid-cols-3 gap-4">
                 {[
                   { icon: Users, label: "Sig'im", value: "5 o'rindiq" },
                   { icon: Fuel, label: "Yoqilg'i", value: "Benzin / Gibrid" },
                   { icon: Settings2, label: "Transmissiya", value: "Avtomat" }
                 ].map((spec, i) => (
                   <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <spec.icon className="w-5 h-5 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-400 font-bold uppercase">{spec.label}</p>
                      <p className="text-slate-900 font-bold">{spec.value}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
             <div className="bg-amber-500 p-3 rounded-2xl">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Sug'urta va Xavfsizlik</h3>
               <p className="text-sm text-slate-600">Ushbu avtomobil to'liq KASKO sug'urtasidan o'tgan. Safaringiz xavfsizligi biz uchun ustuvor.</p>
             </div>
          </div>
        </div>

        {/* RIGHT: Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-6">
             <div className="mb-6 pb-6 border-b border-slate-100 flex justify-between items-end">
               <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Kunlik Ijara</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black text-slate-900">{car?.price_per_day?.toLocaleString()}</span>
                    <span className="text-slate-400 font-bold mb-1">UZS</span>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Price
                  </span>
                  <p className="text-[9px] text-green-600 font-bold uppercase">Optimal</p>
               </div>
             </div>

             <div className="space-y-4 mb-8">
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Boshlanish sanasi</label>
                 <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:border-amber-500 focus:outline-none transition-all" 
                    />
                 </div>
               </div>
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tugash sanasi</label>
                 <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:border-amber-500 focus:outline-none transition-all" 
                    />
                 </div>
               </div>
             </div>

             {totalPrice > 0 && (
               <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-slate-500">Jami kunlar:</span>
                   <span className="font-bold text-slate-900">{totalPrice / car.price_per_day} ta</span>
                 </div>
                 <div className="flex justify-between text-lg">
                   <span className="font-bold text-slate-900">Umumiy narx:</span>
                   <span className="font-black text-amber-600">{totalPrice?.toLocaleString()} UZS</span>
                 </div>
               </div>
             )}

             <button
               onClick={handleBooking}
               disabled={!startDate || !endDate}
               className="w-full bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
             >
               Hozirroq Bron Qiling
             </button>
             
             <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">To'lov keyingi bosqichda</p>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            {paymentSuccess ? (
              <div className="p-12 text-center animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Muvaffaqiyatli!</h2>
                <p className="text-slate-500 font-medium">To'lov qabul qilindi. Sizni bosh sahifaga yo'naltirmoqdamiz...</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900">To'lov</h2>
                  <button onClick={() => setShowPayment(false)} className="text-slate-400 hover:text-slate-900">
                    <AlertCircle className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                {/* Amount Display */}
                <div className="bg-slate-50 p-5 rounded-3xl mb-8 flex justify-between items-center border border-slate-100">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">To'lov summasi</p>
                     <p className="text-2xl font-black text-slate-900">{totalPrice.toLocaleString()} UZS</p>
                   </div>
                   <div className="bg-amber-500/10 p-3 rounded-2xl">
                     <Sparkles className="w-6 h-6 text-amber-600" />
                   </div>
                </div>

                {/* Methods */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50' : 'border-slate-100 bg-white'}`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold uppercase ${paymentMethod === 'card' ? 'text-amber-600' : 'text-slate-500'}`}>Plastik Karta</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("payme")}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'payme' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white'}`}
                  >
                    <img src="https://cdn.payme.uz/logo/payme_color.svg" className="h-6" alt="PayMe" />
                    <span className={`text-xs font-bold uppercase ${paymentMethod === 'payme' ? 'text-cyan-600' : 'text-slate-500'}`}>PayMe</span>
                  </button>
                </div>

                {/* Card Fields */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Karta raqami</label>
                    <input 
                      type="text" 
                      placeholder="8600 0000 0000 0000"
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardNumber(val);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-lg font-mono focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-300" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Muddati</label>
                      <input 
                        type="text" placeholder="MM/YY" maxLength={5}
                        value={expiry}
                        onChange={e => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) val = val.substring(0,2) + "/" + val.substring(2);
                          setExpiry(val);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-lg font-mono focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-300" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">CVV</label>
                      <input 
                        type="password" placeholder="***" maxLength={3}
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-lg font-mono focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-300" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isPaying || !cardNumber || !expiry}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-amber-200 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none"
                >
                  {isPaying ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>To'lovni Tasdiqlash <CheckCircle2 className="w-6 h-6" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
