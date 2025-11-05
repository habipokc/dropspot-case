// components/ui/DropCard.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DropCard from './DropCard';

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

describe('DropCard Component', () => {
    const mockDrop = {
        id: '123-abc',
        name: 'Test Drop',
        description: 'Bu bir test açıklamasıdır.',
        total_stock: 100,
        claimed_stock: 25,
        claim_window_start: new Date().toISOString(),
        claim_window_end: new Date().toISOString(),
    };

    it('renders drop information correctly', () => {
        render(<DropCard drop={mockDrop} />);

        // Drop adının ekranda olup olmadığını kontrol et
        expect(screen.getByText('Test Drop')).toBeInTheDocument();

        // Stok bilgisinin doğru hesaplanıp gösterildiğini kontrol et
        expect(screen.getByText('Kalan Stok: 75 / 100')).toBeInTheDocument();

        // Stok durumu etiketinin doğru olup olmadığını kontrol et
        expect(screen.getByText('Stokta')).toBeInTheDocument();
    });
});