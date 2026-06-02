export function TaskItem({ task, onClick }: any) {
    // Пастельные цвета для статусов
    const statusConfig: any = {
        todo: {
            bg: 'bg-blue-100',
            text: 'text-zinc-600',
            border: 'border-zinc-200',
            label: 'К выполнению'
        },
        in_progress: {
            bg: 'bg-amber-50', // Мягкий янтарный
            text: 'text-amber-600',
            border: 'border-amber-200',
            label: 'В работе'
        },
        done: {
            bg: 'bg-emerald-50', // Мягкий изумрудный
            text: 'text-emerald-600',
            border: 'border-emerald-200',
            label: 'Готово'
        }
    };

    const config = statusConfig[task.status] || statusConfig.todo;

    return (
        <div 
            onClick={onClick}
            className="group p-4 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-[#18a7b5] hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-semibold text-zinc-900 group-hover:text-[#18a7b5] transition-colors">
                    {task.title}
                </span>
                {/* Бейдж статуса */}
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${config.bg} ${config.text} ${config.border}`}>
                    {config.label}
                </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="opacity-50">⏱</span>
                        <span className="font-medium text-zinc-700">{task.actualHours || 0} / {task.estimatedHours || 0}ч</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="opacity-50">🗓</span>
                        {task.endDate ? new Date(task.endDate).toLocaleDateString() : '—'}
                    </span>
                </div>
            </div>
        </div>
    );
}