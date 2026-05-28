"use client";
import { User as UserIcon, Mail, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function UserProfileCard() {
    // 1. Используем строгие атомарные селекторы (один вызов — одно свойство)
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout); 
    const router = useRouter();

    if (!user) return null;

    // Настройка цвета бейджа в зависимости от роли
    const roleConfig = {
        pm: { label: 'Project Manager', styles: 'bg-purple-50 text-purple-600 border-purple-100' },
        teamlead: { label: 'Team Lead', styles: 'bg-green-50 text-green-600 border-green-100' },
        employee: { label: 'Developer', styles: 'bg-blue-50 text-blue-600 border-blue-100' },
    };

    const currentRole = roleConfig[user.role] || { label: 'Сотрудник', styles: 'bg-slate-50 text-slate-600 border-slate-100' };

    // Функция обработки выхода из системы
    const handleLogout = async () => {
        try {
            // Отправляем запрос на бэкенд для удаления сессии/куки
            await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
            
            // Если токены дублируются в localStorage — чистим их
            localStorage.removeItem('token');
            
            // Вызываем твой родной метод из стора
            logout(); 
            
            // Перенаправляем на страницу входа
            router.replace('/auth');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            router.replace('/auth');
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#18a7b5]/10 rounded-2xl flex items-center justify-center text-[#18a7b5] shrink-0">
                    <UserIcon size={24} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight truncate">
                        Привет, {user.email.split('@')[0]}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1 truncate">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </div>
                </div>
            </div>

            {/* Правый блок: Роль + Кнопка выхода */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
                {/* Бейдж роли */}
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${currentRole.styles}`}>
                    <Shield size={14} />
                    {currentRole.label}
                </div>

                {/* Кнопка Логаута */}
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-xl transition-all active:scale-95 group"
                    title="Выйти из аккаунта"
                    type="button"
                >
                    <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
}