"use client";
import React, { useState } from 'react';
import { Folder, CheckSquare, Plus, Clock, Play, Check, Trash2, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { useUiStore } from '@/store/useUiStore';

// Импортируем наши новые компоненты окон
import CreateProjectModal from './modals/CreateProjectModal';
import CreateTaskModal from './modals/CreateTaskModal';

interface Project {
    id: string;
    name: string;
    description: string | null;
}

interface Task {
    id: string;
    projectId: string;
    userId: string | null; // ID исполнителя
    title: string;
    status: 'todo' | 'in_progress' | 'done'; 
    endDate: string | null;
    estimatedHours: number;
    actualHours: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'pm' | 'teamlead' | 'employee';
}

export default function Workspace({ userRole }: { userRole: string }) {
    const queryClient = useQueryClient();
    const { activeProjectId, setActiveProjectId } = useUiStore();

    // Стейты окон
    const [isProjModalOpen, setIsProjModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const isManager = userRole === 'pm' || userRole === 'teamlead';

    // 1. Загрузка всех проектов
    const { data: projects = [] } = useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await apiFetch('/api/projects/all');
            const data = await res.json();
            return data.projects || data || [];
        }
    });

    // Автовыбор первого проекта
    React.useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            setActiveProjectId(projects[0].id);
        }
    }, [projects, activeProjectId, setActiveProjectId]);

    // 2. ИСПОЛЬЗУЕМ СУЩЕСТВУЮЩИЙ РОУТ: Загружаем команду ИМЕННО ЭТОГО проекта
    const { data: projectTeam = [] } = useQuery<User[]>({
        queryKey: ['project-team', activeProjectId],
        queryFn: async () => {
            const res = await apiFetch(`/api/projects/detail/${activeProjectId}`);
            const data = await res.json();
            return data.project?.users || data.users || [];
        },
        enabled: !!activeProjectId && activeProjectId !== 'undefined'
    });

    // 3. Загрузка задач текущего проекта
    const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
        queryKey: ['tasks', activeProjectId],
        queryFn: async () => {
            const endpoint = userRole === 'employee' 
                ? `/api/tasks/project/${activeProjectId}/my` 
                : `/api/tasks/project/${activeProjectId}`;
            const res = await apiFetch(endpoint);
            const data = await res.json();
            return data.tasks || data || [];
        },
        enabled: !!activeProjectId && activeProjectId !== 'undefined',
    });

    // 4. Изменение статуса задачи (Канбан)
    const statusMutation = useMutation({
        mutationFn: async ({ taskId, nextStatus }: { taskId: string, nextStatus: Task['status'] }) => {
            await apiFetch('/api/tasks/status', {
                method: 'PATCH',
                body: { id: taskId, status: nextStatus }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', activeProjectId] });
        }
    });

    // 5. МУТАЦИЯ: Назначение человека из команды на конкретную задачу (POST /api/tasks/assign)
    const assignUserToTaskMutation = useMutation({
        mutationFn: async ({ taskId, userId }: { taskId: string, userId: string }) => {
            await apiFetch('/api/tasks/assign', {
                method: 'POST',
                body: { taskId, userId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', activeProjectId] });
        }
    });

    // 6. МУТАЦИЯ: Удаление задачи (DELETE /api/tasks/delete/:id)
    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId: string) => {
            await apiFetch(`/api/tasks/delete/${taskId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', activeProjectId] });
        }
    });

    const currentProject = projects.find(p => p.id === activeProjectId);

    return (
    <>
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 w-full">
            
            {/* ЛЕВАЯ ЧАСТЬ: Сайдбар проектов */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Folder size={16} className="text-slate-400" /> Проекты
                    </h3>
                    
                    <div className="flex items-center gap-2">
                        {userRole === 'pm' && (
                            <button 
                                onClick={() => setIsProjModalOpen(true)}
                                className="p-1 bg-[#18a7b5] text-white rounded-lg hover:bg-[#148e9a] transition-all shadow-sm"
                                title="Создать проект"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                        <span className="text-xs bg-slate-200/70 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                            {projects.length}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {projects.map((p) => {
                        const isSelected = activeProjectId === p.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => setActiveProjectId(p.id)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-white border-[#18a7b5] text-[#18a7b5] shadow-sm font-bold'
                                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100/70'
                                }`}
                            >
                                <h4 className={`text-sm ${isSelected ? 'text-[#18a7b5]' : 'text-slate-700 font-bold'}`}>{p.name}</h4>
                                {p.description && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-medium">{p.description}</p>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: Панель задач */}
            <div className="lg:col-span-8 p-6 flex flex-col h-[500px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6 shrink-0">
                    <div>
                        <span className="text-xs font-bold text-[#18a7b5] uppercase tracking-wider">Рабочая область</span>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-0.5">
                            <CheckSquare size={18} className="text-slate-700" />
                            {currentProject ? currentProject.name : 'Выбор проекта...'}
                        </h3>
                    </div>

                    {isManager && activeProjectId && (
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="flex items-center gap-1.5 bg-[#18a7b5] hover:bg-[#148e9a] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                        >
                            <Plus size={16} /> Добавить задачу
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {tasksLoading ? (
                        <div className="py-12 text-center text-slate-400 font-medium text-sm animate-pulse">Синхронизация доски...</div>
                    ) : tasks.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 font-medium text-sm">В этом проекте пока нет active задач.</div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => {
                                const isDone = task.status === 'done';
                                
                                // Находим имя текущего исполнителя из локального массива команды проекта
                                const currentWorker = Array.isArray(projectTeam) 
                                    ? projectTeam.find(u => u.id === task.userId) 
                                    : null;

                                return (
                                    <div key={task.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100/80 flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-4 transition-all group">
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide border ${
                                                    task.status === 'todo' ? 'bg-slate-100 border-slate-200 text-slate-500' :
                                                    task.status === 'in_progress' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                                                    'bg-green-50 border-green-100 text-green-500'
                                                }`}>
                                                    {task.status === 'todo' ? 'План' : task.status === 'in_progress' ? 'В работе' : 'Готово'}
                                                </span>
                                                {task.endDate && (
                                                    <span className="text-[10px] text-slate-400 font-medium">до {new Date(task.endDate).toLocaleDateString('ru-RU')}</span>
                                                )}
                                                <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-bold">
                                                    Исполнитель: {currentWorker ? (currentWorker.name || currentWorker.email.split('@')[0]) : 'Не назначен'}
                                                </span>
                                            </div>
                                            <h5 className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</h5>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                                            
                                            {/* СЕЛЕКТ ДЕЛЕГИРОВАНИЯ: Наполняется строго из участников этого проекта */}
                                            {isManager && Array.isArray(projectTeam) && (
                                                <select
                                                    value={task.userId || ''}
                                                    onChange={(e) => assignUserToTaskMutation.mutate({ taskId: task.id, userId: e.target.value })}
                                                    className="text-[11px] px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#18a7b5]"
                                                >
                                                    <option value="">Назначить...</option>
                                                    {projectTeam.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name || u.email.split('@')[0]}</option>
                                                    ))}
                                                </select>
                                            )}

                                            <div className="text-right">
                                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {task.actualHours}ч / {task.estimatedHours}ч</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                {!isDone && (
                                                    <button
                                                        onClick={() => statusMutation.mutate({ taskId: task.id, nextStatus: task.status === 'todo' ? 'in_progress' : 'done' })}
                                                        className="p-2 bg-white hover:bg-[#18a7b5] hover:text-white border border-slate-200 text-slate-400 rounded-lg transition-all"
                                                        title="Продвинуть статус"
                                                    >
                                                        {task.status === 'todo' ? <Play size={11} /> : <Check size={11} />}
                                                    </button>
                                                )}

                                                {isManager && (
                                                    <button
                                                        onClick={() => {
                                                            if(confirm('Удалить эту задачу?')) deleteTaskMutation.mutate(task.id);
                                                        }}
                                                        className="p-2 bg-white hover:bg-red-500 hover:text-white border border-slate-200 text-slate-400 rounded-lg transition-all"
                                                        title="Удалить задачу"
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <CreateProjectModal isOpen={isProjModalOpen} onClose={() => setIsProjModalOpen(false)} />
        <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} projectId={activeProjectId} />
    </>
);
}