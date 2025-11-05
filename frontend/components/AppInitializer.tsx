// components/AppInitializer.tsx
'use client';

import { useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../lib/store';

export default function AppInitializer() {
    useEffect(() => {
        const token = useAuthStore.getState().token;

        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }


    }, []);

    return null;
}   