"use client"

import { useState } from 'react';

export function ProjectModal({ isOpen, onClose, onSubmit }: any) {
    if (!isOpen) return null;

    const [form, setForm] = useState({ 
        name: '', 
        description: '', 
        status: 'active', 
        startDate: '', 
        endDate: '' 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed min-h-screen inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[16px] w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-zinc-900">Создать новый проект</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Название */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Название</label>
                        <input required className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                               onChange={e => setForm({...form, name: e.target.value})} />
                    </div>

                    {/* Описание */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Описание</label>
                        <textarea className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                  onChange={e => setForm({...form, description: e.target.value})} />
                    </div>

                    {/* Статус */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Статус</label>
                        <select className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                onChange={e => setForm({...form, status: e.target.value})}>
                            <option value="active">Активен (Active)</option>
                            <option value="completed">Завершен (Completed)</option>
                            <option value="on_hold">На удержании (On Hold)</option>
                        </select>
                    </div>

                    {/* Даты */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Начало</label>
                            <input type="date" required className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                   onChange={e => setForm({...form, startDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Конец</label>
                            <input type="date" className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                   onChange={e => setForm({...form, endDate: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={onClose} className="flex-1 p-2.5 border border-zinc-200 rounded-lg text-zinc-600 font-medium hover:bg-zinc-50">Отмена</button>
                        <button type="submit" className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg font-medium hover:bg-[#138d99]">Создать проект</button>
                    </div>
                </form>
            </div>
        </div>
    );
}