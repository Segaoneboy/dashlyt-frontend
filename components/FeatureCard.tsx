import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col items-start text-left">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-transparent group-hover:bg-[#18a7b5] transition-colors" />
            <div className="p-4 bg-slate-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
}