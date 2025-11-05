// components/ui/DropCard.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '../../lib/store';

interface Drop {
    id: string;
    name: string;
    description: string;
    total_stock: number;
    claimed_stock: number;
    claim_window_start: string;
    claim_window_end: string;
}

interface DropCardProps {
    drop: Drop;
}

const DropCard: React.FC<DropCardProps> = ({ drop }) => {
    const { user } = useAuthStore();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const remainingStock = drop.total_stock - drop.claimed_stock;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{drop.name}</h3>
                <p className="text-gray-600 mb-4">{drop.description}</p>
                <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="font-semibold text-indigo-600">
                        Kalan Stok: {remainingStock} / {drop.total_stock}
                    </span>
                    <div
                        className={`px-3 py-1 rounded-full text-white ${remainingStock > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {remainingStock > 0 ? 'Stokta' : 'Tükendi'}
                    </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                    <p>
                        <strong>Başlangıç:</strong> {formatDate(drop.claim_window_start)}
                    </p>
                    <p>
                        <strong>Bitiş:</strong> {formatDate(drop.claim_window_end)}
                    </p>
                </div>
                <div className="mt-6">
                    {/* --- KRİTİK DEĞİŞİKLİK BURADA --- */}
                    {user?.role === 'admin' ? (
                        <Link href={`/admin/drops/edit/${drop.id}`} passHref>
                            <button className="w-full px-4 py-2 font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-700">
                                Drop'u Yönet
                            </button>
                        </Link>
                    ) : (
                        <Link href={`/drops/${drop.id}`} passHref>
                            <button className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Detayları Gör
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DropCard;
