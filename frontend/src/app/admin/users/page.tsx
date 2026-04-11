"use client";

import { useEffect, useState } from "react";
import { Star, ShieldCheck, Mail, Phone, Clock, CheckCircle2, XCircle, Eye, X } from "lucide-react";
import Cookies from "js-cookie";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
}

interface Document {
  id: number;
  user_id: number;
  file_name: string;
  file_url: string;
  type: string;
  status: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserDocs, setSelectedUserDocs] = useState<Document[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const token = Cookies.get("access_token");
    try {
      const [usersRes, docsRes] = await Promise.all([
        fetch("http://localhost:8000/api/auth/users", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://localhost:8000/api/documents/all", { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (docsRes.ok) setDocuments(await docsRes.json());
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openVerificationModal = (userId: number) => {
    const userDocs = documents.filter(doc => doc.user_id === userId && ["passport", "license"].includes(doc.type));
    setSelectedUserDocs(userDocs);
    setShowModal(true);
  };

  const updateDocStatus = async (docId: number, status: string) => {
    const token = Cookies.get("access_token");
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${docId}/status?status=${status}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        // Update modal state localy
        setSelectedUserDocs(prev => prev.map(d => d.id === docId ? { ...d, status } : d));
      }
    } catch (error) {
      alert("Statusni yangilashda xatolik");
    }
  };

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mijozlar Boshqaruvi</h2>
          <p className="text-sm text-slate-500">Barcha ro'yxatdan o'tgan foydalanuvchilar va ularning hujjatlarini tekshirish.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold">
          Jami: {users.filter(u => u.role === 'user').length} ta mijoz
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Foydalanuvchi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aloqa</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {users.filter(u => u.role === 'user').map((user) => {
                  const userDocs = documents.filter(d => d.user_id === user.id && ["passport", "license"].includes(d.type));
                  const isVerified = userDocs.length > 0 && userDocs.every(d => d.status === 'verified');
                  const isPending = userDocs.some(d => d.status === 'pending');

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold rounded-full uppercase">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{user.full_name}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: #{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                            <span className="flex items-center text-xs text-slate-500"><Mail className="w-3 h-3 mr-1" /> {user.email}</span>
                            <span className="flex items-center text-xs text-slate-500"><Phone className="w-3 h-3 mr-1" /> {user.phone}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         {isVerified ? (
                           <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center w-fit gap-1"><CheckCircle2 className="w-3 h-3" /> Tasdiqlangan</span>
                         ) : isPending ? (
                           <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center w-fit gap-1"><Clock className="w-3 h-3" /> Tekshirilmoqda</span>
                         ) : (
                           <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center w-fit gap-1"><ShieldCheck className="w-3 h-3" /> Hujjat yo'q</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => openVerificationModal(user.id)}
                           className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 ml-auto"
                         >
                            <Eye className="w-3 h-3" /> Hujjatlarni ko'rish
                         </button>
                      </td>
                    </tr>
                  );
               })}
            </tbody>
         </table>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-black text-slate-900 text-xl">Hujjatlarni Tekshirish</h3>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50">
                 {selectedUserDocs.length === 0 ? (
                   <div className="col-span-2 text-center py-20 text-slate-400 italic">Mijoz hali hujjat yuklamagan</div>
                 ) : (
                   selectedUserDocs.map(doc => (
                     <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{doc.type}</span>
                           <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${doc.status === 'verified' ? 'bg-green-100 text-green-700' : doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {doc.status}
                           </span>
                        </div>
                        <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-slate-100 shadow-inner group relative">
                           <img src={doc.file_url} alt={doc.type} className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in" onClick={() => window.open(doc.file_url, '_blank')} />
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => updateDocStatus(doc.id, "verified")}
                             disabled={doc.status === "verified"}
                             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                           >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tasdiqlash
                           </button>
                           <button 
                             onClick={() => updateDocStatus(doc.id, "rejected")}
                             disabled={doc.status === "rejected"}
                             className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                           >
                              <XCircle className="w-3.5 h-3.5" /> Rad etish
                           </button>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
