"use client"

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { BarChartComponent } from '@/components/ui/BarChart';
import { PieChartComponent } from '@/components/ui/PieChart';
import { Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProjectAnalytic({ tasks = [], project }: { tasks: any[], project: any }) {
    
    // делаем запрос к бэкенду для получения количества участников проекта
    const { data: usersData } = useQuery({
        queryKey: ['project-users', project.id],
        queryFn: () => apiFetch(`/api/projects/users/${project.id}`),
        enabled: !!project.id,
    });
    console.log(usersData)

    const teamCount = usersData?.count || 0;

    // расчет метрик времени (План / Факт)
    const estimatedTotal = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const actualTotal = tasks.reduce((acc, t) => acc + (t.actualHours || 0), 0);

    // процент выполнения временного плана (сколько заложено сколько потрачено)
    const timeBurnPercentage = estimatedTotal > 0 
        ? Math.min(Math.round((actualTotal / estimatedTotal) * 180), 100)
        : 0;

    // расчет статусов задач для круговой диаграммы
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, { todo: 0, in_progress: 0, done: 0 } as any);

    const totalTasks = tasks.length;
    const doneTasksPercentage = totalTasks > 0 
        ? Math.round((statusCounts.done / totalTasks) * 100) 
        : 0;

    // данные для столбчатой диаграммы
    const barData = {
        labels: ['Потрачено часов'],
        datasets: [
            {
                label: 'План',
                data: [estimatedTotal],
                backgroundColor: '#adc0d9', 
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Факт',
                data: [actualTotal],
                backgroundColor: actualTotal > estimatedTotal ? '#f87171' : '#18a7b5', 
                borderRadius: 8,
                borderSkipped: false,
            }
        ]
    };

    // данные для круговой диаграммы 
    const pieData = {
        labels: ['К выполнению', 'В работе', 'Готово'],
        datasets: [{
            data: [statusCounts.todo, statusCounts.in_progress, statusCounts.done],
            backgroundColor: ['#adc0d9', '#fbbf24', '#18a7b5'], 
            borderWidth: 2,
            borderColor: '#ffffff',
        }]
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#18a7b5]">
                        Статистика проекта
                    </span>
                    <h2 className="text-xl font-bold text-zinc-900 mt-0.5">{project.name}</h2>
                    {project.description && (
                        <p className="text-sm text-zinc-500 mt-1 max-w-xl line-clamp-2">{project.description}</p>
                    )}
                </div>
                
                {/* Счетчик людей в проекте */}
                <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 self-start sm:self-center">
                    <div className="p-2 bg-[#18a7b5]/10 text-[#18a7b5] rounded-lg">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Команда</div>
                        <div className="text-sm font-bold text-zinc-800">{teamCount} чел.</div>
                    </div>
                </div>
            </div>

            {/* МЕТРИКИ КАРТОЧКИ (KPI) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Карточка 1: Прогресс по таскам */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-500">Выполнение задач</span>
                        <CheckCircle2 size={16} className="text-[#18a7b5]" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">{doneTasksPercentage}%</div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                        Завершено: {statusCounts.done} из {totalTasks}
                    </div>
                </div>

                {/* Карточка 2: Использование бюджета времени */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-500">Освоение плана времени</span>
                        <Clock size={16} className="text-[#18a7b5]" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">{timeBurnPercentage}%</div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${actualTotal > estimatedTotal ? 'bg-red-500' : 'bg-[#18a7b5]'}`}
                            style={{ width: `${timeBurnPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Карточка 3: Статус Дедлайна */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-500">Сроки проекта</span>
                        <AlertCircle size={16} className="text-amber-500" />
                    </div>
                    <div className="text-sm font-bold text-zinc-800">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Без дедлайна'}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-2">
                        Старт: {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}
                    </div>
                </div>
            </div>

            {/* БЛОК ДИАГРАММ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                {/* Левый график: Время */}
                <div className="border border-zinc-100 p-4 rounded-xl hover:shadow-sm transition-all">
                    <h4 className="font-bold text-sm text-zinc-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-[#18a7b5] rounded-full inline-block"></span>
                        Временной баланс (План / Факт)
                    </h4>
                    <div className="h-[220px] flex items-center justify-center">
                        <BarChartComponent data={barData} />
                    </div>
                </div>

                {/* Правый график: Статусы задач */}
                <div className="border border-zinc-100 p-4 rounded-xl hover:shadow-sm transition-all">
                    <h4 className="font-bold text-sm text-zinc-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-amber-400 rounded-full inline-block"></span>
                        Распределение статусов задач
                    </h4>
                    <div className="h-[220px] flex items-center justify-center">
                        <PieChartComponent data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    );
}