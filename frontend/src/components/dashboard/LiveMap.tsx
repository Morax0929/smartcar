"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Car } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Nukus markazi koordinatalari
const NUKUS_CENTER: [number, number] = [42.4602, 59.6179];

// Nukus bo'ylab tasodifiy joylashuv (radius ichida)
const generateRandomPosition = (): [number, number] => {
  const dPos = 0.05; // ~5km radius
  return [
    NUKUS_CENTER[0] + (Math.random() - 0.5) * dPos,
    NUKUS_CENTER[1] + (Math.random() - 0.5) * dPos,
  ];
};

interface ActiveCar {
  id: number;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  status: string;
}

export default function LiveMap() {
  const [activeCars, setActiveCars] = useState<ActiveCar[]>([]);

  useEffect(() => {
    // API orqali bron qilingan mashinalarni olish simulyatsiyasi
    const fetchActiveCars = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bookings/all", {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') || document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1") : ''}`
          }
        });
        if (res.ok) {
          const bookings = await res.json();
          // Faqat tasdiqlangan (ijaradagi) mashinalar uchun
          const active = bookings.filter((b: any) => b.status === "confirmed");
          
          const carsWithMapData = active.map((b: any) => {
            const pos = generateRandomPosition();
            return {
              id: b.id,
              name: b.car_name,
              brand: b.car_brand,
              lat: pos[0],
              lng: pos[1],
              status: "Harakatda"
            };
          });
          
          setActiveCars(carsWithMapData);
        }
      } catch (err) {
        console.error("Xarita ma'lumotlarini olishda xatolik");
      }
    };
    
    fetchActiveCars();

    // Mashinalarni xaritada real vaqtda harakatlantirish
    const interval = setInterval(() => {
      setActiveCars(prev => prev.map(car => {
        // Har 3 soniyada xaritadan biroz siljiydi
        const newLat = car.lat + (Math.random() - 0.5) * 0.001; 
        const newLng = car.lng + (Math.random() - 0.5) * 0.001;
        return { ...car, lat: newLat, lng: newLng };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Maxsus marker icon yaratish (Lucide react bilan)
  const createCustomIcon = (color: string) => {
    const iconMarkup = renderToStaticMarkup(
      <div className={`bg-${color}-500 w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white`}>
        <span className="w-2 h-2 bg-white rounded-full animate-ping absolute"></span>
      </div>
    );
    return L.divIcon({
      html: iconMarkup,
      className: "custom-leaflet-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer 
        center={NUKUS_CENTER} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {activeCars.map(car => (
          <Marker 
            key={car.id} 
            position={[car.lat, car.lng]}
            icon={createCustomIcon('amber')}
          >
            <Popup className="rounded-xl">
              <div className="p-1">
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">{car.brand}</span>
                <h3 className="font-bold text-slate-900 text-sm m-0">{car.name}</h3>
                <p className="text-xs text-slate-500 m-0 mt-1">Status: <span className="text-green-600 font-bold">{car.status}</span></p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">Qayd #{car.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
      
      {/* Harakat indikatori */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow border border-slate-200">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-bold text-slate-700">{activeCars.length} ta aktiv ijara Live Track qilinmoqda</span>
        </div>
      </div>
    </div>
  );
}
