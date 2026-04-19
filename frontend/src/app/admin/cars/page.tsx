"use client";

import { useEffect, useState } from "react";
import {
  Car, Plus, Pencil, Trash2, X, CheckCircle2,
  AlertCircle, Search, ToggleLeft, ToggleRight, Loader2, ImageIcon
} from "lucide-react";
import Cookies from "js-cookie";
import { getImageUrl } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "https://smartcar-backend.onrender.com/api";

interface CarItem {
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

const EMPTY_FORM = {
  name: "", brand: "", category: "", price_per_day: 0,
  image_url: "", description: "", is_available: true, year: new Date().getFullYear(),
};

type Toast = { type: "success" | "error"; msg: string } | null;

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState<CarItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<CarItem | null>(null);

  const token = Cookies.get("access_token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/cars/`);
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Avtomobillarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const openCreate = () => {
    setEditCar(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (car: CarItem) => {
    setEditCar(car);
    setForm({
      name: car.name, brand: car.brand, category: car.category,
      price_per_day: car.price_per_day, image_url: car.image_url,
      description: car.description, is_available: car.is_available, year: car.year,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.category || !form.price_per_day) {
      showToast("error", "Barcha majburiy maydonlarni to'ldiring");
      return;
    }
    setSaving(true);
    try {
      const url = editCar ? `${API}/cars/${editCar.id}` : `${API}/cars/`;
      const method = editCar ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(form) });
      if (res.ok) {
        showToast("success", editCar ? "Avtomobil yangilandi ✓" : "Avtomobil qo'shildi ✓");
        setShowModal(false);
        fetchCars();
      } else {
        const err = await res.json();
        showToast("error", err.detail || "Xatolik yuz berdi");
      }
    } catch {
      showToast("error", "Server bilan aloqa yo'q");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (car: CarItem) => {
    setDeletingId(car.id);
    try {
      const res = await fetch(`${API}/cars/${car.id}`, { method: "DELETE", headers: authHeaders });
      if (res.ok) {
        showToast("success", `${car.name} o'chirildi`);
        fetchCars();
      } else {
        showToast("error", "O'chirishda xatolik");
      }
    } catch {
      showToast("error", "Server bilan aloqa yo'q");
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleToggleAvailability = async (car: CarItem) => {
    try {
      const res = await fetch(`${API}/cars/${car.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ ...car, is_available: !car.is_available }),
      });
      if (res.ok) {
        showToast("success", `${car.name} holati o'zgartirildi`);
        fetchCars();
      }
    } catch {
      showToast("error", "Holat o'zgartirishda xatolik");
    }
  };

  const filtered = cars.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.brand.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.is_available).length,
    unavailable: cars.filter(c => !c.is_available).length,
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-semibold text-sm transition-all animate-fade-in
          ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Avtomobillar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm mt-1">Barcha avtomobillarni qo'shing, tahrirlang va boshqaring</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Yangi avtomobil
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Jami", value: stats.total, color: "bg-slate-900 text-white" },
          { label: "Mavjud", value: stats.available, color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
          { label: "Band", value: stats.unavailable, color: "bg-red-50 text-red-700 border border-red-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-amber-500 transition-colors shadow-sm">
        <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Brend, model yoki kategoriya bo'yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm w-full text-slate-700"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mr-3" /> Yuklanmoqda...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Car className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-semibold">Avtomobil topilmadi</p>
            <p className="text-sm mt-1">Yangi avtomobil qo'shing yoki qidiruvni o'zgartiring</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rasm</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Avtomobil</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategoriya</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Narx/kun</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Holat</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(car => (
                  <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                    {/* Image */}
                    <td className="px-5 py-4">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {car.image_url ? (
                          <img src={getImageUrl(car.image_url)} alt={car.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Name / Brand / Year */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{car.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{car.brand} · {car.year}</div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {car.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {car.price_per_day.toLocaleString()} <span className="text-xs font-normal text-slate-400">UZS</span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleAvailability(car)}
                        className="flex items-center gap-2 text-xs font-semibold"
                      >
                        {car.is_available ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-emerald-500" />
                            <span className="text-emerald-600">Mavjud</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-slate-400" />
                            <span className="text-slate-400">Band</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(car)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors"
                          title="Tahrirlash"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(car)}
                          disabled={deletingId === car.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="O'chirish"
                        >
                          {deletingId === car.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editCar ? "Avtomobilni tahrirlash" : "Yangi avtomobil qo'shish"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Model nomi *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Lacetti" />
                <Field label="Brend *" value={form.brand} onChange={v => setForm({ ...form, brand: v })} placeholder="Chevrolet" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kategoriya *" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Sedan" />
                <Field label="Yil" value={String(form.year)} onChange={v => setForm({ ...form, year: Number(v) })} placeholder="2022" type="number" />
              </div>
              <Field label="Narx (UZS/kun) *" value={String(form.price_per_day)} onChange={v => setForm({ ...form, price_per_day: Number(v) })} placeholder="250000" type="number" />
              <Field label="Rasm URL" value={form.image_url} onChange={v => setForm({ ...form, image_url: v })} placeholder="https://..." />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tavsif</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Avtomobil haqida qisqacha..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition resize-none"
                />
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-700">Mavjud holati</span>
                <button
                  onClick={() => setForm({ ...form, is_available: !form.is_available })}
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  {form.is_available ? (
                    <><ToggleRight className="w-7 h-7 text-emerald-500" /><span className="text-emerald-600">Mavjud</span></>
                  ) : (
                    <><ToggleLeft className="w-7 h-7 text-slate-400" /><span className="text-slate-400">Band</span></>
                  )}
                </button>
              </div>

              {/* Preview image */}
              {form.image_url && (
                <div className="rounded-xl overflow-hidden h-40 bg-slate-100">
                  <img src={getImageUrl(form.image_url)} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editCar ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM ─── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">O'chirishni tasdiqlang</h3>
            <p className="text-slate-500 text-sm mb-6">
              <span className="font-semibold text-slate-700">{showDeleteConfirm.name}</span> avtomobilini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition"
      />
    </div>
  );
}
