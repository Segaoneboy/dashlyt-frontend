"use client"

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { ProjectItem } from './ProjectItem';
import { TaskItem } from './TaskItem';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { TaskModal } from '@/components/ui/Taskmodal';
import { AddMemberModal } from '@/components/ui/AddMemberModal';
import { useAuthStore } from '@/store/AuthStore';

export function WorkSpace({ selectedProjectId, onSelectProject }: { 
    selectedProjectId: string | null; 
    onSelectProject: (id: string) => void; 
}) {
    const user = useAuthStore((state) => state.user);
    const isNoteEmployee = user?.role !== 'employee';
    
    // Стейты модалок
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [memberTargetId, setMemberTargetId] = useState<string | null>(null);
    
    const queryClient = useQueryClient();

    // Запросы
    const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: () => apiFetch('/api/projects/all') });
    
    const tasksEndpoint = selectedProjectId ? (user?.role === 'employee' ? `/api/tasks/project/${selectedProjectId}/my` : `/api/tasks/project/${selectedProjectId}`) : null;
    const { data: tasks, isLoading: tLoading } = useQuery({
        queryKey: ['tasks', selectedProjectId, user?.role],
        queryFn: () => apiFetch(tasksEndpoint!),
        enabled: !!tasksEndpoint,
    });

    // Мутации
    const saveProjectMutation = useMutation({
        mutationFn: (data: any) => apiFetch(editingProject ? `/api/projects/update/` : '/api/projects/create', {
            method: editingProject ? 'PUT' : 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsProjectModalOpen(false);
            setEditingProject(null);
        }
    });

    const deleteProjectMutation = useMutation({
        mutationFn: (id: string) => apiFetch(`/api/projects/delete/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    });

    const createTaskMutation = useMutation({
        mutationFn: (newTask: any) => apiFetch('/api/tasks/create', { method: 'POST', body: JSON.stringify(newTask) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks', selectedProjectId] }); setIsTaskModalOpen(false); }
    });

    return (
        <div className="space-y-6">
            {isNoteEmployee && (
                <div className="flex justify-between">
                    <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="bg-white border-[#18a7b5] border-1 text-[#18a7b5] px-4 py-2 rounded-lg font-medium hover:bg-[#18a7b5] hover:text-white transition-colors">
                        Создать проект
                    </button>
                    
                    <button onClick={() => setIsTaskModalOpen(true)} className="bg-white border-[#18a7b5] border-1 text-[#18a7b5] px-4 py-2 rounded-lg font-medium hover:bg-[#18a7b5] hover:text-white transition-colors">
                        Создать задачу
                    </button>
                </div>
            )}
            
            {/* Модалки */}
            <ProjectModal 
                isOpen={isProjectModalOpen} 
                initialData={editingProject}
                onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }} 
                onSubmit={(data: any) => saveProjectMutation.mutate(data)} 
            />
            
            <TaskModal
                isOpen={isTaskModalOpen}
                projectId={selectedProjectId}
                onClose={() => setIsTaskModalOpen(false)}
                onSubmit={(data: any) => createTaskMutation.mutate(data)}
            />

            <AddMemberModal 
                isOpen={isMemberModalOpen}
                projectId={memberTargetId}
                onClose={() => setIsMemberModalOpen(false)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm space-y-2">
                    <h3 className="font-bold text-zinc-900 mb-4">Мои проекты</h3>
                    
                    {Array.isArray(projects) && projects.length === 0 ? (
                        <p className="text-zinc-400 text-sm">Проектов пока нет</p>
                    ) : (
                        <div className="space-y-2">
                            {(projects || []).map((p: any) => (
                                <ProjectItem 
                                    key={p.id} 
                                    project={p} 
                                    isSelected={selectedProjectId === p.id}
                                    onClick={() => onSelectProject(p.id)}
                                    onEdit={(proj: any) => { setEditingProject(proj); setIsProjectModalOpen(true); }}
                                    onDelete={(id: string) => { if(confirm("Удалить проект?")) deleteProjectMutation.mutate(p.id); }}
                                    onAddMember={(proj: any) => { setMemberTargetId(proj.id); setIsMemberModalOpen(true); }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4">Задачи проекта</h3>
                    
                    {!selectedProjectId ? (
                        <p className="text-zinc-400 text-sm">Выберите проект, чтобы увидеть задачи</p>
                    ) : tLoading ? (
                        <p className="text-zinc-400 text-sm">Загрузка задач...</p>
                    ) : !tasks || tasks.length === 0 ? (
                        <p className="text-zinc-400 text-sm">В этом проекте пока нет задач</p>
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