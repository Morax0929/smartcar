import Image from "next/image";

export default function FeaturedCars() {
  const cars = [
    { name: "Chevrolet Tahoe", price: "2 200 000 UZS", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80", type: "Premium", label: "AI Tavsiyasi" },
    { name: "Kia K5", price: "800 000 UZS", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80", type: "Comfort", label: "Ommabop" },
    { name: "Chevrolet Tracker", price: "450 000 UZS", image: "https://images.unsplash.com/photo-1503376710915-18bad49eb523?w=600&auto=format&fit=crop&q=80", type: "Krossover", label: "Chegirma" }
  ];

  return (
    <section className="py-24 bg-white relative -mt-4 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Mashhur Avtomobillar</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Sayohatingiz uchun eng yaxshi mashinalarni saraladik. Dabdaba yoki arzon narx – hamma narsa bitta joyda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
              <div className="relative h-56 overflow-hidden bg-slate-50">
                <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{car.label}</div>
                {/* Image */}
                <div className="w-full h-full bg-slate-200 flex items-center justify-center p-4">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-amber-500 font-bold tracking-wider uppercase bg-amber-50 px-2 py-1 rounded-md">{car.type}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{car.name}</h3>
                
                <div className="flex justify-between items-end border-t border-slate-100 pt-4 mt-6">
                  <div>
                    <div className="text-xs text-slate-400 mb-1 font-medium">Kunlik narxi:</div>
                    <div className="text-lg font-bold text-slate-900">{car.price}</div>
                  </div>
                  <button className="bg-slate-900 hover:bg-amber-500 text-white p-3 rounded-xl transition-colors shadow-sm">
                    <span className="sr-only">Band qilish</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
