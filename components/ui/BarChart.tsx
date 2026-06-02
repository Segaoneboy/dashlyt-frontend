"use client"
import { Bar } from 'react-chartjs-2';
import '@/lib/chartConfig'; // Импортируем регистрацию

export function BarChartComponent({ data }: { data: any }) {
    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' as const } },
    };
    return <Bar options={options} data={data} />;
}