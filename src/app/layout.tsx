import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIconic - AI商用图标生成器',
  description: '使用AI生成可商用的SVG图标，支持多种格式和尺寸导出',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}