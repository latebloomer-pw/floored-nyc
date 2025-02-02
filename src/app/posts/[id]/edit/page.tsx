'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';

export default function EditPost() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPost() {
            if (!params?.id) {
                setLoading(false);
                return;
            }

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/auth');
                    return;
                }

                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                if (data.user_id !== user.id) {
                    router.push('/');
                    return;
                }

                setPost(data);
            } catch (error) {
                setError('Error loading post');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [params?.id, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!params?.id) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    location: formData.get('location'),
                    encounter_date: formData.get('encounter_date'),
                    contact_method: formData.get('contact_method')
                })
                .eq('id', params.id);

            if (error) throw error;
            router.push('/my-posts');
        } catch (error) {
            setError('Error updating post');
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!post) return <div className="p-4">Post not found</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
            <h2 className="text-lg mb-4">Edit Post</h2>

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
                        defaultValue={post.title}
                        placeholder="Title"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <textarea
                        name="description"
                        defaultValue={post.description}
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
                        defaultValue={post.location}
                        placeholder="Location"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <input
                        type="date"
                        name="encounter_date"
                        defaultValue={post.encounter_date}
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="contact_method"
                        defaultValue={post.contact_method}
                        placeholder="Contact Method (email or phone)"
                        required
                        className="w-full border px-2 py-1"
                    />
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-1"
                >
                    Update Post
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/my-posts')}
                    className="border border-gray-300 px-4 py-1"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}