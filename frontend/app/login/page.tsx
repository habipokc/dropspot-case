// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Zustand store'undan state'i güncelleyecek fonksiyonları alıyoruz
    const { setToken, setUser } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // FastAPI'nin OAuth2PasswordRequestForm'u 'application/x-www-form-urlencoded' formatında veri bekler.
        // Bu yüzden veriyi bu formata çeviriyoruz.
        const formData = new URLSearchParams();
        formData.append('username', email); // Backend'de 'username' olarak bekleniyor
        formData.append('password', password);

        try {
            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token } = response.data;

            // ---- TOKEN YÖNETİMİ ----
            // 1. Token'ı Zustand store'a kaydet
            setToken(access_token);

            // 2. Sonraki isteklerde token'ı otomatik eklemesi için api instance'ını yapılandır
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            const userResponse = await api.get('/users/me');
            setUser(userResponse.data);

            // 3. Kullanıcıyı ana sayfaya yönlendir
            router.push('/');

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Giriş Yap</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-posta Adresi
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Parola
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}