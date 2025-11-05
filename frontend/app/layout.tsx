// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/ui/Navbar'; // Navbar'ı import et
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DropSpot',
  description: 'Limited edition drops platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Navbar'ı buraya ekle */}
        <main className="container mx-auto px-6 py-8">
          {children} {/* Sayfa içeriği burada görünecek */}
        </main>
      </body>
    </html>
  );
}