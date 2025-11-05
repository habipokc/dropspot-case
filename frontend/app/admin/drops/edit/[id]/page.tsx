// app/admin/drops/edit/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../../../../lib/api';

export default function EditDropPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [totalStock, setTotalStock] = useState(0);
    const [claimWindowStart, setClaimWindowStart] = useState('');
    const [claimWindowEnd, setClaimWindowEnd] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchDrop = async () => {
                try {
                    const { data } = await api.get(`/drops/${id}`);
                    setName(data.name);
                    setDescription(data.description);
                    setTotalStock(data.total_stock);
                    setClaimWindowStart(new Date(data.claim_window_start).toISOString().slice(0, 16));
                    setClaimWindowEnd(new Date(data.claim_window_end).toISOString().slice(0, 16));
                    setIsLoading(false);
                } catch (err) {
                    setError('Drop bilgileri yüklenemedi.');
                    setIsLoading(false);
                }
            };
            fetchDrop();
        }
    }, [id]);

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

        const updatedDrop = {
            name,
            description,
            total_stock: Number(totalStock),
            claim_window_start: new Date(claimWindowStart).toISOString(),
            claim_window_end: new Date(claimWindowEnd).toISOString(),
        };

        try {
            await api.put(`/admin/drops/${id}`, updatedDrop);
            setSuccess('Drop başarıyla güncellendi!');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Bir hata oluştu.');
        }
    };

    if (isLoading) return <p>Yükleniyor...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Drop'u Güncelle</h1>
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Drop Adı</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                    </div>

                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Anahtar Kelimeler (AI için, virgülle ayırın)</label>
                        <input id="keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md" rows={3} />
                            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 self-start">
                                {isGenerating ? '...' : 'AI ile Üret'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="totalStock" className="block text-sm font-medium text-gray-700">Toplam Stok</label>
                        <input id="totalStock" type="number" required value={totalStock} onChange={(e) => setTotalStock(Number(e.target.value))} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="claimWindowStart" className="block text-sm font-medium text-gray-700">Hak Talebi Başlangıcı</label>
                            <input id="claimWindowStart" type="datetime-local" required value={claimWindowStart} onChange={(e) => setClaimWindowStart(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="claimWindowEnd" className="block text-sm font-medium text-gray-700">Hak Talebi Bitişi</label>
                            <input id="claimWindowEnd" type="datetime-local" required value={claimWindowEnd} onChange={(e) => setClaimWindowEnd(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-center">{error}</p>}
                    {success && <p className="text-green-600 text-center">{success}</p>}

                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Güncelle
                    </button>
                </form>
            </div>
        </div>
    );
}