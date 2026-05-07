"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import ResourceCharts from '@/components/ResourceCharts'; 

const data = [
    { name: 'Нед 1', tasks: 400, load: 240 },
    { name: 'Нед 2', tasks: 300, load: 139 },
    { name: 'Нед 3', tasks: 200, load: 980 },
    { name: 'Нед 4', tasks: 278, load: 390 },
    { name: 'Нед 5', tasks: 189, load: 480 },
    { name: 'Нед 6', tasks: 239, load: 380 },
];

const AnalyticsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            {/* Шапка */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#18a7b5]">DashLyt Analytics</h1>
                    <p className="text-[#585858]">Мониторинг ресурсов и метрик в реальном времени</p>
                </div>
                <button className="bg-[#18a7b5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#148d99] transition-all">
                    Обновить данные
                </button>
            </div>

            <ResourceCharts />

            {/* Нижние карточки метрик */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                    { label: 'Всего задач', value: '1,284', change: '+12%' },
                    { label: 'Активных ресурсов', value: '42', change: 'В норме' },
                    { label: 'Риск дедлайна', value: '3 проекта', change: 'Внимание', color: 'text-red-500' }
                ].map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-sm">{card.label}</p>
                        <div className="flex justify-between items-end mt-2">
                            <p className="text-2xl font-bold text-[#585858]">{card.value}</p>
                            <p className={`text-xs font-bold ${card.color || 'text-[#18a7b5]'}`}>{card.change}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPage;