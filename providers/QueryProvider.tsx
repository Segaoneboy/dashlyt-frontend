"use client";
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Время, в течение которого данные считаются свежими (5 минут)
                // В этот период TanStack не будет делать лишних повторных запросов в сеть
                staleTime: 5 * 60 * 1000,
                // Данные сохраняются в кэше памяти 10 минут
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false, // Отключаем авто-запрос при переходе между вкладками (по желанию)
                retry: 1, // В случае сбоя сети попытаться сделать запрос еще 1 раз перед выводом ошибки
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}