// components/FontProvider.tsx
'use client';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../static/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export default function FontProvider({ children }: { children: React.ReactNode }) {
  return <div className={`${pretendard.className}`}>{children}</div>;
}
