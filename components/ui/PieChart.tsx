"use client"
import { Pie } from 'react-chartjs-2';
import '@/lib/chartConfig';

export function PieChartComponent({ data }: { data: any }) {
    return <Pie data={data} />;
}