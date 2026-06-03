"use client"
import { useState } from "react";
import DropdownComponent from "./DropdownComponent";
import { X } from "lucide-react"; // Импортируй иконку крестика

export function TaskStatusModal({ isOpen, onClose, task, onSubmit }: any) {
    const statusOptions = ['К выполнению', 'В работе', 'Готово'];
    
    // Маппинг для отправки на сервер
    const statusMap: Record<string, string> = {
        'К выполнению': 'todo',
        'В работе': 'in_progress',
        'Готово': 'done'
    };

    // Находим начальный лейбл для дропдауна
    const initialLabel = Object.keys(statusMap).find(key => statusMap[key] === task?.status) || 'К выполнению';

    const [statusLabel, setStatusLabel] = useState(initialLabel);
    const [actualHours, setActualHours] = useState(task?.actualHours || 0);

    if (!isOpen) return null;

    return (
        <div className="min-h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl relative">
                {/* Кнопка закрытия (крестик) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="font-bold text-lg mb-4">Статус задачи</h3>
                
                <p className="text-sm text-zinc-500 mb-2">Задача: <span className="font-medium text-zinc-800">{task?.title}</span></p>

                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1 mt-4">Новый статус</label>
                <DropdownComponent 
                    options={statusOptions} 
                    onSelect={(val) => setStatusLabel(val)} 
                />

                {statusLabel === 'Готово' && (
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Потрачено часов</label>
                        <input 
                            type="number" 
                            min="0" 
                            onChange={(e) => setActualHours(Number(e.target.value))}
                            className="w-full p-2.5 border border-zinc-200 rounded-[5px] outline-none focus:border-[#18a7b5]"
                            placeholder="Например: 5"
                        />
                    </div>
                )}
                
                <div className="flex gap-2 mt-2">
                    <button onClick={onClose} className="flex-1 p-2.5 border border-zinc-200 rounded-lg hover:bg-zinc-50">Отмена</button>
                    <button 
                        onClick={() => onSubmit({ status: statusMap[statusLabel], actualHours })} 
                        className="flex-1 p-2.5 bg-[#18a7b5] text-white rounded-lg hover:bg-[#138d99]"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}