"use client";

import { useState } from 'react';
import { Bot, MessageSquareText, Send, X } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Assalomu alaykum! Men SmartCar AI yordamchisiman. Sizga qanday avtomobil qidirishda yordam beray?" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Kechirasiz, tizimda xatolik yuz berdi." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Server bilan aloqa uzildi." }]);
    }
  };

  return (
    <>
      {/* FAB tugmasi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 w-13 h-13 sm:w-14 sm:h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-110 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        style={{ width: '52px', height: '52px' }}
        aria-label="AI Chat"
      >
        <MessageSquareText className="w-6 h-6" />
      </button>

      {/* Chat oynasi — mobilda to'liq ekran, desktopda fixed karta */}
      <div
        className={`fixed z-50 transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          /* Mobile: to'liq ekran */
          inset-0
          /* Desktop: pastki o'ng burchak */
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
              <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm shadow-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-amber-500 text-slate-900 rounded-br-sm'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
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
              className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
