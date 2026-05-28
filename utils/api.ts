import { useAuthStore } from '@/store/useAuthStore';

interface FetchOptions extends RequestInit {
    body?: any;
}

export const apiFetch = async (url: string, options: FetchOptions = {}) => {
    // Автоматически добавляем заголовки для JSON
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
        // КРИТИЧЕСКИ ВАЖНО для httpOnly cookies: заставляет fetch отправлять и принимать куки
        credentials: 'include', 
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    let response = await fetch(url, config);

    // 1. Если прилетел 401 — возможно, протух Access токен
    if (response.status === 401) {
        try {
            // 2. Стучимся на бэкенд за обновлением токенов
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            // 3. Если рефреш успешный — переотправляем изначальный запрос
            if (refreshResponse.ok) {
                response = await fetch(url, config);
            } else {
                // 4. Если и рефреш упал (кука умерла) — сессия полностью мертва
                handleAuthFailure();
            }
        } catch (error) {
            console.error('Ошибка при попытке рефреша токенов:', error);
            handleAuthFailure();
        }
    }

    return response;
};

// Функция жесткого логаута на клиенте
function handleAuthFailure() {
    // Zustand позволяет читать и вызывать экшены ДАЖЕ вне React-компонентов через getState()
    useAuthStore.getState().logout();
    
    // Мягко редиректим на авторизацию
    if (typeof window !== 'undefined') {
        window.location.href = '/auth';
    }
}