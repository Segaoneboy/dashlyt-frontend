"use client"
import { BarChartComponent } from '@/components/ui/BarChart';
import { PieChartComponent } from '@/components/ui/PieChart';

export function ProjectAnalytic({ tasks, project }: { tasks: any[], project: any }) {
    
    // Данные для BarChart
    const barData = {
        labels: [project.name],
        datasets: [
            {
                label: 'План (ч)',
                data: [tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0)],
                backgroundColor: '#cbd5e1',
            },
            {
                label: 'Факт (ч)',
                data: [tasks.reduce((acc, t) => acc + (t.actualHours || 0), 0)],
                backgroundColor: '#18a7b5',
            }
        ]
    };

    // Данные для PieChart
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {} as any);

    const pieData = {
        labels: ['К выполнению', 'В работе', 'Готово'],
        datasets: [{
            data: [statusCounts.todo || 0, statusCounts.in_progress || 0, statusCounts.done || 0],
            backgroundColor: ['#d4d4d8', '#fbbf24', '#10b981'],
        }]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-[16px] border border-zinc-200">
            <div>
                <h4 className="font-bold text-zinc-900 mb-4">Время (План/Факт)</h4>
                <BarChartComponent data={barData} />
            </div>
            <div>
                <h4 className="font-bold text-zinc-900 mb-4">Статусы задач</h4>
                <PieChartComponent data={pieData} />
            </div>
        </div>
    );
}