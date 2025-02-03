import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: 'Floored ®',
  description: 'Missed connections for the dancefloor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={'flex flex-col min-h-full'}>
        <Navbar />
        <main className="flex-1 my-20">  {/* Changed from flex-grow to flex-1 */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}