"use client";
import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

export default function RegisterForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('dev');
  const [showPassword, setShowPassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: 'dev', label: 'Разработчик (Dev)' },
    { id: 'pm', label: 'Проект-менеджер (PM)' },
    { id: 'teamlead', label: 'Тимлид' }
  ];

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Регистрация:", { role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
      {/* Поле Имени */}
      <div className="relative group">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Ваше имя"
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858]"
        />
      </div>

      {/* Поле Email */}
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
        <input 
          type="email" 
          placeholder="Email адрес"
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858]"
        />
      </div>

      {/* ПОЛНОСТЬЮ КАСТОМНЫЙ SELECT */}
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-10 cursor-pointer transition-all
            ${isOpen ? 'border-[#18a7b5] ring-4 ring-[#18a7b5]/5' : 'border-slate-200'}
            hover:border-[#18a7b5]
          `}
        >
          <Briefcase className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-[#18a7b5]' : 'text-slate-400'}`} size={20} />
          
          <span className="text-[#585858] font-medium">
            {roles.find(r => r.id === role)?.label}
          </span>

          <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#18a7b5]' : 'text-slate-400'}`} size={18} />
        </div>

        {/* Выпадающий список */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-[#18a7b5]/10 overflow-hidden animate-in zoom-in-95 duration-200">
            {roles.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setRole(item.id);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between px-6 py-4 cursor-pointer transition-colors
                  ${role === item.id ? 'bg-[#18a7b5]/10 text-[#18a7b5]' : 'text-[#585858] hover:bg-slate-50'}
                `}
              >
                <span className="font-medium">{item.label}</span>
                {role === item.id && <Check size={18} className="text-[#18a7b5]" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Поле Пароля с Глазком */}
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
        Создать аккаунт
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}