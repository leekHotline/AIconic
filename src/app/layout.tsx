import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'AIconic - Icon Revolution',
  description: '让您的应用给人留下深刻印象',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <I18nProvider>{children}</I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
