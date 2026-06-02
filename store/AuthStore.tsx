import {create} from 'zustand';
import {UserType} from '@/types/UserType';
import { apiFetch } from '@/lib/api';

export const useAuthStore = create((set)=>({
    user:  null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user) => set({user, isAuthenticated: !!user}),

    checkAuth: async ()=>{
        set({isLoading: true});
        try{
            const data = await apiFetch('/api/auth/me');
            set({user: data.user, isAuthenticated: true})
        } catch{
            set({user: null, isAuthenthicated: false});
        } finally{
            set({isLoading: false});
        }
    },

    logout: () => set({user:null, isAuthenticated: false}),
    setLoading: (isLoading) => set({isLoading}),

}))