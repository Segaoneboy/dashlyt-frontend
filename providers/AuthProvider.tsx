"use client";
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, setUser } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Стучимся на созданный нами эндпоинт сессии
                const res = await fetch('/api/auth/me', { method: 'GET' });
                
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user); // Восстанавливаем юзера в Zustand!
                } else {
                    setUser(null);
                    // Если мы пытаемся зайти в закрытый ЛК без куки — редирекcross на вход
                    if (pathname.startsWith('/dashboard')) {
                        router.replace('/auth');
                    }
                }
            } catch (err) {
                console.error("Ошибка проверки сессии:", err);
                setUser(null);
            } finally {
                setIsChecking(false); // Завершаем глобальную проверку
            }
        };

        checkSession();
    }, [setUser, router, pathname]);

    // Пока идет самый первый запрос к бэкенду при F5 — показываем красивый спиннер
    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#F4F7F8] flex flex-col items-center justify-center font-sans">
                <div className="w-10 h-10 border-4 border-[#18a7b5]/30 border-t-[#18a7b5] rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">Синхронизация сессии...</p>
            </div>
        );
    }

    return <>{children}</>;
}