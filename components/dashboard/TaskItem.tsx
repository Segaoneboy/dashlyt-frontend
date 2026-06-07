import { Edit2, Trash2, UserPlus } from "lucide-react";

export function TaskItem({ task, onStatusChange, onEdit, onDelete, onAddMember, canManage }: any) {
    const statusConfig: any = {
       todo: {
            bg: 'bg-[#adc0d9]/20', 
            text: 'text-[#5f6977]', 
            border: 'border-[#adc0d9]',
            label: 'К выполнению'
        },
        in_progress: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
            label: 'В работе'
        },
        done: {
        bg: 'bg-cyan-50/70',
        text: 'text-[#18a7b5]',   
        border: 'border-cyan-200', 
        label: 'Готово'
        }
    };

    const config = statusConfig[task.status] || statusConfig.todo;

    return (
        <div 
            className="group p-4 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-[#18a7b5] hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-zinc-900">
                        {task.title}
                    </span>
                    {/* Бейдж статуса */}
                    <button 
                        onClick={() => onStatusChange(task)}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border cursor-pointer ${config.bg} ${config.text} ${config.border} hover:opacity-80 transition-opacity`}
                    >
                        {config.label}
                    </button>
                </div>
                
                {/* Панель управления кнопками */}
                {canManage && (
                    <div className="flex gap-1 ml-4">
                        <button 
                            onClick={() => onAddMember(task)}
                            className="p-1.5 text-zinc-400 hover:text-[#18a7b5] transition-colors rounded-md hover:bg-zinc-50"
                            title="Добавить сотрудника"
                        >
                            <UserPlus size={16} />
                        </button>
                        <button 
                            onClick={() => onEdit(task)}
                            className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors rounded-md hover:bg-zinc-50"
                            title="Редактировать"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(task.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-md hover:bg-zinc-50"
                            title="Удалить"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                
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