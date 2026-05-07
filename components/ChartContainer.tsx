"use client";
import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ChartContainer({ title, subtitle, children }: ChartContainerProps){
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#585858] tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </div>
  );
};