'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <header className="border-b border-gray-300 bg-gray-100 mb-4">
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-red-600 font-bold hover:no-underline">
                            CL
                        </Link>
                        <span className="text-gray-500">|</span>
                        <Link href="/" className="text-red-600 hover:underline">
                            missed connections
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/create" className="border border-gray-300 px-3 py-1 bg-white hover:no-underline">
                                    post
                                </Link>
                                <Link href="/my-posts" className="text-gray-600 hover:underline">
                                    my posts
                                </Link>
                                <button
                                    onClick={() => supabase.auth.signOut()}
                                    className="text-gray-600 hover:underline"
                                >
                                    sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                className="text-gray-600 hover:underline"
                            >
                                sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}