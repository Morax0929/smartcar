"use client";

import { useEffect, useState } from "react";
import { FileText, FileUp, ShieldCheck, Clock, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api";

interface Document {
  id: number;
  file_name: string;
  file_url: string;
  type: string;
  status: string;
  created_at: string;
  booking_id?: number;
}

export default function UserDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/documents/my');
      setDocuments(res.data);
    } catch (error) {
      console.error("Hujjatlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    const token = Cookies.get("access_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post(`/documents/upload?type=${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
    } catch (error) {
      alert("Hujjatni yuklashda xatolik");
    } finally {
      setUploading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-2 py-1 rounded-lg"><CheckCircle2 className="w-3 h-3" /> Tasdiqlangan</span>;
      case "rejected": return <span className="flex items-center gap-1 text-red-600 font-bold text-[10px] uppercase bg-red-50 px-2 py-1 rounded-lg"><AlertCircle className="w-3 h-3" /> Rad etildi</span>;
      default: return <span className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase bg-amber-50 px-2 py-1 rounded-lg"><Clock className="w-3 h-3" /> Tekshirilmoqda</span>;
    }
  };

  const docConfig = [
    { title: "Passport / ID Karta", type: "passport", desc: "Shaxsingizni tasdiqlovchi asosiy hujjat" },
    { title: "Haydovchilik Guvohnomasi", type: "license", desc: "Avtomobil boshqarish huquqini beruvchi hujjat" },
  ];

  const filteredDocs = (type: string) => documents.find(d => d.type === type);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Hujjatlar va Verifikatsiya</h1>
        <p className="text-slate-500 text-sm">Avtomobil ijarasi uchun hujjatlaringizni yuklang va boshqaring</p>
      </div>

      {/* KYC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docConfig.map((item) => {
          const doc = filteredDocs(item.type);
          return (
            <div key={item.type} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  {doc && getStatusBadge(doc.status)}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-6">{item.desc}</p>
              </div>

              {doc ? (
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                      <img src={doc.file_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800 truncate max-w-[120px]">{doc.file_name}</p>
                      <p className="text-[9px] text-slate-400 font-medium">Yuklangan: {new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href={doc.file_url} target="_blank" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-slate-600" />
                  </a>
                </div>
              ) : (
                <label className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${uploading === item.type ? 'bg-amber-50 border-amber-300' : 'border-slate-100 hover:border-amber-400 hover:bg-amber-50/30'}`}>
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, item.type)} accept="image/*" />
                  {uploading === item.type ? (
                    <Clock className="w-8 h-8 text-amber-500 animate-spin" />
                  ) : (
                    <>
                      <FileUp className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-bold text-slate-500 underline decoration-amber-500/30">Yuklash uchun bosing</span>
                    </>
                  )}
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Generated Documents (Agreements & Receipts) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-green-50 p-3 rounded-2xl">
             <ShieldCheck className="w-6 h-6 text-green-600" />
           </div>
           <div>
             <h3 className="font-bold text-slate-900">Ijara Shartnomalari va Cheklar</h3>
             <p className="text-xs text-slate-500">Barcha avtomatik yaratilgan hujjatlar ro'yxati</p>
           </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Yuklanmoqda...</div>
          ) : documents.filter(d => ["agreement", "receipt"].includes(d.type)).length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-100">
              <p className="text-sm text-slate-400 font-medium italic">Hozircha tizimda hujjatlar mavjud emas</p>
            </div>
          ) : (
            documents.filter(d => ["agreement", "receipt"].includes(d.type)).map((doc) => (
              <div key={doc.id} className="group p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                       {doc.type === 'agreement' ? 'Ijara Shartnomasi' : 'To\'lov Cheki'}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">Fayl: {doc.file_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right mr-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sana</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(doc.created_at).toLocaleDateString()}</p>
                   </div>
                   <a 
                     href={doc.type === 'agreement' ? `/user/bookings/${doc.booking_id}/agreement` : doc.file_url} 
                     target={doc.type === 'agreement' ? "_self" : "_blank"}
                     className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                   >
                      {doc.type === 'agreement' ? <FileText className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                   </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
