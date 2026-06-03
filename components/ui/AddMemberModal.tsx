"use client"

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { X } from 'lucide-react';

export function AddMemberModal({ isOpen, onClose, targetId, targetType }: any) {
    const queryClient = useQueryClient();
    const [email, setEmail] = useState('');

    // Сбрасываем инпут при открытии/закрытии модалки
    useEffect(() => {
        if (!isOpen) setEmail('');
    }, [isOpen]);

    const assignMutation = useMutation({
        mutationFn: (userEmail: string) => {
            const url = targetType === 'project' 
                ? `/api/projects/assign` 
                : `/api/tasks/assign`;
            
            // Динамически формируем тело запроса в зависимости от типа
            const payload = targetType === 'task' 
                ? { taskId: targetId, email: userEmail }
                : { projectId: targetId, email: userEmail };

            return apiFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        },
        onSuccess: () => {
            // Обновляем нужный кеш (проектов или задач)
            queryClient.invalidateQueries({ queryKey: [targetType === 'project' ? 'projects' : 'tasks'] });
            onClose();
        },
        onError: (err) => {
            console.error("Ошибка при назначении:", err);
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return alert("Введите email сотрудника");
        assignMutation.mutate(email);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl relative">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
                >
                    <X size={20} />
                </button>

                <h3 className="font-bold text-lg mb-2">
                    {targetType === 'project' ? 'Добавить участника в проект' : 'Назначить исполнителя'}
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                    Введите email сотрудника для привязки к {targetType === 'project' ? 'проекту' : 'задаче'}.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                            Email сотрудника
                        </label>
                        <input 
                            type="email"
                            required
                            placeholder="example@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none text-sm" 
                        />
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="flex-1 p-2.5 border rounded-lg text-sm font-medium hover:bg-zinc-50"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            disabled={assignMutation.isPending}
                            className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg text-sm font-medium hover:bg-[#138d99] disabled:opacity-50"
                        >
                            {assignMutation.isPending ? 'Сохранение...' : 'Назначить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}