"use client";
import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';

import UserProfileCard from '@/components/dashboard/UserProfileCard';
import Workspace from '@/components/dashboard/Workspace';
import { ResourceChart, PersonalChart } from '@/components/dashboard/charts/ResourceChart';
import ProjectTeamBlock from '@/components/dashboard/ProjectTeamBlock'; 

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { activeProjectId } = useUiStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.replace('/auth');
    }, [user, router]);

    // Общий запрос тасок для верхней панели графиков
    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks', activeProjectId],
        queryFn: async () => {
            const endpoint = user?.role === 'employee' 
                ? `/api/tasks/project/${activeProjectId}/my` 
                : `/api/tasks/project/${activeProjectId}`;
            const response = await apiFetch(endpoint);
            const data = await response.json();
            return data.tasks || data || [];
        },
        enabled: !!user?.role && !!activeProjectId && activeProjectId !== 'undefined',
    });

    if (!user) return null; 

    return (
        <div className="min-h-screen bg-[#F4F7F8] p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Карточка профиля */}
                <UserProfileCard />
                
                {/* БЛОК АНАЛИТИКИ (Графики) */}
                {user.role === 'employee' ? (
                    <PersonalChart tasks={tasks} />
                ) : (
                    <ResourceChart tasks={tasks} />
                )}

                {/* ЕДИНАЯ ОБЪЕДИНЕННАЯ РАБОЧАЯ ОБЛАСТЬ */}
                <Workspace userRole={user.role} />
                
            </div>
        </div>
    );
}