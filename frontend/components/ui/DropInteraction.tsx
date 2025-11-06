// components/ui/DropInteraction.tsx
'use client';

import { useState } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';

interface DropInteractionProps {
    dropId: string;
}

export default function DropInteraction({ dropId }: DropInteractionProps) {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleJoin = async () => {
        setIsLoading(true);
        setFeedback({ message: '', type: '' });
        try {
            await api.post(`/drops/${dropId}/join`);
            setFeedback({ message: 'Başarıyla bekleme listesine katıldınız!', type: 'success' });
        } catch (err: any) {
            setFeedback({ message: err.response?.data?.detail || 'Bir hata oluştu.', type: 'error' });
        }
        setIsLoading(false);
    };


    const handleLeave = async () => {
        setIsLoading(true);
        setFeedback({ message: '', type: '' });
        try {
            await api.post(`/drops/${dropId}/leave`);
            setFeedback({ message: 'Bekleme listesinden başarıyla ayrıldınız.', type: 'success' });
        } catch (err: any) {
            setFeedback({ message: err.response?.data?.detail || 'Bir hata oluştu.', type: 'error' });
        }
        setIsLoading(false);
    };

    const handleClaim = async () => {
        setIsLoading(true);
        setFeedback({ message: '', type: '' });
        try {
            const response = await api.post(`/drops/${dropId}/claim`);
            setFeedback({
                message: `Tebrikler! Hak talebi kodunuz: ${response.data.claim_code}`,
                type: 'success'
            });
        } catch (err: any) {
            setFeedback({ message: err.response?.data?.detail || 'Bir hata oluştu.', type: 'error' });
        }
        setIsLoading(false);
    };

    if (!user) {
        return <p className="mt-8 text-center text-gray-600">Bu dropla etkileşime geçmek için lütfen giriş yapın.</p>
    }

    return (
        <>
            <div className="mt-8 space-x-4">
                <button
                    onClick={handleJoin}
                    disabled={isLoading}
                    className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'İşleniyor...' : 'Bekleme Listesine Katıl'}
                </button>


                <button
                    onClick={handleLeave}
                    disabled={isLoading}
                    className="px-8 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'İşleniyor...' : 'Bekleme Listesinden Ayrıl'}
                </button>

                <button
                    onClick={handleClaim}
                    disabled={isLoading}
                    className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'İşleniyor...' : 'Hak Talebinde Bulun'}
                </button>
            </div>

            {feedback.message && (
                <div className={`mt-4 p-4 rounded-md text-center ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {feedback.message}
                </div>
            )}
        </>
    );
}