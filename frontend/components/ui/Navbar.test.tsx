// components/ui/Navbar.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../lib/store';
import Navbar from './Navbar';

// next/navigation'ı mock'luyoruz
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(), // push fonksiyonunu taklit et
            prefetch: () => null
        };
    }
}));

// Zustand store'unu mock'luyoruz
// Bu, testimizin store'un gerçek implementasyonuna bağlı olmamasını sağlar
jest.mock('../../lib/store');

// useAuthStore'un mock'lanmış versiyonunu atayalım
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

describe('Navbar Component', () => {

    it('renders login and signup links when user is not logged in', () => {
        // 1. Kullanıcı yok durumunu simüle et
        mockUseAuthStore.mockReturnValue({ user: null });

        render(<Navbar />);

        // "Giriş Yap" ve "Kayıt Ol" linklerinin ekranda olduğunu doğrula
        expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
        expect(screen.getByText('Kayıt Ol')).toBeInTheDocument();

        // "Hoş geldin" mesajının ekranda OLMADIĞINI doğrula
        expect(screen.queryByText(/Hoş geldin/)).not.toBeInTheDocument();
    });

    it('renders user email and logout button when a regular user is logged in', () => {
        // 2. Normal kullanıcı durumunu simüle et
        const mockUser = { email: 'user@example.com', role: 'user' };
        mockUseAuthStore.mockReturnValue({ user: mockUser });

        render(<Navbar />);

        // "Hoş geldin" mesajının doğru e-posta ile ekranda olduğunu doğrula
        expect(screen.getByText(`Hoş geldin, ${mockUser.email}`)).toBeInTheDocument();

        // "Çıkış Yap" butonunun ekranda olduğunu doğrula
        expect(screen.getByRole('button', { name: 'Çıkış Yap' })).toBeInTheDocument();

        // Admin linkinin OLMADIĞINI doğrula
        expect(screen.queryByText('Drop Yönetimi')).not.toBeInTheDocument();
    });

    it('renders admin link when an admin user is logged in', () => {
        // 3. Admin kullanıcı durumunu simüle et
        const mockAdmin = { email: 'admin@example.com', role: 'admin' };
        mockUseAuthStore.mockReturnValue({ user: mockAdmin });

        render(<Navbar />);

        // "Drop Yönetimi" linkinin ekranda olduğunu doğrula
        expect(screen.getByText('Drop Yönetimi')).toBeInTheDocument();
    });
});