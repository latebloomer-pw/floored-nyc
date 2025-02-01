'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import { useRouter } from 'next/navigation';

export default function MyPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUserPosts();
    }, []);

    async function fetchUserPosts() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingPost) return;

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
                .eq('id', editingPost.id);

            if (error) throw error;

            await fetchUserPosts();
            setEditingPost(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading posts...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">My Posts</h1>

            {editingPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={editingPost.title}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingPost.description}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    defaultValue={editingPost.location}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Date of Encounter</label>
                                <input
                                    type="date"
                                    name="encounter_date"
                                    defaultValue={editingPost.encounter_date}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Contact Method</label>
                                <input
                                    type="text"
                                    name="contact_method"
                                    defaultValue={editingPost.contact_method}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                        <p className="text-gray-600 mb-4">{post.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                            <p>Location: {post.location}</p>
                            <p>Date: {new Date(post.encounter_date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setEditingPost(post)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="text-red-600 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}