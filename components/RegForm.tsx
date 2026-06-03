"use client"

import DropdownComponent from '@/components/ui/DropdownComponent';
import { useState } from 'react';
import { useAuthStore } from "@/store/AuthStore";
import {useRouter} from 'next/navigation'
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function RegForm() {
    const router= useRouter()
    const role = ['Сотрудник','Проджект-менеджер','Тимлид']
    const [currentRole, setCurrentRole] = useState('')
    const [loading, setLoading] = useState(false);
    const handleRoleSelection = (role:string)=>{
        setCurrentRole(role);
    }
    const [formData, setFormData] = useState({
        email: '',
        password:'',
        firstName:'',
        lastName:'',
        role:''
    });

    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true)
        const regPromise = apiFetch('/api/auth/register',{
                        method:'POST',
                        body: JSON.stringify(formData)
                    });
        try{
            await toast.promise(regPromise,{
                loading: 'Регистрируем аккаунт...',
                success: 'Регистрация прошла успешно!',
                error: 'Ошибка регистрации. Попробуйте позже'
            });
            router.push("/")
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }finally{
            setLoading(false)
        }
    }

    return(
        <form onSubmit={handleSubmit}  className="w-full flex flex-col">

            {/* Поле Email */}
            <div className="mb-4 flex flex-col text-left w-full">
                <label className="text-sm text-zinc-600 font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e)=> setFormData({...formData, email: e.target.value})}
                    className="w-full  border-2 border-[#18a7b5] rounded-[5px] px-3 py-2 text-[16px] text-zinc-800 focus:outline-none"
                    required
                />
            </div>
            {/* Поле Имя */}
            <div className="mb-4 flex flex-col text-left w-full">
                <label className="text-sm text-zinc-600 font-medium mb-1">Имя</label>
                <input
                type="text"
                value={formData.firstName}
                onChange={(e)=> setFormData({...formData, firstName: e.target.value})}
                className="w-full  border-2 border-[#18a7b5] rounded-[5px] px-3 py-2 text-[16px] text-zinc-800 focus:outline-none"
                required
                />
            </div>
            {/* Поле Фамилия */}
            <div className="mb-4 flex flex-col text-left w-full">
                <label className="text-sm text-zinc-600 font-medium mb-1">Фамилия</label>
                <input
                type="text"
                value={formData.lastName}
                onChange={(e)=> setFormData({...formData, lastName: e.target.value})}
                className="w-full  border-2 border-[#18a7b5] rounded-[5px] px-3 py-2 text-[16px] text-zinc-800 focus:outline-none"
                required
                />
            </div>
            <label className="text-sm text-zinc-600 font-medium mb-1">Роль</label>
            <DropdownComponent options={role} onSelect={(role)=>{
                if(role === 'Сотрудник'){
                    setFormData({...formData, role:'employee'})
                } else if(role === 'Проджект-менеджер'){
                    setFormData({...formData, role:'pm'})
                } else if(role === 'Тимлид'){
                    setFormData({...formData, role:'teamlead'})
                }
            }} />

            {/* Поле Password */}
            <div className="mb-6 flex flex-col text-left w-full">
                <label className="text-sm text-zinc-600 font-medium mb-1">Пароль</label>
                <input
                type="password"
                value={formData.password}
                onChange={(e)=> setFormData({...formData, password: e.target.value})}
                className="w-full  border-2 border-[#18a7b5] rounded-[5px] px-3 py-2 text-[16px] text-zinc-800 focus:outline-none"
                required
                />
            </div>

            {/* Кнопка отправки */}
            <button
                type="submit"
                className="w-full bg-[#18a7b5] hover:bg- text-white font-normal py-3 rounded-[5px] text-[16px] transition-colors cursor-pointer text-center disabled:bg-zinc-400 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
            >
                Зарегистрировать
            </button>
               
        </form>
    )
}