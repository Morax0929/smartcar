"use client";

import { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquareText, Send, X } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Car {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  is_available: boolean;
  year: number;
  description?: string;
}

function getReply(msg: string, cars: Car[]): string {
  const m = msg.toLowerCase().trim();
  const avail = cars.filter(c => c.is_available);

  // SALOMLASHISH
  if (/salom|assalom|hi\b|hello|hey\b|yaxshimisiz/.test(m)) {
    return "Assalomu alaykum! 👋 SmartCar AI yordamchisiman.\n\nSizga qanday yordam bera olaman?\n• 🚗 Mashina tanlash\n• 💰 Narxlar haqida\n• 📋 Bron qilish tartibi\n\nShunchaki so'rang!";
  }

  // XAYR / RAHMAT
  if (/rahmat|tashakkur|ko.rishguncha|yaxshi b.ling/.test(m)) {
    return "Xayr! 😊 SmartCar'dan foydalanganingiz uchun rahmat. Yana keladigan bo'lsangiz, doim xizmatdamiz! 🚗";
  }

  // NECHTA MASHINA
  if (/nechta|qancha|jami|soni/.test(m)) {
    return `🚗 Bazamizda jami **${cars.length} ta** avtomobil bor.\nUlardan **${avail.length} tasi** hozir ijaraga mavjud, **${cars.length - avail.length} tasi** band.`;
  }

  // MAVJUD
  if (/mavjud|bo.sh|ijaraga olsa|qaysilari bor|free|available/.test(m)) {
    if (!avail.length) return "😔 Hozirda barcha mashinalarimiz band. Tez orada yangilari qo'shiladi!";
    const sample = avail.slice(0, 4);
    const lines = sample.map(c => `  • ${c.brand} ${c.name} (${c.year}) — ${c.price_per_day.toLocaleString()} so'm/kun`).join('\n');
    const more = avail.length > 4 ? `\n  ...va yana ${avail.length - 4} ta` : '';
    return `✅ Hozir ijaraga mavjud **${avail.length} ta** avtomobil:\n${lines}${more}\n\nKatalogga o'ting: /user/cars`;
  }

  // ARZON / EKONOM
  if (/arzon|ekonom|budget|tejamkor|kam pul|narxi past|qimmat emas/.test(m)) {
    if (!avail.length) return "Hozirda bo'sh mashinalarimiz yo'q. Birozdan keyin qaytib ko'ring!";
    const top3 = [...avail].sort((a, b) => a.price_per_day - b.price_per_day).slice(0, 3);
    const lines = top3.map((c, i) => `  ${i + 1}. ${c.brand} ${c.name} — **${c.price_per_day.toLocaleString()} so'm/kun**`).join('\n');
    return `💰 Eng arzon 3 ta variant:\n${lines}\n\nBularning barchasi hozir bo'sh va tayyor!`;
  }

  // PREMIUM / VIP
  if (/premium|qimmat|lyuks|luxury|vip|hashamat|biznes|eng yaxshi/.test(m)) {
    const top3 = [...avail].sort((a, b) => b.price_per_day - a.price_per_day).slice(0, 3);
    if (!top3.length) return "Premium mashinalarimiz hozirda band. Tez orada bo'shaydi!";
    const lines = top3.map((c, i) => `  ${i + 1}. ${c.brand} ${c.name} — **${c.price_per_day.toLocaleString()} so'm/kun** ⭐`).join('\n');
    return `👑 Premium sinfdagi eng zo'r mashinalarimiz:\n${lines}\n\nSifat va qulaylik kafolatlangan!`;
  }

  // OILAVIY
  if (/oilaviy|oila\b|bola|katta salon|kengroq|7 kishilik|minivan/.test(m)) {
    const fam = avail.filter(c => ['Krossover', 'SUV', 'Minivan', 'Off-road'].includes(c.category));
    if (fam.length) {
      const c = fam[0];
      return `👨‍👩‍👧‍👦 Oilaviy sayohatlar uchun tavsiyam:\n\n🚙 **${c.brand} ${c.name}** (${c.year})\n💰 Kunlik: ${c.price_per_day.toLocaleString()} so'm\n📦 Keng salon, yuqori klirens\n\nBron uchun katalogga o'ting!`;
    }
    return "SUV va krossoverlarimiz hozirda band. Lekin tez orada yangilari keladi!";
  }

  // SPORT / TEZ
  if (/sport|turbo|kuchli|shiddatli|racing|tez mashina/.test(m)) {
    const sp = avail.filter(c => ['Premium', 'Sporty', 'Sport'].includes(c.category));
    if (sp.length) {
      const c = sp[0];
      return `🏎️ Tezlik va adrenalinga oshiq bo'lsangiz:\n\n⚡ **${c.brand} ${c.name}** (${c.year})\n💰 Kunlik: ${c.price_per_day.toLocaleString()} so'm\n\nBu mashina sizni hayajontantirishiga kafilman!`;
    }
    return "Sport mashinalarimiz hozir ijarada. Boshqa kategoriyalardan birini ko'ring!";
  }

  // ELEKTR / EV
  if (/elektr|electric|\bev\b|zaryadla|\beco\b|gibrid|hybrid|\bbyd\b|tesla/.test(m)) {
    const ev = avail.filter(c => ['EV', 'PHEV', 'Hybrid'].includes(c.category) || ['BYD', 'Tesla', 'Volkswagen'].includes(c.brand));
    if (ev.length) {
      const c = ev[0];
      return `⚡ Ekologik toza elektr avtomobillarimiz:\n\n🔋 **${c.brand} ${c.name}** (${c.year})\n💰 Kunlik: ${c.price_per_day.toLocaleString()} so'm\n🌱 Benzin sarfi: 0 litr!\n\nKelajakni bugun boshdan kechiring!`;
    }
    return "Elektr mashinalarimiz hozir ijarada. Tez orada qaytib kelishadi!";
  }

  // NARX
  if (/narx|qancha turadi|necha so.m|tariflar|kunlik narx/.test(m)) {
    if (!avail.length) return "Hozirda bo'sh mashinalarimiz yo'q.";
    const sorted = [...avail].sort((a, b) => a.price_per_day - b.price_per_day);
    const mn = sorted[0], mx = sorted[sorted.length - 1];
    const avg = Math.round(avail.reduce((s, c) => s + c.price_per_day, 0) / avail.length);
    return `💵 Narxlar diapazoni:\n\n📉 Eng arzon: **${mn.price_per_day.toLocaleString()} so'm/kun** (${mn.brand} ${mn.name})\n📈 Eng qimmat: **${mx.price_per_day.toLocaleString()} so'm/kun** (${mx.brand} ${mx.name})\n\nO'rtacha: **${avg.toLocaleString()} so'm/kun**`;
  }

  // BRON
  if (/bron|qanday olsa|ijara\b|olmoqchi|rezerv|zakazla/.test(m)) {
    return "📋 Mashina bron qilish tartibi:\n\n1️⃣ Ro'yxatdan o'ting yoki tizimga kiring\n2️⃣ /user/cars sahifasidan mashina tanlang\n3️⃣ Sanalarni belgilang va «Bron» tugmasini bosing\n4️⃣ To'lov qiling (Karta yoki naqd)\n5️⃣ Shartnoma elektron imzolanadi\n\n⏱️ Butun jarayon 5 daqiqa!";
  }

  // HUJJAT
  if (/hujjat|guvohnoma|pasport|\bid\b|nima kerak|talab|shart|\bkyc\b/.test(m)) {
    return "📄 Ijara uchun talab qilinadigan hujjatlar:\n\n✅ Pasport (shaxsni tasdiqlovchi)\n✅ Xaydovchilik guvohnomasi\n\nHujjatlarni tizimga yuklang — 5 daqiqada tasdiqlash!";
  }

  // TO'LOV
  if (/to.lov|payme|click|karta|naqd|payment/.test(m)) {
    return "💳 To'lov usullari:\n\n💳 Plastik karta (Visa/Mastercard/UzCard)\n📱 PayMe va Click orqali\n💵 Naqd pul (ofisda)\n\nBarcha to'lovlar xavfsiz shifrlangan!";
  }

  // SHAHAR / YO'L
  if (/toshkent|samarqand|buxoro|farg.ona|xiva|shahar|safar|\btrip\b/.test(m)) {
    const sedan = avail.filter(c => ['Sedan', 'Comfort'].includes(c.category));
    if (sedan.length) {
      const c = sedan[0];
      return `🗺️ Shaharlararo sayohat uchun:\n\n🚗 **${c.brand} ${c.name}** — qulay, tejamkor va ishonchli!\n💰 Kunlik: ${c.price_per_day.toLocaleString()} so'm`;
    }
    return "Shaharlararo sayohat uchun mashinalarimiz hozir band. Birozdan keyin qaytib ko'ring!";
  }

  // OFFROAD / TOG'
  if (/tog.|offroad|off-road|qiyalik|jeep|prado/.test(m)) {
    const off = avail.filter(c => ['Off-road', 'SUV', 'Krossover'].includes(c.category));
    if (off.length) {
      const c = off[0];
      return `⛰️ Og'ir yo'llar uchun:\n\n🏔️ **${c.brand} ${c.name}** (${c.year})\n💰 Kunlik: ${c.price_per_day.toLocaleString()} so'm\n🔒 Yuqori klirens — har qanday yo'lda ishonchli!`;
    }
    return "Offroad mashinalarimiz hozir ijarada. Tez orada yangilari keladi!";
  }

  // YORDAM
  if (/yordam|help|nima qila olasan|imkoniyat|buyruq/.test(m)) {
    return "🤖 Men quyidagi savollarga javob bera olaman:\n\n🚗 Mashina tanlab berish\n💰 Narxlar va chegirmalar\n📋 Bron qilish tartibi\n📄 Kerakli hujjatlar\n💳 To'lov usullari\n⚡ Elektr va gibrid mashinalar\n👨‍👩‍👧 Oilaviy avtomobillar\n🏎️ Sport mashinalar\n⛰️ Offroad mashinalar\n\nShunchaki so'rang!";
  }

  // ANIQ MASHINA HAQIDA
  for (const c of cars) {
    if (m.includes(c.name.toLowerCase()) || m.includes(c.brand.toLowerCase())) {
      const status = c.is_available ? "✅ Hozir mavjud" : "❌ Hozir band";
      return `🚗 **${c.brand} ${c.name}** (${c.year}) haqida:\n\n💰 Kunlik narx: **${c.price_per_day.toLocaleString()} so'm**\n📁 Kategoriya: ${c.category}\n📊 Holati: ${status}${c.description ? '\n\n' + c.description : ''}\n\nBron uchun katalogga o'ting!`;
    }
  }

  // DEFAULT
  const tips = ["arzon mashinalar", "premium avtomobillar", "oilaviy mashina", "elektr mashina", "bron qilish tartibi"];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return `🤔 Savolingizni tushunmadim.\n\n«${tip}» kabi yozib ko'ring yoki mashina nomini ayting.\n\nYordam uchun «yordam» deb yozing! 😊`;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalomu alaykum! 👋 Men SmartCar AI yordamchisiman.\n\nSizga qanday avtomobil kerak? So'rang — yordam beraman!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient.get('/cars/').then(res => setCars(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600));
    const reply = getReply(userMsg, cars);
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-110 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{ width: '52px', height: '52px' }}
        aria-label="AI Chat"
      >
        <MessageSquareText className="w-6 h-6" />
      </button>

      {/* Chat window */}
      <div
        className={`fixed z-50 transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          inset-0
          sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-auto sm:rounded-2xl
          bg-white flex flex-col shadow-2xl border border-slate-200 overflow-hidden
          rounded-none sm:rounded-2xl
        `}
      >
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 sm:px-5 sm:py-4 shrink-0 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">SmartCar AI</h3>
              <div className="text-[10px] text-green-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 inline-block" /> Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 sm:max-h-80">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm shadow-sm leading-relaxed whitespace-pre-line
                  ${msg.role === 'user'
                    ? 'bg-amber-500 text-slate-900 rounded-br-sm'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <form className="flex items-center gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AI ga savol yozing..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
