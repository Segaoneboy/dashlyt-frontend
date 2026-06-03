"use client"

import { useState } from "react";
import {useRouter} from 'next/navigation'
import { useAuthStore } from "@/store/AuthStore";
import { apiFetch } from "@/lib/api";
import { toast } from 'react-hot-toast';

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const {setUser} = useAuthStore();
    const router= useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password:'',
    });

    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true)
        const loginPromise = apiFetch('/api/auth/login',{
                method:'POST',
                body: JSON.stringify(formData)
            });
        try{
            const data = await toast.promise(loginPromise,{
                loading: 'Входим в аккаунт...',
                success: (data) =>{
                    setUser(data.user);
                    return 'Добро пожаловать';

                },
                error: 'Ошибка входа. Попробуйте позже'
            })
            router.push("/dashboard")
        } catch (error) {
            console.error('Ошибка авторизации:', error);
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
                Войти
            </button>
            
        </form>
    )
}