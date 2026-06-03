"use client"

import { ProjectAnalytic } from "@/components/dashboard/ProjectAnalytic";
import UserProfile from "@/components/dashboard/UserProfile";
import { WorkSpace } from "@/components/dashboard/WorkSpace";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


export default function DashboardPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => apiFetch('/api/projects/all'),
    });

    // Данные задач (зависит от selectedProjectId в этом же файле)
    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks', selectedProjectId],
        queryFn: () => apiFetch(`/api/tasks/project/${selectedProjectId}`), 
        enabled: !!selectedProjectId,
    });

    const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

    return (
        <main className="min-h-screen bg-zinc-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <UserProfile />

                {/* Аналитика теперь видит изменение selectedProjectId */}
                <div className="bg-white p-6 rounded-[16px] border border-zinc-200 shadow-sm">
                    {selectedProject ? (
                        <ProjectAnalytic key={selectedProjectId} project={selectedProject} tasks={tasks} />
                    ) : (
                        <p>Выберите проект</p>
                    )}
                </div>

                {/* Пробрасываем пропсы вниз */}
                <WorkSpace 
                    selectedProjectId={selectedProjectId} 
                    onSelectProject={setSelectedProjectId} 
                />
            </div>
        </main>
    );
}