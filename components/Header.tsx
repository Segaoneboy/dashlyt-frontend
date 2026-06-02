"use client"

import { useAuthStore } from '@/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { LogOut, Loader2, User, LayoutDashboard } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
    const { user, isAuthenticated, setUser, logout } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: () => apiFetch('/api/auth/me'),
        retry: false,
    });

    useEffect(() => {
        if (data && data.user) setUser(data.user);
    }, [data, setUser]);

    return (
        <header className=" top-0 z-50 w-full ">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Логотип с иконкой для брендовости */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#18a7b5] p-1.5 rounded-lg text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-2xl text-[#18a7b5] tracking-tight">DashLyt</span>
                </Link>

                {/* Навигация / Действия */}
                <div className="flex items-center gap-6">
                    {isLoading ? (
                        <Loader2 className="animate-spin text-[#18a7b5]" />
                    ) : isAuthenticated && user ? (
                        <div className="flex items-center gap-4 bg-zinc-50 py-2 px-4 rounded-full border border-zinc-100">
                            <Link href="/dashboard">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#18a7b5]/10 flex items-center justify-center text-[#18a7b5]">
                                        <User size={16} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700">{user.firstName}</span>
                                </div>
                            </Link>
                            <div className="h-4 w-px bg-zinc-300" />
                            <button 
                                onClick={() => logout()} 
                                className="text-zinc-400 hover:text-red-500 transition-colors"
                                title="Выйти"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/auth" 
                            className="text-sm font-medium text-white bg-[#18a7b5] hover:bg-[#138d99] px-5 py-2.5 rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-[#18a7b5]/20 hover:shadow-lg"
                        >
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}