import React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function Header() {
    return (
        <header className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center relative z-10">
            {/* Логотип со ссылкой на главную */}
            <Link href="/" className="flex items-center gap-3 active:scale-98 transition-transform">
                <div className="w-9 h-9 bg-[#18a7b5] rounded-xl flex items-center justify-center shadow-md shadow-[#18a7b5]/30">
                    <LayoutDashboard className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black text-[#18a7b5] tracking-tight">DashLyt</span>
            </Link>
            
            {/* Кнопки авторизации */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/auth" 
                    className="text-slate-500 hover:text-[#18a7b5] font-bold text-sm transition-colors px-4 py-2"
                >
                    Войти
                </Link>
                <Link 
                    href="/auth" 
                    className="bg-white hover:bg-slate-50 text-[#18a7b5] border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
                >
                    Регистрация
                </Link>
            </div>
        </header>
    );
}