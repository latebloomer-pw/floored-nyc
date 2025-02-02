'use client';

import { Auth } from '@supabase/auth-ui-react';
import { darkThemes, ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function AuthComponent() {
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
                providers={['google']}
                redirectTo={`${window.location.origin}/auth/callback`
                }
            />
        </div>
    );
}