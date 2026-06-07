"use client"

import { useState, useEffect } from 'react';
import DropdownComponent from './DropdownComponent';

export function TaskModal({ isOpen, onClose, onSubmit, projectId, initialData }: any) {
    const [form, setForm] = useState({ 
        title: '', 
        status: 'todo', 
        startDate: '', 
        endDate: '',
        estimatedHours: 0 
    });

    // Синхронизация состояния формы при открытии на редактирование или создание
    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                status: initialData.status || 'todo',
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
                estimatedHours: initialData.estimatedHours || 0
            });
        } else {
            setForm({ title: '', status: 'todo', startDate: '', endDate: '', estimatedHours: 0 });
        }
    }, [initialData, isOpen]);

    const statusOptions = ['К выполнению (To Do)', 'В работе (In Progress)', 'Готово (Done)'];
    const statusMap: Record<string, string> = {
        'К выполнению (To Do)': 'todo',
        'В работе (In Progress)': 'in_progress',
        'Готово (Done)': 'done'
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form, projectId });
    };

    if (!isOpen) return null;

    return (
        <div className="min-h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[16px] w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-zinc-900">
                    {initialData ? 'Редактирование задачи' : 'Создать задачу'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Название */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                            Название задачи
                        </label>
                        <input 
                            required 
                            value={form.title}
                            className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                            onChange={e => setForm(prev => ({...prev, title: e.target.value}))} 
                        />
                    </div>

                    {/* Статус */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                            Статус
                        </label>
                        <DropdownComponent 
                            options={statusOptions} 
                            onSelect={(val) => {
                                setForm(prev => ({
                                    ...prev, 
                                    status: statusMap[val] || 'todo'
                                }));
                            }} 
                        />
                    </div>

                    {/* Даты */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Дата старта</label>
                            <input 
                                type="date" 
                                required 
                                value={form.startDate}
                                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                onChange={e => setForm(prev => ({...prev, startDate: e.target.value}))} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Дата окончания</label>
                            <input 
                                type="date" 
                                value={form.endDate}
                                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                                onChange={e => setForm(prev => ({...prev, endDate: e.target.value}))} 
                            />
                        </div>
                    </div>

                    {/* Оценка времени */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                            Оценка (часов)
                        </label>
                        <input 
                            type="number" 
                            min="0" 
                            value={form.estimatedHours === 0 ? '' : form.estimatedHours} 
                            placeholder="0" 
                            className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#18a7b5] outline-none" 
                            onChange={e => {
                                const val = e.target.value;
                                setForm(prev => ({
                                    ...prev, 
                                    estimatedHours: val === '' ? 0 : parseInt(val, 10) || 0
                                }));
                            }} 
                            onBlur={e => {
                                // если пользователь кликнул мимо и ничего не ввел, возвращаем в стейт 0
                                if (e.target.value === '') {
                                    setForm(prev => ({ ...prev, estimatedHours: 0 }));
                                }
                            }}
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 p-2.5 border border-zinc-200 rounded-lg text-zinc-600 font-medium hover:bg-zinc-50"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg font-medium hover:bg-[#138d99]"
                        >
                            {initialData ? 'Сохранить изменения' : 'Создать задачу'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}