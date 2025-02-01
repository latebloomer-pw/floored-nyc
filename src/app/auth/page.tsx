'use client';

import Auth from '@/components/Auth';

export default function AuthPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold text-center mb-8">Sign In / Sign Up</h1>
            <Auth />
        </div>
    );
}