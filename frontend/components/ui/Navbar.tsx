// components/ui/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';

const Navbar = () => {
    const { user, logout: storeLogout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {

        storeLogout();
        delete api.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
                    DropSpot
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* YENİ: Admin rol kontrolü */}
                            {user.role === 'admin' && (
                                <Link
                                    href="/admin/drops"
                                    className="px-3 py-2 rounded font-semibold text-yellow-300 hover:bg-gray-700"
                                >
                                    Drop Yönetimi
                                </Link>
                            )}
                            <span className="text-gray-300">Hoş geldin, {user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 rounded bg-red-600 hover:bg-red-700"
                            >
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
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
