import {create} from 'zustand';
import { apiFetch, setOnLogout } from '@/lib/api';
import { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>((set)=>({
    user:  null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user: User | null) => set({user, isAuthenticated: !!user}),

    checkAuth: async ()=>{
        set({isLoading: true});
        try{
            const data = await apiFetch('/api/auth/me');
            set({user: data.user, isAuthenticated: true})
        } catch{
            set({user: null, isAuthenticated: false});
        } finally{
            set({isLoading: false});
        }
    },

    logout: async () => {
        try{
            await apiFetch('/api/auth/logout', {method: 'POST'})
        }catch(error){
            console.error('Ошибка выхода', error)
        }finally{
            set({user: null, isAuthenticated: false})
        }
    },

    setLoading: (isLoading: boolean) => set({isLoading}),

}))

setOnLogout(()=>{
    useAuthStore.getState().logout();
})