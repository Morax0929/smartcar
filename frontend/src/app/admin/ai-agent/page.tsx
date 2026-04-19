"use client";

import { useState } from "react";
import { Terminal, Bot, Settings2 } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function AdminAIAgent() {
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState([
    { type: 'system', text: "SmartCar AI Agent v2.0 ishga tushdi. Buyruqlarni kuting." }
  ]);

  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setLogs(prev => [...prev, { type: 'admin', text: command }]);
    const currentCmd = command;
    setCommand("");

    // Kutish qismi
    setLogs(prev => [...prev, { type: 'ai', text: `Tahlil qilinmoqda: "${currentCmd}"...` }]);

    try {
      const res = await apiClient.post('/ai/agent', { command: currentCmd });
      const data = res.data;
      
      setLogs(prev => prev.map(log => log.text === `Tahlil qilinmoqda: "${currentCmd}"...` ? { ...log, text: log.text + (data.success ? " ✅" : " ❌") } : log));
      
      if (data.success) {
         setLogs(prev => [...prev, { type: 'success', text: data.message }]);
      } else {
         setLogs(prev => [...prev, { type: 'system', text: `Xatolik / Tushunarsiz: ${data.message}` }]);
      }
    } catch (error) {
      setLogs(prev => prev.map(log => log.text === `Tahlil qilinmoqda: "${currentCmd}"...` ? { ...log, text: log.text + " ❌" } : log));
      setLogs(prev => [...prev, { type: 'system', text: "Server bilan bog'lanib bo'lmadi! Backend (8000 port) ishga tushganini tekshiring." }]);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
         <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-amber-500" /> AI Agent Boshqaruvi
         </h2>
         <p className="text-sm text-slate-500 mt-1">
           Ilovadagi avtomobillar narxini va qoidalarini AI ga bevosita matnli buyruqlar orqali avtomatlashtiring. Bu tizimni to'liq aqlli nazorat qilish panelidir.
         </p>
       </div>

       <div className="flex-1 bg-[#0d1117] rounded-2xl shadow-lg border border-slate-800 flex flex-col overflow-hidden relative">
          <div className="h-10 bg-[#161b22] flex items-center px-4 justify-between shrink-0 border-b border-slate-800">
             <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="text-xs text-slate-400 font-mono flex items-center"><Terminal className="w-3 h-3 mr-1"/> root@smartcar-ai:~</span>
             <Settings2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm">
             {logs.map((log, idx) => (
                <div key={idx} className={`leading-relaxed
                  ${log.type === 'system' ? 'text-slate-400' : ''}
                  ${log.type === 'admin' ? 'text-blue-400' : ''}
                  ${log.type === 'ai' ? 'text-amber-400' : ''}
                  ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
                `}>
                  {log.type === 'admin' && <span className="text-slate-500 mr-2 select-none">admin@smartcar~$</span>}
                  {log.type === 'ai' && <span className="text-slate-500 mr-2 select-none">&gt; agent:</span>}
                  {log.text}
                </div>
             ))}
          </div>

          <div className="p-4 bg-[#161b22] border-t border-slate-800 shrink-0">
             <form onSubmit={executeCommand} className="flex items-center">
                <span className="text-amber-500 mr-3 font-mono font-bold select-none">&gt;</span>
                <input 
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Buyruqni yozing (Masalan: Malibu narxini juma kuniga 10% pasaytir)"
                  className="w-full bg-transparent border-none outline-none text-green-400 font-mono placeholder:text-slate-600"
                  autoFocus
                />
             </form>
          </div>
       </div>
    </div>
  );
}
