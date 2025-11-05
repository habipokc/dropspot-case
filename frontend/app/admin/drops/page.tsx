// app/admin/drops/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface Drop {
    id: string;
    name: string;
    total_stock: number;
    claimed_stock: number;
    claim_window_start: string;
}

export default function AdminDropsPage() {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrops = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/admin/drops');
            setDrops(data);
        } catch (err) {
            setError('Droplar yüklenemedi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDrops();
    }, []);

    const handleDelete = async (dropId: string) => {
        if (confirm('Bu dropu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                await api.delete(`/admin/drops/${dropId}`);
                // Başarılı silme sonrası listeyi yenile
                fetchDrops();
            } catch (err) {
                alert('Drop silinirken bir hata oluştu.');
            }
        }
    };

    if (isLoading) return <p>Yükleniyor...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin - Drop Yönetimi</h1>
                <Link href="/admin/drops/create" passHref>
                    <button className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        + Yeni Drop Oluştur
                    </button>
                </Link>
            </div>

            {/* Drop Listesi Tablosu */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop Adı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok (Talepler/Toplam)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç Zamanı</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {drops.map((drop) => (
                            <tr key={drop.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{drop.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drop.claimed_stock} / {drop.total_stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(drop.claim_window_start).toLocaleString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Link href={`/admin/drops/edit/${drop.id}`} className="text-yellow-600 hover:text-yellow-900">
                                        Düzenle
                                    </Link>
                                    <button onClick={() => handleDelete(drop.id)} className="text-red-600 hover:text-red-900">
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}