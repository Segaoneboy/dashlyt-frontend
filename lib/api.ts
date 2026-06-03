import { useAuthStore } from "@/store/AuthStore";

let onLogout: () => void = () => {};

export const setOnLogout = (fn: ()=> void) =>{
    onLogout = fn;
}

export const apiFetch = async(url: string, options: RequestInit = {})=> {
    const response = await fetch(url, {...options, credentials: 'include', headers:{'Content-Type':'application/json'}});

    if(response.status === 401){
        const refreshResponse = await fetch('/api/auth/refresh', {method: 'POST', credentials: 'include', headers:{'Content-Type':'application/json'}});

        if(refreshResponse.ok){
            const retryFetch = await fetch(url, { ...options, credentials: 'include',headers:{'Content-Type':'application/json'} }).then(res => res.json())
            return retryFetch ;
        } else{
            onLogout();
            throw new Error('UNAUTHORIZED');
        }
    }
    if(!response.ok) throw new Error('Ошибка сети');
    const data = await response.json().catch(()=> {});
    return data ?? {};
}