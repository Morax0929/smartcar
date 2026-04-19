"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, UploadCloud, CheckCircle2, Car as CarIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { apiClient } from "@/lib/api";

interface DamageDetail {
  confidence: number;
  type: string;
  severity: string;
  description: string;
}

interface AnalysisResult {
  status: string;
  message: string;
  damages_detected: number;
  details: DamageDetail[];
}

export default function CarReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    
    setIsAnalyzing(true);
    
    const formData = new FormData();
    formData.append("file", photo);

    try {
      const res = await apiClient.post('/damage/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmReturn = () => {
    // Kelajakda API orqali bron holatini 'completed' ga o'zgartirish
    setIsFinished(true);
    setTimeout(() => {
      router.push("/user/bookings");
    }, 2000);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Muvaffaqiyatli!</h2>
        <p className="text-slate-500 max-w-md">Mashina qaytarildi. AI tizimi ma'lumotlarni admin panelga jo'natdi. Rahmat!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center">
          <CarIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Mashinani Qaytarish</h2>
          <p className="text-sm text-slate-500 font-medium">Bron #{id} uchun yakuniy holat tahlili</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Avtomobil suratini yuklang</h3>
          <p className="text-sm text-slate-500 mb-6">AI tizimimiz avtomobildagi tirnalish, pachoqlanish va boshqa zararlarni avtomatik aniqlaydi.</p>
          
          <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group">
            {preview ? (
              <Image src={preview} alt="Car preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            ) : null}
            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
              <p className="mb-2 text-sm text-slate-500 font-semibold shadow-sm">
                <span className="text-amber-600">Surat yuklash</span> yoki shu yerga tashlang
              </p>
              <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
          </label>
        </div>

        {photo && !result && (
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Tahlil qilinmoqda...</>
            ) : (
              "AI orqali tahlil qilish"
            )}
          </button>
        )}

        {result && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-2xl border ${result.damages_detected > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
              <div className="flex items-start gap-4">
                {result.damages_detected > 0 ? (
                  <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                )}
                <div>
                  <h4 className={`text-lg font-bold ${result.damages_detected > 0 ? "text-amber-800" : "text-green-800"}`}>
                    AI Xulosasi
                  </h4>
                  <p className={`text-sm ${result.damages_detected > 0 ? "text-amber-700" : "text-green-700"}`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>

            {result.damages_detected > 0 && (
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 px-2">Batafsil ma'lumot:</h5>
                {result.details.map((detail, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{detail.description}</p>
                      <p className="text-xs text-slate-500">Tur: {detail.type} | Daraja: {detail.severity}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block bg-slate-900 text-amber-400 text-xs font-black px-2 py-1 rounded-lg">
                        {(detail.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleConfirmReturn} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20"
            >
              Qaytarishni tasdiqlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
