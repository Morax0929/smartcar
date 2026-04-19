'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Car, Brain, Shield, Calendar, MapPin, ChevronDown, MessageSquare, Search } from 'lucide-react'
import Chatbot from '@/components/chat/Chatbot'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [showLocations, setShowLocations] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Toshkent shahri")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const locationRef = useRef<HTMLDivElement>(null)

  const locations = [
    "Toshkent shahri",
    "Toshkent X.A",
    "Samarqand shahri",
    "Buxoro shahri",
    "Xiva shahri",
    "Farg'ona shahri",
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocations(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gray-900 rounded-md p-1.5 flex items-center justify-center">
                <Car className="h-5 w-5 text-brand-yellow" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartCar</span>
            </div>
            
            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/katalog" className="text-gray-600 hover:text-gray-900 font-medium">
                Katalog
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/my-bookings" className="text-gray-600 hover:text-gray-900 font-medium">
                Buyurtmalarim
              </Link>
            </div>
            
            {/* Right side (Lang, Currency, Profile) */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 cursor-pointer">
                <span className="text-sm font-medium text-gray-600">UZS</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-1 cursor-pointer">
                <span className="text-sm font-medium text-gray-600">EN</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-brand-yellow font-bold text-sm cursor-pointer hover:bg-gray-800 transition">
                JT
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-brand-dark pt-28 pb-48 px-4 overflow-hidden dark-gradient flex items-center justify-center">
        {/* Placeholder for the background car image fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent z-0"></div>
        <div 
          className="absolute inset-0 bg-no-repeat bg-bottom bg-contain opacity-20 z-0 pointer-events-none"
        ></div>

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Sifatli <span className="text-brand-yellow">Ijara.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            O'zbekistondagi eng qulay AI-avtomobil ijarasi platformasi. Tez bron,<br className="hidden md:block"/> oson to'lov, ishonchli xizmat.
          </p>
        </div>
      </section>

      {/* Floating Search/Filter Bar */}
      <section className="relative z-20 -mt-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
            
            <div 
              ref={locationRef}
              className="flex-1 w-full border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer relative"
              onClick={() => setShowLocations(!showLocations)}
            >
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex flex-col w-full">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qabul qilish joyi</span>
                <div className="outline-none text-gray-800 font-medium bg-transparent pt-1 w-full flex justify-between items-center">
                  <span>{selectedLocation}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showLocations ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {/* Custom Dropdown */}
              {showLocations && (
                <div className="absolute top-[80px] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-fade-in">
                  {locations.map((loc, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium text-sm transition"
                      onClick={() => setSelectedLocation(loc)}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="flex-1 w-full border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer relative"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { input.showPicker() } catch (err) {}
                }
              }}
            >
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex flex-col w-full">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Olish sanasi</span>
                <input 
                  id="pickup-date"
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="outline-none text-gray-800 font-medium bg-transparent pt-1 w-full cursor-pointer min-h-[24px]" 
                />
              </div>
            </div>

            <div 
              className="flex-1 w-full border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer relative"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { input.showPicker() } catch (err) {}
                }
              }}
            >
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex flex-col w-full">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qaytarish sanasi</span>
                <input 
                  id="return-date"
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="outline-none text-gray-800 font-medium bg-transparent pt-1 w-full cursor-pointer min-h-[24px]" 
                />
              </div>
            </div>

            <button 
              onClick={() => router.push(`/katalog?location=${selectedLocation}&pickup=${pickupDate}&return=${returnDate}`)}
              className="w-full md:w-auto bg-[#0f172a] text-white px-8 py-4 rounded-xl hover:bg-black transition font-medium whitespace-nowrap h-[68px] flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" /> Avtomobil qidirish
            </button>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Mashhur Avtomobillar</h2>
              <p className="text-gray-500 text-lg max-w-2xl">
                Eng ko'p bron qilinadigan avtomobillarimiz — narxlar talab asosida AI tomonidan yangilanadi.
              </p>
            </div>
            <button className="hidden md:inline-flex px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition">
              Hammasini ko'rish
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CarCard
              brand="Chevrolet"
              model="Damas"
              price="130,000"
              hasAiPrice={true}
              imagePath="/images/damas-placeholder.png"
            />
            <CarCard
              brand="Chevrolet"
              model="Lacetti"
              price="160,000"
              hasAiPrice={true}
              imagePath="/images/lacetti-placeholder.png"
              isActive={true}
            />
            <CarCard
              brand="Chevrolet"
              model="Spark"
              price="120,000"
              hasAiPrice={true}
              imagePath="/images/spark-placeholder.png"
            />
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 w-full transition">
              Hammasini ko'rish
            </button>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-4 bg-brand-dark text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-6 shadow-lg">
                <Brain className="h-8 w-8 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Dinamik Narx</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Aqlli tizimimiz bozor talabini tahlil qilib, eng raqobatbardosh narxlarni darhol taklif etadi.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-4">Tezkor Verifikatsiya</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Hujjatingizni yuklang va bir necha daqiqada tasdiqlang. Uzoq navbatlar va qog'ozbozlik yo'q.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-6 shadow-lg">
                <Calendar className="h-8 w-8 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-4">Moslashuvchan Ijara</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Bir kunlik sayohatdan uzoq muddatli ijaraga — o'z jadvalingizga mos rejani tanlang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Mijozlarimiz fikri
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              text="Xizmat darajasi tengsiz. AI narxlash menga oddiy ijarachilarga nisbatan 20% tejashga yordam berdi, mashina esa mukammal holatda edi."
              authorName="Jamshid Toshmatov"
              authorRole="Biznes sayohatchisi"
              initials="JT"
            />
            <TestimonialCard
              text="Bron qilish juda oson va tez. Hujjatlarimni yukladim, 5 daqiqada tasdiqlandi. Juda qulay platforma!"
              authorName="Dilnoza Yusupova"
              authorRole="Toshkent shahri"
              initials="DY"
            />
            <TestimonialCard
              text="Shahardan tashqari safarim uchun Chevrolet Tracker bron qildim. Ajoyib holat, narx ham juda mos keldi."
              authorName="Bobur Xasanov"
              authorRole="Samarqand"
              initials="BX"
            />
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />

    </div>
  )
}

