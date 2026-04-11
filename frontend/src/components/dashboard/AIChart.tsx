"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function AIPriceChart() {
  const data = [
    { time: '08:00', price: 400, demand: 20 },
    { time: '10:00', price: 450, demand: 40 },
    { time: '12:00', price: 600, demand: 85 },
    { time: '14:00', price: 580, demand: 70 },
    { time: '16:00', price: 700, demand: 95 },
    { time: '18:00', price: 800, demand: 100 },
    { time: '20:00', price: 650, demand: 60 },
  ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" name="O'rtacha Narx (Ming UZS)" />
          <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Talab (%)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
