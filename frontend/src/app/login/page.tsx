"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { apiClient } from '@/lib/api';
import Cookies from 'js-cookie';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Har safar sahifa ochilganda maydonlarni tozalash
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login uchun maxsus so'rov (FastAPI xavfsizlik standarti)
      const response = await apiClient.post('/auth/login', {
         email: email,
         password: password
      });
      
      const data = response.data;
      
      // Tokenni brouzer xotirasiga (Cookies) 7 kunga saqlash
      Cookies.set('access_token', data.access_token, { expires: 7 });
      Cookies.set('user_role', data.role, { expires: 7 });
      
      // Admin yoki User ekanligini ajratib ochamiz
      if (data.role === 'admin') {
         router.push('/admin');
      } else {
         router.push('/user');
      }

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
         setError(err.response.data.detail);
      } else {
         setError("Tizimga ulanishda xatolik yuz berdi. Server aloqasi yo'q bo'lishi mumkin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-shadow">
        <div className="flex justify-center items-center mb-8">
          <ShieldAlert className="h-8 w-8 text-amber-500 mr-2" />
          <span className="font-bold text-2xl text-slate-900">SmartCar AI</span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Xush kelibsiz!</h2>
        <p className="text-slate-500 text-sm text-center mb-8">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>

        {error && (
           <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100">
              {error}
           </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email manzil</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" placeholder="Tizimdagi email orqali kiring" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-slate-700">Parol</label>
               <span className="text-xs text-amber-600 hover:text-amber-700 font-medium cursor-pointer">Parolni unutdingizmi?</span>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" />
          </div>
          <button type="submit" disabled={loading} className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? 'Tekshirilmoqda...' : 'Tizimga kirish'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Akkauntingiz yo'qmi?{' '}
          <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </div>
  );
}
