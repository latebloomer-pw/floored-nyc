'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CreatePost from '@/components/CreatePost';
import Auth from '@/components/Auth';

export default function CreatePostPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div className='mx-auto'>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            {isAuthenticated ? <CreatePost /> : <Auth />}
        </div>
    );
}