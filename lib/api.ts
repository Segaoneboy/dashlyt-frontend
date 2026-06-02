import { useAuthStore } from "@/store/AuthStore";

export const apiFetch = async(url: string, options: RequestInit = {})=> {
    const response = await fetch(url, {...options, credentials: 'include'});

    if(response.status === 401){
        const refreshResponse = await fetch('/api/auth/refresh', {method: 'POST', credentials: 'include'});

        if(refreshResponse.ok){
            return fetch(url, { ...options, credentials: 'include' }).then(res => res.json());
        } else{
            useAuthStore.getState().logout();
            throw new Error('UNAUTHORIZED');
        }
    }
    if(!response.ok) throw new Error('Ошибка сети');
    const data = await response.json().catch(()=> {});
    return data ?? {};
}