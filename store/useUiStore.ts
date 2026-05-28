import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
    activeProjectId: string | undefined;
    setActiveProjectId: (id: string | undefined) => void;
    resetUi: () => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            activeProjectId: undefined,
            
            setActiveProjectId: (id) => set({ activeProjectId: id }),
            
            resetUi: () => set({ activeProjectId: undefined }),
        }),
        {
            name: 'cllario-ui-cache', // Ключ кэша в localStorage для UI элементов
            storage: createJSONStorage(() => localStorage),
        }
    )
);