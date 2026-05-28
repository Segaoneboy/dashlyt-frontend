import React from 'react';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Layers, 
    ShieldCheck, 
    Zap, 
    ArrowRight, 
    BarChart3, 
    Clock 
} from 'lucide-react';
import FeatureCard from '@/components/FeatureCard'; 
import Header from '@/components/Header'; 

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F4F7F8] font-sans selection:bg-[#18a7b5]/20 text-[#585858] relative overflow-hidden">
            
            {/* Фоновые декоративные эффекты (Blur) */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#18a7b5]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#148d99]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Шапка */}
            <Header />

            {/* Hero Section (Главный экран) */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-20 text-center relative z-10">
                
                
                <h1 className="text-4xl font-black text-slate-800 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
                    Управляйте <span className="text-[#18a7b5]">анализируйте</span> и решайте
                </h1>
                
                <p className="text-base md:text-xl font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                    DashLyt — это система дашбордов и аналитики. 
                </p>

                {/* Основное целевое действие */}
                <div className="flex justify-center items-center">
                    <Link 
                        href="/auth" 
                        className="w-full sm:w-auto bg-[#18a7b5] hover:bg-[#148d99] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-[#18a7b5]/25 flex items-center justify-center gap-2 group active:scale-95"
                    >
                        Начать работу 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Превью дашбоарда */}
                <div className="mt-16 bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/60 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 md:p-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <div className="p-3 bg-[#18a7b5]/10 rounded-xl text-[#18a7b5]"><Layers size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Проекты</p>
                                <p className="text-xl font-extrabold text-slate-700">Все под контролем</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <div className="p-3 bg-green-50 rounded-xl text-green-500"><BarChart3 size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Аналитика</p>
                                <p className="text-xl font-extrabold text-slate-700">100% точность данных</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <div className="p-3 bg-orange-50 rounded-xl text-orange-400"><Clock size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Дедлайны</p>
                                <p className="text-xl font-extrabold text-slate-700">Умные уведомления</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Особенности системы */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                        Почему именно DashLyt?
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">Инструменты, созданные инженерами для эффективного менеджмента</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<LayoutDashboard className="text-[#18a7b5]" size={28} />}
                        title="Канбан и Таски"
                        description="Гибкое распределение задач между разработчиками. Отслеживайте статусы задач в реальном времени без лишних созвонов."
                    />
                    <FeatureCard 
                        icon={<ShieldCheck className="text-green-500" size={28} />}
                        title="Ролевой доступ"
                        description="Четкое разделение прав: проект-менеджер видит всю картину, тимлид управляет своими проектами, а сотрудник фокусируется на задачах."
                    />
                    <FeatureCard 
                        icon={<BarChart3 className="text-orange-400" size={28} />}
                        title="Учет рабочего времени"
                        description="Сравнивайте плановые трудозатраты с реально затраченным временем команды. Контролируйте маржинальность и забудьте о выгорании сотрудников."
                    />
                </div>
            </section>

            {/* Подвал */}
            <footer className="border-t border-slate-200/60 bg-white py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={16} className="text-[#18a7b5]" />
                        <span>© 2026 DashLyt Ecosystem. Все права защищены.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}