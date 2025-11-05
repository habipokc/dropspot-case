// components/ui/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api'; // 2. API instance'ımızı import ediyoruz
import { useAuthStore } from '../../lib/store'; // 1. Zustand store'umuzu import ediyoruz

const Navbar = () => {
    // 3. Store'dan anlık kullanıcı ve logout fonksiyonunu alıyoruz
    const { user, logout: storeLogout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        // 4. Temiz bir çıkış işlemi için:
        // a. Zustand store'daki kullanıcı ve token'ı temizle
        storeLogout();
        // b. Axios'un default header'ından Authorization bilgisini kaldır. Bu çok önemli!
        delete api.defaults.headers.common['Authorization'];
        // c. Kullanıcıyı login sayfasına yönlendir
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
                    DropSpot
                </Link>
                <div className="flex items-center space-x-4">
                    {/* 5. Kullanıcının olup olmadığını kontrol eden dinamik bölüm */}
                    {user ? (
                        // Kullanıcı varsa bu bölüm gösterilir
                        <>
                            <span className="text-gray-300">Hoş geldin, {user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 rounded bg-red-600 hover:bg-red-700"
                            >
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
                        // Kullanıcı yoksa bu bölüm gösterilir
                        <>
                            <Link href="/login" className="px-3 py-2 rounded hover:bg-gray-700">
                                Giriş Yap
                            </Link>
                            <Link
                                href="/signup"
                                className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700"
                            >
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;