// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-red-600 text-white w-full fixed bottom-0">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-left sm:flex-row flex-col">
                    <Link href="https://clubstack.net" rel="noopener noreferrer" target="_blank" className="text-white text-sm hover:underline">

                        © {new Date().getFullYear()} Clubstack Dancefloor Services Inc.
                    </Link>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <Link href="/guidelines" className="text-white hover:underline">
                            Community Guidelines
                        </Link>
                    </div>
                </div>
            </div>
        </footer >
    );
}