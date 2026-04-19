'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Car, Brain, Shield, Calendar, MapPin, ChevronDown, Search, X, Menu } from 'lucide-react'
import Chatbot from '@/components/chat/Chatbot'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [showLocations, setShowLocations] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Toshkent shahri")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  const handleSearch = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowAuthModal(true)
      return
    }
    router.push(`/user/cars?location=${selectedLocation}&pickup=${pickupDate}&return=${returnDate}`)
  }

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ─── NAVIGATION ─── */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gray-900 rounded-md p-1.5 flex items-center justify-center">
                <Car className="h-5 w-5 text-brand-yellow" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartCar</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/user/cars" className="text-gray-600 hover:text-gray-900 font-medium transition">Katalog</Link>
              <Link href="/user" className="text-gray-600 hover:text-gray-900 font-medium transition">Dashboard</Link>
              <Link href="/user/bookings" className="text-gray-600 hover:text-gray-900 font-medium transition">Buyurtmalarim</Link>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Kirish
              </Link>
              <Link href="/register" className="text-sm font-medium bg-gray-900 text-brand-yellow px-5 py-2 rounded-lg hover:bg-black transition">
                Ro'yxatdan o'tish
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 animate-fade-in">
            <Link href="/user/cars" className="py-2.5 text-gray-700 font-medium border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              Katalog
            </Link>
            <Link href="/user" className="py-2.5 text-gray-700 font-medium border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/user/bookings" className="py-2.5 text-gray-700 font-medium border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              Buyurtmalarim
            </Link>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition" onClick={() => setMobileMenuOpen(false)}>
                Kirish
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 bg-gray-900 text-brand-yellow rounded-xl text-sm font-semibold hover:bg-black transition" onClick={() => setMobileMenuOpen(false)}>
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative bg-brand-dark pt-16 pb-40 md:pt-28 md:pb-48 px-4 overflow-hidden dark-gradient flex items-center justify-center">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent z-0" />
        <div className="absolute inset-0 bg-no-repeat bg-bottom bg-contain opacity-20 z-0 pointer-events-none" />

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
            Sifatli <span className="text-brand-yellow">Ijara.</span>
          </h1>
          {/* v1.2.1-deploy-test */}
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            O'zbekistondagi eng qulay AI-avtomobil ijarasi platformasi.
            <span className="hidden sm:inline"> Tez bron, oson to'lov, ishonchli xizmat.</span>
          </p>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <section className="relative z-20 -mt-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-stretch gap-3">

            {/* Location */}
            <div
              ref={locationRef}
              className="flex-1 border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer relative"
              onClick={() => setShowLocations(!showLocations)}
            >
              <MapPin className="h-5 w-5 text-gray-400 mt-1 shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qabul qilish joyi</span>
                <div className="outline-none text-gray-800 font-medium bg-transparent pt-1 w-full flex justify-between items-center">
                  <span className="truncate">{selectedLocation}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${showLocations ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {showLocations && (
                <div className="absolute top-[76px] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-2">
                  {locations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 font-medium text-sm transition"
                      onClick={() => { setSelectedLocation(loc); setShowLocations(false) }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pickup date */}
            <div
              className="flex-1 border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input')
                if (input && 'showPicker' in input) { try { input.showPicker() } catch (_) {} }
              }}
            >
              <Calendar className="h-5 w-5 text-gray-400 mt-1 shrink-0" />
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

            {/* Return date */}
            <div
              className="flex-1 border border-gray-200 rounded-xl p-3 flex items-start space-x-3 hover:border-gray-300 transition focus-within:border-brand-yellow focus-within:ring-1 focus-within:ring-brand-yellow cursor-pointer"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input')
                if (input && 'showPicker' in input) { try { input.showPicker() } catch (_) {} }
              }}
            >
              <Calendar className="h-5 w-5 text-gray-400 mt-1 shrink-0" />
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

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#0f172a] text-white px-6 py-4 rounded-xl hover:bg-black transition font-semibold whitespace-nowrap flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Search className="h-5 w-5" /> Avtomobil qidirish
            </button>
          </div>
        </div>
      </section>

      {/* ─── POPULAR CARS ─── */}
      <section className="py-16 md:py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">Mashhur Avtomobillar</h2>
              <p className="text-gray-500 text-sm md:text-lg max-w-2xl">
                Eng ko'p bron qilinadigan avtomobillarimiz — narxlar AI tomonidan yangilanadi.
              </p>
            </div>
            <Link href="/user/cars" className="hidden md:inline-flex px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition">
              Hammasini ko'rish
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            <CarCard 
              brand="Chevrolet" 
              model="Damas" 
              price="130,000" 
              image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8df0?w=800&q=80"
              hasAiPrice 
            />
            <CarCard 
              brand="Chevrolet" 
              model="Lacetti" 
              price="160,000" 
              image="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"
              hasAiPrice 
              isActive 
            />
            <CarCard 
              brand="Chevrolet" 
              model="Spark" 
              price="120,000" 
              image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
              hasAiPrice 
            />
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/user/cars" className="block w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
              Hammasini ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI FEATURES ─── */}
      <section className="py-16 md:py-20 px-4 bg-brand-dark text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center">

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-4 md:mb-6 shadow-lg">
                <Brain className="h-7 w-7 md:h-8 md:w-8 text-brand-yellow" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">AI Dinamik Narx</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Aqlli tizimimiz bozor talabini tahlil qilib, eng raqobatbardosh narxlarni darhol taklif etadi.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-4 md:mb-6 shadow-lg">
                <Shield className="h-7 w-7 md:h-8 md:w-8 text-brand-yellow" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Tezkor Verifikatsiya</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Hujjatingizni yuklang va bir necha daqiqada tasdiqlang. Uzoq navbatlar yo'q.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-800/80 rounded-2xl flex items-center justify-center border border-gray-700 mb-4 md:mb-6 shadow-lg">
                <Calendar className="h-7 w-7 md:h-8 md:w-8 text-brand-yellow" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Moslashuvchan Ijara</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Bir kunlik sayohatdan uzoq muddatli ijaraga — o'z jadvalingizga mos rejani tanlang.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">
            Mijozlarimiz fikri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
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

      {/* ─── CHATBOT ─── */}
      <Chatbot />

      {/* ─── AUTH MODAL ─── */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-14 w-14 bg-gray-900 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Kirish talab etiladi</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Avtomobil qidirish va bron qilish uchun tizimga kiring yoki ro'yxatdan o'ting.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gray-900 text-brand-yellow font-semibold py-3 rounded-xl hover:bg-black transition"
              >
                Kirish
              </button>
              <button
                onClick={() => router.push('/register')}
                className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-5 text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

function CarCard({ brand, model, price, image, hasAiPrice, isActive = false }: any) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 flex flex-col h-full
      ${isActive ? 'border-brand-yellow shadow-xl shadow-brand-yellow/10' : 'border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md'}`}>

      <div className="relative pt-4 px-4 pb-2 bg-gray-50 flex-1 flex flex-col justify-center items-center group">
        <div className="absolute top-0 left-4 right-4 h-1 bg-brand-yellow rounded-b-md opacity-30 group-hover:opacity-100 transition-opacity" />
        {hasAiPrice && (
          <div className="absolute top-4 right-4 bg-brand-yellow text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 shadow-sm z-10">
            <Brain className="h-3 w-3" /> AI Narx
          </div>
        )}

        <div className="h-40 md:h-48 w-full flex items-center justify-center my-4 md:my-6 relative overflow-hidden rounded-xl">
          {image ? (
            <img 
              src={image} 
              alt={`${brand} ${model}`} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-56 md:w-64 h-28 md:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 font-medium rotate-[-15deg] text-sm">{model} Image</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="inline-block bg-brand-yellow text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {brand}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{brand}</p>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-none">{model}</h3>
          </div>
          <div className="text-right">
            <div className="text-lg md:text-xl font-extrabold text-gray-900">{price} UZS</div>
            <div className="text-[10px] sm:text-xs text-gray-500 font-medium">/ kun</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ text, authorName, authorRole, initials }: any) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
      <div className="flex space-x-1 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-4 h-4 md:w-5 md:h-5 text-brand-yellow fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 italic mb-6 leading-relaxed text-sm md:text-base">"{text}"</p>

      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0 text-sm">
          {initials}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm md:text-base">{authorName}</h4>
          <p className="text-xs md:text-sm text-gray-500">{authorRole}</p>
        </div>
      </div>
    </div>
  )
}
