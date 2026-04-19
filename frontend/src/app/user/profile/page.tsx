"use client";

import { useEffect, useState } from "react";
import { User, ShieldCheck, Mail, Phone, Fingerprint } from "lucide-react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api";

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit forms state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        const data = res.data;
        setUser(data);
        setEditName(data.full_name || "");
        setEditPhone(data.phone || "");
      } catch (error) {
        console.error("Profilni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const res = await apiClient.put('/auth/me', {
        full_name: editName,
        phone: editPhone
      });
      
      setUser(res.data);
      setIsEditing(false);
      setMsg({ text: "Profil muvaffaqiyatli yangilandi!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMsg({ text: "Xatolik yuz berdi.", type: "error" });
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || password !== confirmPassword) {
      setMsg({ text: "Parollar mos kelmadi yoki bo'sh!", type: "error" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
      return;
    }

    try {
      await apiClient.put('/auth/me', { password });
      
      setPassword("");
      setConfirmPassword("");
      setMsg({ text: "Parol muvaffaqiyatli o'zgartirildi!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMsg({ text: "Xatolik yuz berdi.", type: "error" });
    }
  };

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="max-w-3xl space-y-6">
       
       {msg.text && (
         <div className={`p-4 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
           {msg.text}
         </div>
       )}

       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         
         <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3">
               <User className="w-5 h-5 text-amber-600" />
            </div>
            Shaxsiy Ma'lumotlar
         </h2>

         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> To'liq ism</label>
                 {isEditing ? (
                   <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-amber-500 outline-none text-sm font-bold text-slate-900" />
                 ) : (
                   <div className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900">
                      {user?.full_name || "Noma'lum"}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Phone className="w-3 h-3" /> Telefon raqam</label>
                 {isEditing ? (
                   <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-amber-500 outline-none text-sm font-bold text-slate-900" />
                 ) : (
                   <div className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900">
                      {user?.phone || "Noma'lum"}
                   </div>
                 )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email manzili</label>
                 <div className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 opacity-60">
                    {user?.email || "Noma'lum"}
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Foydalanuvchi roli</label>
                 <div className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-black uppercase text-slate-500">
                    {user?.role === 'admin' ? '🔥 Administrator' : '👤 Oddiy foydalanuvchi'}
                 </div>
               </div>
            </div>
            
            <div className="pt-4 flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleUpdateProfile} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                     Saqlash
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-white border border-slate-200 text-slate-500 font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                     Bekor qilish
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                   Taxrirlash
                </button>
              )}
            </div>
         </div>
       </div>

       <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center">
             <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
             </div>
             Xavfsizlik va Parol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Yangi parol</label>
               <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-amber-500 text-sm font-medium transition-all" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Parolni tasdiqlash</label>
               <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-amber-500 text-sm font-medium transition-all" />
             </div>
          </div>
          <button onClick={handleUpdatePassword} className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-md active:scale-95 text-[10px] uppercase tracking-widest">
            Parolni yangilash
         </button>
       </div>
    </div>
  );
}

