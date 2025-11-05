// app/drops/[id]/page.tsx

import DropInteraction from '../../../components/ui/DropInteraction';

interface Drop {
    id: string;
    name: string;
    description: string;
    total_stock: number;
    claimed_stock: number;
    claim_window_start: string;
    claim_window_end: string;
}

async function getDropDetails(id: string): Promise<Drop | null> {
    try {
        const res = await fetch(`http://127.0.0.1:8000/drops/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch drop ${id}:`, error);
        return null;
    }
}

export default async function DropDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const drop = await getDropDetails(id);

    if (!drop) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold">Drop Bulunamadı</h1>
                <p>Aradığınız drop mevcut değil veya bir hata oluştu.</p>
            </div>
        );
    }

    const remainingStock = drop.total_stock - drop.claimed_stock;
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString('tr-TR');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                    {drop.name}
                </h1>
                <p className="text-lg text-gray-600 mb-6">{drop.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-md font-semibold text-gray-700 mb-2">
                            Stok Durumu
                        </h2>
                        <p className="text-2xl font-bold text-indigo-600">
                            {remainingStock}{' '}
                            <span className="text-base font-normal text-gray-500">
                                / {drop.total_stock}
                            </span>
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-md font-semibold text-gray-700 mb-2">
                            Hak Talebi Penceresi
                        </h2>
                        <p className="text-sm text-gray-800">
                            {formatDate(drop.claim_window_start)} -{' '}
                            {formatDate(drop.claim_window_end)}
                        </p>
                    </div>
                </div>

                {/* Güncellenen kısım: statik butonlar kaldırıldı */}
                <DropInteraction dropId={drop.id} />
            </div>
        </div>
    );
}
