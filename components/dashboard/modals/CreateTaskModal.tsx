"use client";
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Loader2, AlignLeft } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | undefined;
}

export default function CreateTaskModal({ isOpen, onClose, projectId }: CreateTaskModalProps) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('8');
    
    // Синхронизируем обязательное поле startDate с бэкендом (дефолт — сегодня)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');

    // Закрытие окна по кнопке Esc
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: { 
            projectId: string; 
            title: string; 
            description: string | null;
            estimatedHours: number; 
            startDate: string;
            endDate: string | null; 
        }) => {
            const res = await apiFetch('/api/tasks/create', {
                method: 'POST',
                body: newTask
            });
            if (!res.ok) throw new Error('Ошибка создания задачи');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            // Чистим форму
            setTitle('');
            setDescription('');
            setEstimatedHours('8');
            setStartDate(new Date().toISOString().split('T')[0]);
            setEndDate('');
            onClose();
        }
    });

    if (!isOpen || !projectId) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !startDate) return;

        createTaskMutation.mutate({
            projectId,
            title,
            description: description.trim() || null,
            estimatedHours: Number(estimatedHours) || 0,
            startDate, // Улетает строка 'YYYY-MM-DD', бэк распарсит через new Date(startDate)
            endDate: endDate ? new Date(endDate).toISOString() : null
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Оверлей фона */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose} />
            
            {/* Контентное окно */}
            <div className="bg-white rounded-3xl p-6 w-full max-w-md relative z-10 border border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all" type="button">
                    <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 bg-[#18a7b5]/10 rounded-xl text-[#18a7b5]">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Новая задача</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Название задачи */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Что нужно сделать? *</label>
                        <input
                            type="text"
                            required
                            placeholder="Например: Покрыть тестами эндпоинты аутентификации"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-[#585858] border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all"
                        />
                    </div>

                    {/* Описание задачи */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Описание / Спецификация</label>
                        <textarea
                            placeholder="Добавьте детали задачи, ссылки на документацию или требования..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl text-[#585858] border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all resize-none"
                        />
                    </div>

                    {/* Временная оценка */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Оценка времени (часов)</label>
                        <input
                            type="number"
                            required
                            min={1}
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-[#585858] border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all"
                        />
                    </div>

                    {/* БЛОК СРОКОВ: Дата старта (обязательно) и Дедлайн */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Дата старта *</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-[#585858] border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Дедлайн</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-[#585858] border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-sm font-bold rounded-xl transition-all"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={createTaskMutation.isPending || !title.trim() || !startDate}
                            className="w-1/2 py-3 bg-[#18a7b5] hover:bg-[#148e9a] text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {createTaskMutation.isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Создание...</span>
                                </>
                            ) : (
                                'Создать'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}