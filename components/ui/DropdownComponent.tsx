"use client"
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function DropdownComponent({ options, onSelect }: { options: string[], onSelect?: (option: string) => void }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full mb-4">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full border-2 rounded-[5px] px-3 py-2 text-[16px] text-zinc-800 cursor-pointer flex justify-between items-center transition-colors
                ${isOpen ? 'border-[#18a7b5] outline-none' : 'border-zinc-200 hover:border-[#138d99]'}`}
            >
                <span className={query ? "text-zinc-800" : "text-zinc-400"}>
                    {query || "Выберите"}
                </span>
                {/* Иконка стрелочки для визуального понимания, что это селект */}
                <ChevronDown 
                    size={20} 
                    color="#18a7b5" 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
            </div>
            
            {isOpen && (
                <ul className="absolute top-full left-0 w-full bg-white border-2 border-[#18a7b5] rounded-[5px] mt-1 z-20 shadow-xl overflow-hidden">
                    {options.map((opt) => (
                        <li
                            key={opt}
                            onClick={() => {
                                setQuery(opt);
                                setIsOpen(false);
                                if (onSelect) onSelect(opt);
                            }}
                            className="px-4 py-2 cursor-pointer text-zinc-800 hover:bg-[#e0f7fa] transition-colors capitalize"
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}