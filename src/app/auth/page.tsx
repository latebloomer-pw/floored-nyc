'use client';

import Auth from '@/components/Auth';

export default function AuthPage() {
    return (
        <div className="container mx-auto py-8 my-20">
            <h1 className="text-2xl font-bold text-center mb-8">Sign In / Sign Up</h1>
            <p className="text-center mb-8">Please check your spam folder if you don't see an email from us.</p>
            <Auth />
        </div>
    );
}