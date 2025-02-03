// src/components/Auth.tsx
'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthComponent() {
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <div className="max-w-md mx-auto p-6">
            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#e7000b',
                                brandAccent: 'black',
                            },
                        },
                    },
                }}
                providers={[]}
            />
        </div>
    );
}