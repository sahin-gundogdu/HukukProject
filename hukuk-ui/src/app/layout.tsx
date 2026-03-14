import type { Metadata } from 'next';
import './globals.css';
import '@/styles/layout/layout.scss';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Providers from '@/layout/components/providers';

export const metadata: Metadata = {
  title: 'Hukuk Görev Yönetim Sistemi',
  description: 'Hukuk ve Uyum Başkanlığı Görev Yönetim Sistemi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          id="theme-css"
          href="/themes/lara-light-indigo/theme.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
