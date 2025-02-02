import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './fonts.css'


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Floored NYC ®',
  description: 'missed connections for the dancefloor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Navbar />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}