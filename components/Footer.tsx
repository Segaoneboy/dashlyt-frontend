"use client"

import { LayoutDashboard } from "lucide-react"

export default function Footer() {
    return(
    <footer className="border-t border-slate-200/60 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={16} className="text-[#18a7b5]" />
                <span>© 2026 DashLyt Ecosystem. Все права защищены.</span>
            </div>
        </div>
    </footer>
    )
}