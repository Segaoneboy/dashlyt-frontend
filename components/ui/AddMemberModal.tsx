"use client"

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';

export function AddMemberModal({ isOpen, onClose, projectId }: { isOpen: boolean, onClose: () => void, projectId: string | null }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!email) return;
        setLoading(true);

        try {
            console.log({email, projectId})
            await apiFetch('/api/projects/assign', { 
                method: 'POST',
                body: JSON.stringify({ email, projectId })
            });
            toast.success('Сотрудник добавлен!');
            onClose();
            setEmail('');
        } catch (error) {
            toast.error('Не удалось найти пользователя или он уже в проекте');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="min-h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[16px] w-96 shadow-xl">
                <h2 className="text-lg font-bold mb-4 text-zinc-900">Добавить сотрудника</h2>
                <input 
                    type="email"
                    placeholder="Введите email сотрудника"
                    className="w-full p-2.5 border border-zinc-200 rounded-lg mb-4 focus:ring-2 focus:ring-[#18a7b5] outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex gap-2">
                    <button 
                        onClick={onClose} 
                        className="flex-1 p-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={handleAdd} 
                        disabled={loading}
                        className="flex-1 p-2 bg-[#18a7b5] text-white rounded-lg hover:bg-[#138d99] disabled:bg-zinc-300"
                    >
                        {loading ? 'Добавление...' : 'Добавить'}
                    </button>
                </div>
            </div>
        </div>
    );
}