function CarCard({ brand, model, price, hasAiPrice, imagePath, isActive = false }: any) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 flex flex-col h-full 
      ${isActive ? 'border-brand-yellow shadow-xl shadow-brand-yellow/10' : 'border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md'}`}>
      
      <div className="relative pt-4 px-4 pb-2 bg-gray-50 flex-1 flex flex-col justify-center items-center group">
        <div className="absolute top-0 left-4 right-4 h-1 bg-brand-yellow rounded-b-md opacity-30 group-hover:opacity-100 transition-opacity"></div>
        {hasAiPrice && (
          <div className="absolute top-4 right-4 bg-brand-yellow text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
            <Brain className="h-3 w-3" /> AI Narx
          </div>
        )}
        
        {/* We use a placeholder div that mimics an image if the image doesn't load. The user will place actual images in public/images/ later */}
        <div className="h-48 w-full flex items-center justify-center my-6">
          <div className="w-64 h-32 bg-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center">
             <span className="text-gray-400 font-medium rotate-[-15deg]">{model} Image</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <span className="inline-block bg-brand-yellow text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {brand}
          </span>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{brand}</p>
            <h3 className="text-2xl font-bold text-gray-900">{model}</h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{price} UZS</div>
            <div className="text-sm text-gray-500 font-medium">/ kun</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ text, authorName, authorRole, initials }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
      <div className="flex space-x-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-5 h-5 text-brand-yellow fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 italic mb-8 leading-relaxed">"{text}"</p>
      
      <div className="flexItems-center space-x-4">
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
          {initials}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{authorName}</h4>
          <p className="text-sm text-gray-500">{authorRole}</p>
        </div>
      </div>
    </div>
  )
}
