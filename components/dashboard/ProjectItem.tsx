import { Edit2, Trash2, UserPlus } from "lucide-react";

export function ProjectItem({ project, onClick, isSelected, onEdit, onDelete, onAddMember }: any) {
    // Вспомогательная функция, чтобы нажатие на кнопку не вызывало onClick всей карточки
    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${
                isSelected ? 'border-[#18a7b5] bg-[#18a7b5]/5' : 'border-zinc-100 hover:border-zinc-200 bg-white'
            }`}
        >
            <div className="flex-1">
                <h4 className="font-semibold text-zinc-800">{project.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{project.description || 'Без описания'}</p>
            </div>

            <div className="flex gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => onAddMember(project)}
                    className="p-2 text-zinc-400 hover:text-[#18a7b5] transition-colors"
                    title="Добавить сотрудника"
                >
                    <UserPlus size={16} />
                </button>
                <button 
                    onClick={() => onEdit(project)}
                    className="p-2 text-zinc-400 hover:text-amber-500 transition-colors"
                    title="Редактировать"
                >
                    <Edit2 size={16} />
                </button>
                <button 
                    onClick={() => onDelete(project)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Удалить"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}