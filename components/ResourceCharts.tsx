"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell 
} from 'recharts';
import ChartContainer from './ChartContainer';

const data = [
  { name: 'Нед 1', tasks: 400, load: 240 },
  { name: 'Нед 2', tasks: 300, load: 139 },
  { name: 'Нед 3', tasks: 200, load: 980 },
  { name: 'Нед 4', tasks: 278, load: 390 },
  { name: 'Нед 5', tasks: 189, load: 480 },
  { name: 'Нед 6', tasks: 239, load: 380 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border-none shadow-2xl rounded-2xl flex flex-col gap-2 min-w-[140px]">
        <p className="text-[#585858] font-bold text-lg m-0 leading-tight">
          {label}
        </p>

        <p className="text-[#18a7b5] font-medium text-sm m-0 flex items-center justify-between gap-4">
          <span className="opacity-80">{payload[0].name}:</span>
          <span className="text-xl font-extrabold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ResourceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  
      <ChartContainer title="Производительность" subtitle="Завершенные задачи">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis hide />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
         
            <Bar dataKey="tasks" name="Задачи" fill="#18a7b5" radius={[6, 6, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.tasks > 300 ? '#148d99' : '#18a7b5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

  
      <ChartContainer title="Загрузка мощностей" subtitle="Процент использования">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18a7b5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#18a7b5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis hide />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="load"
              name="Загрузка"
              stroke="#18a7b5"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorLoad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}