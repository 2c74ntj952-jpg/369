import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'PROPAHANDA GROW - Медичний Гроу-Помічник',
  description: 'Розумний додаток для вирощування медичного канабісу вдома',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="uk" className="overflow-x-hidden max-w-full" suppressHydrationWarning>
      <body className="overflow-x-hidden max-w-full min-h-screen antialiased bg-[#0c0c0e] text-[#f2f2f2] selection:bg-[#d8f087] selection:text-[#0c0c0e]" suppressHydrationWarning>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
