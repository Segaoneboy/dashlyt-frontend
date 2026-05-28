"use client";
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore'; // Импортируем наш Zustand-стор

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Стейт для локального вывода ошибок

    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser); // Забираем метод установки юзера

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Сбрасываем прошлую ошибку перед новым запросом
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // Если бэкенд вернул ошибку, берем сообщение из ответа базы или пишем дефолтное
                throw new Error(data.message || 'Ошибка при авторизации');
            }

            // Бэкенд теперь возвращает { message, user: { id, email, role } }
            // Сохраняем эти данные в глобальный стейт Zustand
            setUser(data.user);
            
            console.log('Вы успешно вошли в систему');
            router.replace('/dashboard');
            
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'Не удалось связаться с сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
            
            {/* Блок вывода ошибки пользователю */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold">
                    {error}
                </div>
            )}

            {/* Email Input */}
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
                <input 
                    type="email" 
                    placeholder="Email адрес"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858] font-medium"
                />
            </div>

            {/* Password Input */}
            <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#18a7b5] transition-colors" size={20} />
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Пароль"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[#18a7b5] focus:ring-4 focus:ring-[#18a7b5]/5 transition-all text-[#585858] font-medium"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18a7b5] transition-colors p-1"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#18a7b5] hover:bg-[#148d99] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#18a7b5]/25 mt-6 flex items-center justify-center gap-2 group active:scale-95"
            >
                {loading ? 'Вход...' : 'Войти в аккаунт'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </form>
    );
}