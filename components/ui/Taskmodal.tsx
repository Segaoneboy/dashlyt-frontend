"use client"

import { useState } from 'react';

export function TaskModal({ isOpen, onClose, onSubmit, projectId }: any) {
    const [form, setForm] = useState({ 
        title: '', 
        status: 'todo', 
        startDate: '', 
        endDate: '',
        estimatedHours: 0 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form, projectId });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[16px] w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-zinc-900">Создать задачу</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Название */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Название задачи</label>
                        <input required className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                               onChange={e => setForm({...form, title: e.target.value})} />
                    </div>

                    {/* Статус */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Статус</label>
                        <select className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                onChange={e => setForm({...form, status: e.target.value})}>
                            <option value="todo">К выполнению (To Do)</option>
                            <option value="in_progress">В работе (In Progress)</option>
                            <option value="done">Готово (Done)</option>
                        </select>
                    </div>

                    {/* Даты */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Дата старта</label>
                            <input type="date" required className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                   onChange={e => setForm({...form, startDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Дата окончания</label>
                            <input type="date" className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                   onChange={e => setForm({...form, endDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Оценка времени */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Оценка (часов)</label>
                        <input type="number" min="0" className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                               onChange={e => setForm({...form, estimatedHours: parseInt(e.target.value) || 0})} />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={onClose} className="flex-1 p-2.5 border border-zinc-200 rounded-lg text-zinc-600 font-medium hover:bg-zinc-50">Отмена</button>
                        <button type="submit" className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg font-medium hover:bg-[#138d99]">Создать задачу</button>
                    </div>
                </form>
            </div>
        </div>
    );
}