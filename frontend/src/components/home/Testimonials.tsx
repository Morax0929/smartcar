import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Jasur Abdullaev",
      role: "Tadbirkor",
      content: "Juda qulay va premium xizmat. AI menga aynan o'zim xohlagan sport avtomobilini ajoyib chegirma bilan topib berdi.",
      rating: 5,
    },
    {
      id: 2,
      name: "Alisher Vahobov",
      role: "Sayohatchi",
      content: "Toshkentdan Samarqandga sayohat uchun mashina bexato tayyorlab berildi. Narxlar juda shaffof, ayniqsa AI Chatbot tez yordam berdi.",
      rating: 5,
    },
    {
      id: 3,
      name: "Malika Karimova",
      role: "Mijoz",
      content: "Avtomobil ijarasi uchun bunchalik oson platformani ko'rmaganman. Mashinalar juda toza va xavfsiz holatda keldi.",
      rating: 5,
    }
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Mijozlarimiz fikri</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Sifatli xizmat ko'rsatish bizning yutuqlarimiz asosidir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 min-h-[80px] italic">"{review.content}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold mr-3">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
