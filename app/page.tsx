import React from 'react';
import { LayoutDashboard, PieChart, Settings, Users, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-[#F4F7F8] font-sans selection:bg-[#18a7b5]/20">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-[#18a7b5] rounded-xl flex items-center justify-center shadow-lg shadow-[#18a7b5]/30">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-[#18a7b5] tracking-tight">DashLyt</h1>
                    </div>

                    <nav className="space-y-2">
                        <NavItem icon={<LayoutDashboard size={20}/>} label="Обзор" active />
                        <NavItem icon={<PieChart size={20}/>} label="Аналитика" />
                        <NavItem icon={<Users size={20}/>} label="Команда" />
                        <NavItem icon={<Settings size={20}/>} label="Настройки" />
                    </nav>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">Статус системы</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#18a7b5]">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Данные синхронизированы
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#18a7b5] mb-2">Обзор ресурсов</h2>
                        <p className="text-[#585858] max-w-md">
                            Добро пожаловать в DashLyt. Здесь вы можете отслеживать ключевые показатели проекта и управлять загрузкой в реальном времени.
                        </p>
                    </div>
                    <button className="bg-[#18a7b5] hover:bg-[#148d99] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#18a7b5]/25 flex items-center gap-2 active:scale-95">
                        <Settings size={18} />
                        Настроить вид
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <StatCard
                        title="Активные элементы"
                        value="128"
                        desc="Задачи в текущем спринте"
                        trend="+12% к прошлой неделе"
                    />
                    <StatCard
                        title="Загрузка ресурсов"
                        value="84%"
                        desc="Средний показатель команды"
                        trend="В пределах нормы"
                    />
                    <StatCard
                        title="Ближайшие дедлайны"
                        value="06"
                        desc="Критические отметки (24ч)"
                        trend="Требует внимания"
                        isAlert
                    />
                </div>

                {/* Описание функционала для отчета */}
                <section className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-xl font-bold text-[#585858] mb-6 flex items-center gap-2">
                        О системе DashLyt
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="font-bold text-[#585858] mb-2 uppercase tracking-wide text-xs">Централизованный контроль</p>
                            Система автоматически агрегирует данные из распределенных источников, преобразуя их в наглядные графики. Это позволяет исключить человеческий фактор при составлении отчетности.
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="font-bold text-[#585858] mb-2 uppercase tracking-wide text-xs">Прогнозная аналитика</p>
                            DashLyt не просто отображает сухие цифры, а анализирует тренды загрузки, помогая менеджеру увидеть потенциальное "бутылочное горлышко" еще до возникновения проблемы.
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Вспомогательные компоненты для чистоты кода
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
            active ? 'bg-[#18a7b5]/10 text-[#18a7b5]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
        }`}>
            {icon}
            <span className="font-bold">{label}</span>
        </div>
    );
}

function StatCard({ title, value, desc, trend, isAlert = false }: any) {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-2 h-full ${isAlert ? 'bg-orange-400' : 'bg-[#18a7b5]'}`}></div>
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{title}</h4>
                <ArrowUpRight className="text-slate-300 group-hover:text-[#18a7b5] transition-colors" size={20} />
            </div>
            <p className="text-5xl font-black text-[#585858] mb-2">{value}</p>
            <p className="text-slate-600 font-medium mb-4">{desc}</p>
            <div className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block ${isAlert ? 'bg-orange-50 text-orange-600' : 'bg-[#18a7b5]/10 text-[#18a7b5]'}`}>
                {trend}
            </div>
        </div>
    );
}