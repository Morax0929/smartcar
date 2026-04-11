import { Bot, Sparkles, Sliders } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-slate-900 py-24 border-y border-slate-800 relative shadow-inner">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          <div className="flex flex-col items-center group">
             <div className="bg-amber-500/10 p-5 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 border border-amber-500/20">
                <Sparkles className="w-8 h-8 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">AI Asosidagi Narx</h3>
             <p className="text-slate-400 font-medium leading-relaxed">Eng qulay onlayn narxlash. Mijozning talabi avtomat tahlil qilinib, shaffof va real narxlar belgilanadi.</p>
          </div>

          <div className="flex flex-col items-center group">
             <div className="bg-amber-500/10 p-5 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 border border-amber-500/20">
                <Bot className="w-8 h-8 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Tezkor AI Chatbot</h3>
             <p className="text-slate-400 font-medium leading-relaxed">Kun-u tun ishlaydigan aqlli yordamchimiz sizga qaysi mashina yaxshiroq ekanini maslahat beradi.</p>
          </div>

          <div className="flex flex-col items-center group">
             <div className="bg-amber-500/10 p-5 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 border border-amber-500/20">
                <Sliders className="w-8 h-8 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Bashoratli Xizmat</h3>
             <p className="text-slate-400 font-medium leading-relaxed">Xizmat va tekshiruv vaqtlari tizim tomonidan doim nazoratda. Safringiz davomida xavotirga o'rin yo'q.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
