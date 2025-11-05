// components/AppInitializer.tsx
'use client';

import { useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../lib/store';

export default function AppInitializer() {
    useEffect(() => {

        const unsubscribe = useAuthStore.persist.onFinishHydration((state) => {
            if (state.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
            }
        });


        const initialToken = useAuthStore.getState().token;
        if (initialToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
        }

        return () => {
            unsubscribe();
        };
    }, []);

    return null;
}