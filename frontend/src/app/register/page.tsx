"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, TerminalSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    admin_secret_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Har safar sahifa ochilganda maydonlarni tozalash
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      password: '',
      admin_secret_code: ''
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataPayload: any = { ...formData };
      if (!dataPayload.admin_secret_code) {
        delete dataPayload.admin_secret_code; // Bo'sh bo'lsa JSON ga kiritmaymiz
      }

      await apiClient.post('/auth/register', dataPayload);
      
      // 2-Qadam: Muaffaqiyatli saqlangach loginga o'tkazish
      router.push('/login?registered=true');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
         setError(err.response.data.detail);
      } else {
         setError("Tizimda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-shadow">
        <div className="flex justify-center items-center mb-6">
          <span className="font-bold text-2xl text-slate-900">SmartCar AI</span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Ro'yxatdan O'tish</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Ijara xizmatidan foydalanish uchun hisob yarating</p>

        {error && (
           <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100">
              {error}
           </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ism va Familiya</label>
            <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} autoComplete="off" placeholder="Ali Valiyev" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon raqam</label>
            <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} autoComplete="off" placeholder="+998 90 123 45 67" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email manzil</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} autoComplete="off" placeholder="misol@gmail.com" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} autoComplete="new-password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <div className="pt-2 border-t border-slate-100">
             <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">
                 <TerminalSquare className="w-3 h-3 mr-1 text-slate-400" /> Admin Kod (Ixtiyoriy)
             </label>
             <input type="text" value={formData.admin_secret_code} onChange={e => setFormData({...formData, admin_secret_code: e.target.value})} autoComplete="off" placeholder="Agar mavjud bo'lsa yozing" className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-500 transition-colors font-mono" />
          </div>
          <button type="submit" disabled={loading} className={`w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
             {loading ? 'Yuklanmoqda...' : 'Hisob yaratish'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Akkauntingiz bormi?{' '}
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-bold">
            Tizimga kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
