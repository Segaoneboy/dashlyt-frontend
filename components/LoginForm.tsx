"use client";
import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Логика входа");
    };
    

    return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
        <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
        <input 
            type="email" 
            placeholder="Email адрес"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858]"
        />
        </div>

    <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
        <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Пароль"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858]"
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18a7b5] transition-colors p-1"
        >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    </div>

        <button 
        type="submit"
        className="w-full bg-[#18a7b5] hover:bg-[#148d99] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#18a7b5]/25 mt-6 flex items-center justify-center gap-2 group active:scale-95"
        >
        Войти в систему
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </form>
    );
};