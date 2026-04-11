import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full mt-16 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_car.png" 
          alt="Premium Mashina" 
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay to match the design (dark to transparent at top, and dark to white at bottom) */}
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl mt-[-50px]">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-xl font-sans">
          Sifatli <span className="text-amber-500 relative">Ijara.<span className="absolute -bottom-2 left-0 w-full h-1.5 bg-amber-500 rounded-full"></span></span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10 font-medium drop-shadow-md whitespace-pre-line leading-relaxed max-w-2xl mx-auto">
          O'zingizga yoqadigan mashinani oson va tez bron qiling. Tashvishsiz, hamyonbop va qulay sayohatingizni kashf eting.
        </p>

        {/* Search Bar matching design */}
        <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-4xl mx-auto flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 mt-8 border border-white/20">
          <div className="flex-1 w-full relative">
            <div className="flex items-center px-4 py-3 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl w-full transition">
              <span className="text-slate-400 mr-3 text-lg">📍</span>
              <div className="flex flex-col text-left w-full">
                <span className="text-xs text-slate-500 mb-0.5">Qabul qilish joyi</span>
                <input type="text" placeholder="Toshkent shahri" className="bg-transparent border-none outline-none w-full text-slate-900 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="flex items-center px-4 py-3 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl w-full transition">
               <span className="text-slate-400 mr-3 text-lg">📅</span>
               <div className="flex flex-col text-left w-full">
                 <span className="text-xs text-slate-500 mb-0.5">Olish sanasi</span>
                 <input type="text" placeholder="Bugun yoki ertaga" className="bg-transparent border-none outline-none w-full text-slate-900 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400" />
               </div>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="flex items-center px-4 py-3 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl w-full transition">
               <span className="text-slate-400 mr-3 text-lg">📅</span>
               <div className="flex flex-col text-left w-full">
                 <span className="text-xs text-slate-500 mb-0.5">Qaytarish sanasi</span>
                 <input type="text" placeholder="Vaqtni tanlang" className="bg-transparent border-none outline-none w-full text-slate-900 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400" />
               </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] whitespace-nowrap">
            Avtomobil qidirish
          </button>
        </div>
      </div>
    </div>
  );
}
