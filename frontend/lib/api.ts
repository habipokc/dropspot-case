// lib/api.ts


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Tüm aktif drop'ları getiren fonksiyon.
 */
export const getDrops = async () => {
    const res = await fetch(`${API_URL}/drops`);

    if (!res.ok) {
        throw new Error('Failed to fetch drops');
    }

    return res.json();
};

