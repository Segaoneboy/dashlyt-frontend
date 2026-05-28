"use client";
import React, { useState } from 'react';
import { Users, UserPlus, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { useUiStore } from '@/store/useUiStore';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'pm' | 'teamlead' | 'employee';
}

interface ProjectTeamBlockProps {
    userRole: string;
}

export default function ProjectTeamBlock({ userRole }: ProjectTeamBlockProps) {
    const queryClient = useQueryClient();
    const { activeProjectId } = useUiStore();
    const [selectedUserId, setSelectedUserId] = useState('');

    const isManager = userRole === 'pm' || userRole === 'teamlead';

    // 1. Получаем список ВСЕХ пользователей системы (для выпадающего списка PM-а)
    const { data: allUsers = [] } = useQuery<User[]>({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await apiFetch('/api/users/all'); // Замени эндпоинт, если он называется иначе
            const data = await res.json();
            return data.users || data || [];
        },
        enabled: isManager && !!activeProjectId
    });

    // 2. Получаем список людей, закрепленных ИМЕННО за текущим активным проектом
    const { data: projectTeam = [], isLoading: isTeamLoading } = useQuery<User[]>({
        queryKey: ['project-team', activeProjectId],
        queryFn: async () => {
            const res = await apiFetch(`/api/projects/detail/${activeProjectId}`);
            const data = await res.json();
            // Предполагаем, что бэк отдает массив участников внутри объекта проекта (например, data.project.users или data.users)
            return data.project?.users || data.users || [];
        },
        enabled: !!activeProjectId && activeProjectId !== 'undefined'
    });

    // 3. Мутация: Добавление человека в проект (POST /api/projects/assign)
    const assignUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await apiFetch('/api/projects/assign', {
                method: 'POST',
                body: { projectId: activeProjectId, userId }
            });
            if (!res.ok) throw new Error();
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-team', activeProjectId] });
            setSelectedUserId(''); // Сбрасываем выбор
        }
    });

    // 4. Мутация: Удаление человека из проекта (DELETE /api/projects/remove)
    const removeUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await apiFetch('/api/projects/remove', {
                method: 'DELETE',
                body: { projectId: activeProjectId, userId }
            });
            if (!res.ok) throw new Error();
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-team', activeProjectId] });
        }
    });

    if (!activeProjectId || activeProjectId === 'undefined') return null;

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;
        assignUserMutation.mutate(selectedUserId);
    };

    // Фильтруем список всех пользователей, чтобы не предлагать тех, кто уже в проекте
    const availableUsers = allUsers.filter(
        (user) => !projectTeam.some((teamMember) => teamMember.id === user.id)
    );

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full animate-in fade-in duration-200">
            
            {/* Левая часть: Статистика + Аватарки */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="p-2.5 bg-[#18a7b5]/10 rounded-2xl text-[#18a7b5]">
                        <Users size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Команда проекта</h4>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">
                            {isTeamLoading ? 'Загрузка...' : `Участников: ${projectTeam.length}`}
                        </p>
                    </div>
                </div>

                {/* Список участников в ряд */}
                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-4 sm:border-l border-slate-100">
                    {projectTeam.length === 0 && !isTeamLoading ? (
                        <span className="text-xs text-slate-400 font-medium">Никто не привязан к проекту</span>
                    ) : (
                        projectTeam.map((member) => (
                            <div 
                                key={member.id} 
                                className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-bold text-slate-600 group relative transition-all hover:bg-slate-100/70"
                            >
                                <span className="truncate max-w-[120px]">{member.name || member.email.split('@')[0]}</span>
                                <span className="text-[9px] px-1 py-0.5 bg-slate-200 text-slate-500 rounded uppercase text-center font-black scale-90">
                                    {member.role === 'teamlead' ? 'TL' : member.role === 'pm' ? 'PM' : 'DEV'}
                                </span>
                                
                                {/* Кнопка исключения из проекта (доступна только PM) */}
                                {userRole === 'pm' && member.role !== 'pm' && (
                                    <button
                                        onClick={() => {
                                            if (confirm(`Исключить сотрудника из проекта?`)) {
                                                removeUserMutation.mutate(member.id);
                                            }
                                        }}
                                        className="text-slate-400 hover:text-red-500 rounded-md p-0.5 transition-colors ml-0.5"
                                        type="button"
                                        title="Исключить из проекта"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Правая часть: Форма быстрого добавления (видят только менеджеры) */}
            {userRole === 'pm' && availableUsers.length > 0 && (
                <form onSubmit={handleAddUser} className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full md:w-56 px-3 py-2 text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-[#18a7b5] focus:bg-white transition-all"
                    >
                        <option value="">Выбрать сотрудника...</option>
                        {availableUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name || u.email.split('@')[0]} ({u.role})
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={!selectedUserId || assignUserMutation.isPending}
                        className="p-2 bg-[#18a7b5] hover:bg-[#148e9a] text-white rounded-xl shadow-sm transition-all disabled:opacity-40 active:scale-95 shrink-0 flex items-center justify-center"
                        title="Добавить в проект"
                    >
                        {assignUserMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <UserPlus size={16} />
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}