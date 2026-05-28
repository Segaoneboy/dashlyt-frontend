"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, Target, Users, AlertCircle, CheckCircle2, CalendarDays, Activity, Flame } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { useUiStore } from '@/store/useUiStore';

interface Task {
    id: string;
    projectId: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done'; 
    endDate: string | null;
    estimatedHours: number;
    actualHours: number;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'pm' | 'teamlead' | 'employee';
}

// Возвращаем пропсы в исходное состояние — только задачи!
interface ResourceChartProps {
    tasks: Task[];
}

export function ResourceChart({ tasks = [] }: ResourceChartProps) {
    const { activeProjectId } = useUiStore();

    // График САМ делает точечный запрос за командой проекта, никого не напрягая снаружи
    const { data: projectTeam = [] } = useQuery<TeamMember[]>({
        queryKey: ['project-team', activeProjectId],
        queryFn: async () => {
            if (!activeProjectId || activeProjectId === 'undefined') return [];
            const response = await apiFetch(`/api/projects/detail/${activeProjectId}`);
            const data = await response.json();
            return data.project?.users || data.users || [];
        },
        enabled: !!activeProjectId && activeProjectId !== 'undefined',
    });

    // 1. Расчет общих часов
    const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    // 2. Расчет базового распределения задач
    const totalTasksCount = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done');
    const inProgressTasksCount = tasks.filter(t => t.status === 'in_progress').length;
    const todoTasksCount = tasks.filter(t => t.status === 'todo').length;

    // % выполнения общего пула
    const completionRate = totalTasksCount > 0 
        ? Math.round((doneTasks.length / totalTasksCount) * 100) 
        : 0;

    // 3. СТРОГИЙ расчет "Вовремя и в бюджете"
    const now = new Date();
    
    const problematicTasks = tasks.filter(t => {
        // Проверка 1: Перерасход часов (факт превысил план)
        const isOvertime = (t.actualHours || 0) > (t.estimatedHours || 0);
        
        // Проверка 2: Срыв дедлайна по календарю (если задача не сделана и дата прошла)
        const isOverdue = t.status !== 'done' && t.endDate && new Date(t.endDate) < now;

        return isOvertime || isOverdue;
    });

    const problematicCount = problematicTasks.length;
    
    // Процент абсолютно успешных задач (без перерасходов и без просрочек)
    const onTimeRate = totalTasksCount > 0 
        ? Math.max(0, Math.round(((totalTasksCount - problematicCount) / totalTasksCount) * 100))
        : 100;

    const chartData = [
        {
            name: 'Общие часы',
            'Запланировано': totalEstimated,
            'Отработано': totalActual
        }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all space-y-6">
            
            {/* Хедер */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#18a7b5]" />
                    <h3 className="text-base font-bold text-slate-800">Аналитика и ресурсы проекта</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-xl text-xs font-bold text-slate-600">
                    <Users size={14} className="text-[#18a7b5]" />
                    <span>Команда: {projectTeam.length} чел.</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ЛЕВАЯ КОЛОНКА */}
                <div className="lg:col-span-4 space-y-5">
                    
                    {/* Часы */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3.5">
                        <div>
                            <div className="flex items-center justify-between text-slate-500 mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-wider">План (бюджет)</span>
                                <Target size={14} className="text-amber-500" />
                            </div>
                            <p className="text-xl font-black text-slate-700">{totalEstimated} <span className="text-xs font-medium text-slate-400">ч</span></p>
                        </div>
                        
                        <hr className="hidden lg:block border-slate-200/60" />
                        
                        <div>
                            <div className="flex items-center justify-between text-slate-500 mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-wider">Факт (отработано)</span>
                                <Clock size={14} className="text-[#18a7b5]" />
                            </div>
                            <p className={`text-xl font-black ${totalActual > totalEstimated ? 'text-rose-500' : 'text-[#18a7b5]'}`}>
                                {totalActual} <span className="text-xs font-medium text-slate-400">ч</span>
                            </p>
                        </div>
                    </div>

                    {/* Метрики эффективности */}
                    <div className="bg-slate-50/40 border border-slate-100 p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Эффективность команды</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {/* Выполнение */}
                            <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-1 text-slate-400 mb-1">
                                    <CheckCircle2 size={12} className="text-green-500" />
                                    <span className="text-[10px] font-bold">Выполнено</span>
                                </div>
                                <p className="text-lg font-black text-slate-700">{completionRate}%</p>
                                <span className="text-[9px] text-slate-400 font-medium">{doneTasks.length} из {totalTasksCount} задач</span>
                            </div>

                            {/* Успешность (В дедлайне + В бюджете) */}
                            <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-1 text-slate-400 mb-1">
                                    {onTimeRate < 100 ? (
                                        <Flame size={12} className="text-rose-500 animate-pulse" />
                                    ) : (
                                        <CalendarDays size={12} className="text-[#18a7b5]" />
                                    )}
                                    <span className="text-[10px] font-bold">В лимитах</span>
                                </div>
                                <p className={`text-lg font-black ${onTimeRate < 100 ? 'text-rose-500' : 'text-slate-700'}`}>
                                    {onTimeRate}%
                                </p>
                                <span className={`text-[9px] font-bold ${problematicCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {problematicCount > 0 ? `${problematicCount} с нарушениями` : 'Все под контролем'}
                                </span>
                            </div>
                        </div>

                        {/* Распределение */}
                        <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-slate-500 bg-white/60 p-2 rounded-xl border border-slate-100">
                            <span className="flex items-center gap-1"><Activity size={11} className="text-blue-500"/> В работе: {inProgressTasksCount}</span>
                            <span className="text-slate-300">|</span>
                            <span>В плане: {todoTasksCount}</span>
                        </div>
                    </div>

                    {/* Состав команды */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">Состав команды</span>
                        {projectTeam.length === 0 ? (
                            <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-100 text-amber-700 rounded-2xl text-xs font-medium">
                                <AlertCircle size={16} className="shrink-0 text-amber-500" />
                                <span>В команде проекта пока нет сотрудников.</span>
                            </div>
                        ) : (
                            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                {projectTeam.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 text-xs">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-700 truncate">{member.name || member.email.split('@')[0]}</p>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                                            {member.role === 'teamlead' ? 'TL' : member.role === 'pm' ? 'PM' : 'DEV'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА (График) */}
                <div className="lg:col-span-8 h-[340px] lg:h-full w-full min-w-0 bg-slate-50/30 rounded-2xl border border-slate-100 p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Распределение бюджета времени</span>
                    {tasks.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm font-medium gap-2">
                            <span>Нет активных задач</span>
                        </div>
                    ) : (
                        <div className="h-full w-full min-h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontStyle="bold" tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    <Bar dataKey="Запланировано" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={55} />
                                    <Bar dataKey="Отработано" fill="#18a7b5" radius={[6, 6, 0, 0]} barSize={55} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export function PersonalChart({ tasks }: { tasks: Task[] }) { return null; }