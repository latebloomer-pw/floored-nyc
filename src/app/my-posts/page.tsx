'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
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

    const formatTimeAgo = (date: string) => {
        const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
        return `${Math.floor(minutes / 1440)}d ago`;
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <main className="container mx-auto px-4">
            <div className="space-y-1">
                {posts.map((post) => (
                    <div key={post.id} className="flex items-start gap-2">
                        <span className="text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="hover:text-red-400 cursor-pointer"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </span>
                        <div className="flex-grow">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className="text-red-600 hover:underline"
                                    >
                                        {post.title}
                                    </Link>
                                    <span className="text-gray-500 text-sm ml-2">
                                        ({post.location} • {formatTimeAgo(post.created_at)})
                                    </span>
                                    <div className="text-gray-500 text-sm">
                                        Contact via: {post.contact_method}
                                    </div>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <Link
                                        href={`/posts/${post.id}/edit`}
                                        className="text-gray-500 hover:underline"
                                    >
                                        edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-gray-500 hover:underline"
                                    >
                                        delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {posts.length === 0 && (
                <div className="text-gray-500 p-4">
                    You haven't created any posts yet.
                </div>
            )}
        </main>
    );
}