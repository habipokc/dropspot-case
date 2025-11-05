// app/admin/drops/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../../lib/api';

export default function AdminDropsPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [totalStock, setTotalStock] = useState(100);
    const [claimWindowStart, setClaimWindowStart] = useState('');
    const [claimWindowEnd, setClaimWindowEnd] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basit bir tarih formatı kontrolü
        const newDrop = {
            name,
            description,
            total_stock: Number(totalStock),
            // Backend'in beklediği ISO formatına çeviriyoruz.
            claim_window_start: new Date(claimWindowStart).toISOString(),
            claim_window_end: new Date(claimWindowEnd).toISOString(),
        };

        try {
            // Not: Bu endpoint'in korunması gerekiyor. Henüz yapmadık ama yapacağız.
            await api.post('/admin/drops', newDrop);
            setSuccess(`'${name}' adlı drop başarıyla oluşturuldu!`);
            // Formu temizle
            setName('');
            setDescription('');
            setTotalStock(100);
            setClaimWindowStart('');
            setClaimWindowEnd('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Drop oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin - Drop Yönetimi</h1>

            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Yeni Drop Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Alanları */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Drop Adı</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="totalStock" className="block text-sm font-medium text-gray-700">Toplam Stok</label>
                        <input id="totalStock" type="number" required value={totalStock} onChange={(e) => setTotalStock(Number(e.target.value))}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="claimWindowStart" className="block text-sm font-medium text-gray-700">Hak Talebi Başlangıcı</label>
                            <input id="claimWindowStart" type="datetime-local" required value={claimWindowStart} onChange={(e) => setClaimWindowStart(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="claimWindowEnd" className="block text-sm font-medium text-gray-700">Hak Talebi Bitişi</label>
                            <input id="claimWindowEnd" type="datetime-local" required value={claimWindowEnd} onChange={(e) => setClaimWindowEnd(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}

                    <div>
                        <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Drop Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}