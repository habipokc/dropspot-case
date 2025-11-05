// app/admin/drops/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../../../lib/api';

export default function CreateDropPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [totalStock, setTotalStock] = useState(100);
    const [claimWindowStart, setClaimWindowStart] = useState('');
    const [claimWindowEnd, setClaimWindowEnd] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        if (!name) {
            alert('Lütfen bir drop adı girin.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        try {
            const response = await api.post('/admin/drops/generate-description', {
                name: name,
                keywords: keywords,
            });
            setDescription(response.data.description);
        } catch (err) {
            alert('Açıklama üretilirken bir hata oluştu.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const newDrop = {
            name,
            description,
            total_stock: Number(totalStock),
            claim_window_start: new Date(claimWindowStart).toISOString(),
            claim_window_end: new Date(claimWindowEnd).toISOString(),
        };

        try {
            await api.post('/admin/drops', newDrop);
            setSuccess(`'${name}' adlı drop başarıyla oluşturuldu! Panele yönlendiriliyorsunuz...`);
            setTimeout(() => router.push('/admin/drops'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Drop oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Yeni Drop Oluştur</h1>
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Drop Adı</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Anahtar Kelimeler (AI için, virgülle ayırın)</label>
                        <input id="keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
                            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 self-start">
                                {isGenerating ? '...' : 'AI ile Üret'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="totalStock" className="block text-sm font-medium text-gray-700">Toplam Stok</label>
                        <input id="totalStock" type="number" required value={totalStock} onChange={(e) => setTotalStock(Number(e.target.value))} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="claimWindowStart" className="block text-sm font-medium text-gray-700">Hak Talebi Başlangıcı</label>
                            <input id="claimWindowStart" type="datetime-local" required value={claimWindowStart} onChange={(e) => setClaimWindowStart(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="claimWindowEnd" className="block text-sm font-medium text-gray-700">Hak Talebi Bitişi</label>
                            <input id="claimWindowEnd" type="datetime-local" required value={claimWindowEnd} onChange={(e) => setClaimWindowEnd(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-600 text-center">{success}</p>}

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