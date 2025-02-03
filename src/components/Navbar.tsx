'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();


    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');  // Add this line
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };


    return (
        <header className="border-b border-gray-300 bg-gray-100 mb-6 fixed top-0 w-full z-50">
            <div className="container mx-auto px-4">
                {/* Main navbar - always visible */}
                <div className="flex items-center justify-between h-12">
                    <div className="flex items-center gap-4 text-red-600">
                        <Link href="/" className="text-xl text-red-600 font-bold hover:underline">
                            Floored ®
                        </Link>
                        <span className="text-red-600 hidden sm:inline">|</span>
                        <span className="text-red-600 hidden sm:inline">
                            Missed Connections for the Dancefloor
                        </span>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/create"
                                    className={`${isActive('/create')
                                        ? 'border border-gray-300 bg-white'
                                        : 'text-gray-600 hover:underline'
                                        } px-3 py-1`}
                                >
                                    make a post
                                </Link>
                                <Link
                                    href="/"
                                    className={`${isActive('/')
                                        ? 'border border-gray-300 bg-white'
                                        : 'text-gray-600 hover:underline'
                                        } px-3 py-1`}
                                >
                                    all posts
                                </Link>
                                <Link
                                    href="/my-posts"
                                    className={`${isActive('/my-posts')
                                        ? 'border border-gray-300 bg-white'
                                        : 'text-gray-600 hover:underline'
                                        } px-3 py-1`}
                                >
                                    my posts
                                </Link>
                                <button
                                    onClick={() => handleSignOut()}
                                    className="text-gray-600 hover:underline"
                                >
                                    sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                className={`${isActive('/auth')
                                    ? 'border border-gray-300 bg-white'
                                    : 'text-gray-600'
                                    } px-3 py-1 hover:no-underline`}
                            >
                                sign in
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="sm:hidden px-2"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <Link href="/"
                                className={`${isActive('/')
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                    }`}>
                                all posts
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        href="/create"
                                        className={`${isActive('/create')
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                            }`}
                                    >
                                        post
                                    </Link>
                                    <Link
                                        href="/my-posts"
                                        className={`${isActive('/my-posts')
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                            }`}
                                    >
                                        my posts
                                    </Link>
                                    <button
                                        onClick={() => supabase.auth.signOut()}
                                        className="text-gray-600 text-left"
                                    >
                                        sign out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth"
                                    className={`${isActive('/auth')
                                        ? 'text-red-600'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    sign in
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}