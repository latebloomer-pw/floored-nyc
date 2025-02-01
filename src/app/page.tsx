'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

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
            <span className="text-gray-400">☆</span>
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
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}