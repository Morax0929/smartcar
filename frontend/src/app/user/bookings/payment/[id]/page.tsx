"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Loader2, Banknote, CalendarDays, KeyRound } from "lucide-react";
import Cookies from "js-cookie";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [method, setMethod] = useState("card"); // card, payme, click
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Bronni yuklash (FAQAT total price va mashina nomini ko'rsatish uchun)
    const fetchBooking = async () => {
      const token = Cookies.get("access_token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const currentBooking = data.find((b: any) => b.id === Number(id));
        setBooking(currentBooking);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const token = Cookies.get("access_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/bookings/${id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          method,
          card_number: method === "card" ? cardNumber : "8600000000000000" // Simulated for other methods
        })
      });

      if (!res.ok) throw new Error("Karta raqami noto'g'ri");

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/user/bookings");
      }, 2500);

    } catch (error: any) {
      alert("To'lov xatosi: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Karta raqamini formatlash (0000 0000 0000 0000)
  const formatCardNumber = (val: string) => {
    return val.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">To'lov Tasdiqlandi!</h2>
        <p className="text-slate-500 max-w-md">Sizning to'lovingiz muvaffaqiyatli qabul qilindi. Sizni Buyurtmalar sahifasiga qaytarmoqdamiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Banknote className="w-8 h-8 text-amber-500" /> To'lov Qilish
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Xavfsiz va tezkor to'lov tizimi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* To'lov usullari va Karta Formasi */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex gap-3 mb-8">
            <button 
              onClick={() => setMethod('card')} 
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-colors ${method === 'card' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              <CreditCard className="w-5 h-5" /> Karta
            </button>
            <button 
              onClick={() => setMethod('payme')} 
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-colors ${method === 'payme' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              Payme
            </button>
            <button 
              onClick={() => setMethod('click')} 
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-colors ${method === 'click' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              Click
            </button>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            {method === 'card' ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Karta raqami</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      maxLength={19} 
                      required 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono" 
                      placeholder="8600 0000 0000 0000" 
                    />
                    <CreditCard className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amal qilish muddati</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={5} 
                        required 
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 3) {
                            val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          }
                          setExpiry(val);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono" 
                        placeholder="MM/YY" 
                      />
                      <CalendarDays className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">CVV (ixtiyoriy)</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        maxLength={3} 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono" 
                        placeholder="***" 
                      />
                      <KeyRound className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center font-black text-2xl rotate-3 shadow-xl ${method === 'payme' ? 'bg-teal-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {method === 'payme' ? 'P' : 'C'}
                </div>
                <p className="text-slate-500">Tizim orqali bir marta bosishda to'lovingizni tasdiqlang.</p>
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isProcessing || (method === 'card' && cardNumber.length !== 19)}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:shadow-none"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Ishlanmoqda...</>
                ) : (
                  `To'lash - ${booking ? booking.total_price.toLocaleString() : "..."} UZS`
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Informatsion Qism */}
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 text-slate-300">Buyurtma tafsilotlari</h3>
            
            {booking ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Avtomobil</p>
                  <p className="text-lg font-bold text-amber-500">{booking.car_brand} • {booking.car_name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Boshlanish</p>
                    <p className="font-medium">{new Date(booking.start_date).toLocaleDateString('uz-UZ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tugash</p>
                    <p className="font-medium">{new Date(booking.end_date).toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-6 mt-8 relative z-10 flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">Jami To'lov Qo'summasi</p>
              <p className="text-3xl font-black">
                {booking ? booking.total_price.toLocaleString() : "0"} <span className="text-sm text-amber-500">UZS</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
