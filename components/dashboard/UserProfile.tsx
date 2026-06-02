"use client"

import { useAuthStore } from '@/store/AuthStore';
import { User, Mail, Shield, UserCircle } from 'lucide-react';

export default function UserProfile() {
    const { user } = useAuthStore();

    if (!user) return <div className="text-zinc-500">Данные не найдены</div>;

    const info = [
        { label: 'Имя', value: user.firstName, icon: UserCircle },
        { label: 'Фамилия', value: user.lastName, icon: User },
        { label: 'Email', value: user.email, icon: Mail },
        { label: 'Роль', value: user.role, icon: Shield },
    ];

    return (
        <div className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm w-full">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">Информация о профиле</h2>
            
            {/* Горизонтальный контейнер */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {info.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <div className="p-2 bg-[#18a7b5]/10 rounded-xl">
                            <item.icon size={20} className="text-[#18a7b5]" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                                {item.label}
                            </p>
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                                {item.value || '—'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}