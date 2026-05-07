"use client";
import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#F4F7F8] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-[#18a7b5]/10 border border-slate-100 overflow-hidden transition-all duration-500">
        <div className="h-2 w-full bg-[#18a7b5]" />

        <div className="p-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-[#18a7b5] rounded-2xl flex items-center justify-center shadow-lg shadow-[#18a7b5]/30">
              <LayoutDashboard className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-[#18a7b5] tracking-tight">DashLyt</h1>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#585858]">
              {isLogin ? 'Рады видеть вас!' : 'Регистрация'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {isLogin ? 'Введите данные для входа' : 'Заполните форму ниже'}
            </p>
          </div>

          {/* Рендерим нужную форму в зависимости от стейта */}
          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-[#18a7b5] hover:text-[#148d99] transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Создать сейчас' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}