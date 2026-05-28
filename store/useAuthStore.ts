import { create } from 'zustand';

export interface User {
    id: string;
    email: string;
    role: 'pm' | 'teamlead' | 'employee';
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    
   
    logout: () => set({ user: null }),
}));