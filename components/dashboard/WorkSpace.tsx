"use client"

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { ProjectItem } from './ProjectItem';
import { TaskItem } from './TaskItem';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { TaskModal } from '@/components/ui/Taskmodal';
import { useAuthStore } from '@/store/AuthStore';

export function WorkSpace({ selectedProjectId, onSelectProject }: { 
    selectedProjectId: string | null; 
    onSelectProject: (id: string) => void; 
}) {
    const user = useAuthStore((state) => state.user);
    const isNoteEmployee = user?.role !== 'employee';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    const queryClient = useQueryClient();

    // Запрос списка проектов
    const { data: projects } = useQuery({
        queryKey: ['projects'],
        queryFn: () => apiFetch('/api/projects/all'),
    });

    // Динамический эндпоинт в зависимости от роли
    const tasksEndpoint = selectedProjectId
        ? (user?.role === 'employee'
            ? `/api/tasks/project/${selectedProjectId}/my`
            : `/api/tasks/project/${selectedProjectId}`)
        : null;

    // Запрос задач
    const { data: tasks, isLoading: tLoading } = useQuery({
        queryKey: ['tasks', selectedProjectId, user?.role],
        queryFn: () => apiFetch(tasksEndpoint!),
        enabled: !!tasksEndpoint,
    });

    const safeProjects = Array.isArray(projects) ? projects : [];

    // Мутации
    const createMutation = useMutation({
        mutationFn: (newProject: any) => apiFetch('/api/projects/create', {
            method: 'POST',
            body: JSON.stringify(newProject),
            headers: { 'Content-Type': 'application/json' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsModalOpen(false);
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: (newTask: any) => apiFetch('/api/tasks/create', { 
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: { 'Content-Type': 'application/json' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', selectedProjectId] });
            setIsTaskModalOpen(false);
        }
    });

    return (
        <div className="space-y-6">
            {isNoteEmployee && (
                <div className="flex justify-between">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white border-[#18a7b5] border-1 text-[#18a7b5] px-4 py-2 rounded-lg font-medium hover:bg-[#18a7b5] hover:text-white transition-colors"
                    >
                        Создать проект
                    </button>

                    <ProjectModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSubmit={(data: any) => createMutation.mutate(data)} 
                    />

                    <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-white border-[#18a7b5] border-1 text-[#18a7b5] px-4 py-2 rounded-lg font-medium hover:bg-[#18a7b5] hover:text-white transition-colors"
                    >
                        Создать задачу
                    </button>
                    <TaskModal
                        isOpen={isTaskModalOpen}
                        projectId={selectedProjectId}
                        onClose={() => setIsTaskModalOpen(false)}
                        onSubmit={(data: any) => createTaskMutation.mutate(data)}
                    />
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Блок проектов */}
                <div className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4">Мои проекты</h3>
                    {safeProjects.length === 0 ? (
                        <p className="text-zinc-400 text-sm">Проектов пока нет</p>
                    ) : (
                        <div className="space-y-2">
                            {safeProjects.map((p: any) => (
                                <ProjectItem 
                                    key={p.id} 
                                    project={p} 
                                    isSelected={selectedProjectId === p.id}
                                    onClick={() => onSelectProject(p.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Блок задач */}
                <div key={selectedProjectId} className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4">Задачи проекта</h3>
                    {!selectedProjectId ? (
                        <p className="text-zinc-400 text-sm">Выберите проект</p>
                    ) : tLoading ? (
                        <p className="text-zinc-400 text-sm">Загрузка задач...</p>
                    ) : !tasks || tasks.length === 0 ? (
                        <p className="text-zinc-400 text-sm">В проекте нет задач</p>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((t: any) => (
                                <TaskItem key={t.id} task={t} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}