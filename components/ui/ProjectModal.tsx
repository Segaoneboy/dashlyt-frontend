"use client"

import { useState, useEffect } from 'react';
import DropdownComponent from './DropdownComponent';

export function ProjectModal({ isOpen, onClose, onSubmit, initialData }: any) {
    const [form, setForm] = useState({ 
        name: '', description: '', status: 'active', startDate: '', endDate: '' 
    });

    // Если initialData меняется (например, открыли другой проект), обновляем форму
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                description: initialData.description || '',
                status: initialData.status || 'active',
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : ''
            });
        }
        else setForm({ name: '', description: '', status: 'active', startDate: '', endDate: '' });
    }, [initialData, isOpen]);

    const statusOptions = ['Активен (Active)', 'Завершен (Completed)', 'На удержании (On Hold)'];
    const statusMap: Record<string, string> = {
        'Активен (Active)': 'active',
        'Завершен (Completed)': 'completed',
        'На удержании (On Hold)': 'on_hold'
    };

    if (!isOpen) return null;

    return (
        <div className="min-h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[16px] w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-zinc-900">
                    {initialData ? 'Редактирование проекта' : 'Создать проект'}
                </h2>
                
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Название</label>
                        <input required value={form.name || ''} className="w-full p-2.5 border border-zinc-200 rounded-lg" 
                               onChange={e => setForm(prev => ({...prev, name: e.target.value}))} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Описание</label>
                        <textarea value={form.description || ''} className="w-full p-2.5 border border-zinc-200 rounded-lg" 
                                  onChange={e => setForm(prev => ({...prev, description: e.target.value}))} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Статус</label>
                        <DropdownComponent options={statusOptions} onSelect={(val) => setForm(prev => ({...prev, status: statusMap[val]}))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" required value={form.startDate} className="p-2.5 border border-zinc-200 rounded-lg" 
                               onChange={e => setForm(prev => ({...prev, startDate: e.target.value}))} />
                        <input type="date" value={form.endDate} className="p-2.5 border border-zinc-200 rounded-lg" 
                               onChange={e => setForm(prev => ({...prev, endDate: e.target.value}))} />
                    </div>
                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={onClose} className="flex-1 p-2.5 border rounded-lg">Отмена</button>
                        <button type="submit" className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}