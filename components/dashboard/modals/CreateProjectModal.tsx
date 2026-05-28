"use client";
import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Loader2, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    // Синхронизируем обязательное поле startDate (ставим дефолтом сегодняшний день)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const createProjectMutation = useMutation({
        mutationFn: async (newProject: { 
            name: string; 
            description: string; 
            startDate: string; 
            endDate: string | null; 
        }) => {
            const res = await apiFetch('/api/projects/create', {
                method: 'POST',
                body: newProject
            });
            if (!res.ok) throw new Error('Не удалось создать проект');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setName('');
            setDescription('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setEndDate('');
            onClose();
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Проверяем валидацию точно так же, как на сервере
        if (!name.trim() || !startDate) return;

        createProjectMutation.mutate({ 
            name, 
            description,
            startDate, // Передаем на бэк, там отработает new Date(startDate)
            endDate: endDate || null // Если пусто — шлем null
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            
            <div className="bg-white rounded-3xl p-6 w-full max-w-md relative z-10 border border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all" type="button">
                    <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 bg-[#18a7b5]/10 rounded-xl text-[#18a7b5]">
                        <FolderPlus size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Новый проект</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Название проекта *</label>
                        <input
                            type="text"
                            required
                            placeholder="Например: AI-платформа Cllario"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all text-[#585858]"
                        />
                    </div>

                    {/* БЛОК ДАТ: Старт и дедлайн проекта */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Дата начала *</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all text-[#585858]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Дата окончания</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all text-[#585858]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Описание</label>
                        <textarea
                            placeholder="Стек проекта, основные цели и задачи спринта..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#18a7b5] focus:ring-2 focus:ring-[#18a7b5]/10 outline-none text-sm font-medium transition-all text-[#585858] resize-none"
                        />
                    </div>

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
                            disabled={createProjectMutation.isPending || !name.trim() || !startDate}
                            className="w-1/2 py-3 bg-[#18a7b5] hover:bg-[#148e9a] text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {createProjectMutation.isPending ? (
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