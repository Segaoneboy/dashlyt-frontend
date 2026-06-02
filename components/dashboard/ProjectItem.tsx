export function ProjectItem({ project, onClick, isSelected }: any) {
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected ? 'border-[#18a7b5] bg-[#18a7b5]/5' : 'border-zinc-100 hover:border-zinc-200 bg-white'
            }`}
        >
            <h4 className="font-semibold text-zinc-800">{project.name}</h4>
            <p className="text-xs text-zinc-500 mt-1">{project.description || 'Без описания'}</p>
        </div>
    );
}