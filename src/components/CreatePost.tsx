'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Must be logged in to create a post');
            }

            const { error } = await supabase.from('posts').insert({
                user_id: user.id,
                title: formData.get('title'),
                description: formData.get('description'),
                location: formData.get('location'),
                encounter_date: formData.get('encounter_date'),
                contact_method: formData.get('contact_method')
            });

            if (error) throw error;

            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
            <h2 className="text-lg mb-4">Create New Post</h2>

            {error && (
                <div className="text-red-600 mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <textarea
                        name="description"
                        placeholder="Description"
                        required
                        rows={6}
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <input
                        type="date"
                        name="encounter_date"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="contact_method"
                        placeholder="Contact Method (email or phone)"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-red-600 text-white px-4 py-1"
            >
                {loading ? 'Posting...' : 'Post'}
            </button>
        </form>
    );
}