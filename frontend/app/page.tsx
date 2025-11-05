// app/page.tsx
import DropCard from '../components/ui/DropCard';

interface Drop {
  id: string;
  name: string;
  description: string;
  total_stock: number;
  claimed_stock: number;
  claim_window_start: string;
  claim_window_end: string;
}

async function getDrops(): Promise<Drop[]> {
  try {
    const res = await fetch('http://127.0.0.1:8000/drops/', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch drops:", error);
    return [];
  }
}

export default async function HomePage() {
  const drops: Drop[] = await getDrops();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Aktif Droplar</h1>

      {drops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Şu anda gösterilecek aktif bir drop bulunmuyor.</p>
      )}
    </div>
  );
}