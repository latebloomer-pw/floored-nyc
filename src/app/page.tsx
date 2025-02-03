'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ }
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

  // In your Post component/list where you display the time
  const TimeDisplay = ({ date }: { date: string }) => {
    const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    const isRecent = minutes < 1440; // less than 24 hours

    const formatTimeAgo = () => {
      if (minutes < 60) return `${minutes}m ago`;
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
      return `${Math.floor(minutes / 1440)}d ago`;
    };

    return (
      <span className={`
      ${isRecent ? 'text-red-600 animate-pulse' : 'text-gray-500'}
    `}>
        • {formatTimeAgo()}
      </span>
    );
  };

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-2">All Posts</h1>
      <div className="space-y-1">
        {posts.map((post) => (
          <div key={post.id} className="flex items-start gap-2">
            <span className="text-red-600 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="grey"
                strokeWidth="1"
                className="hover:text-white cursor-pointer"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <div className="flex flex-row gap-1">
              <Link
                href={`/posts/${post.id}`}
                className="text-red-600 hover:underline"
              >
                {post.title}
              </Link>
              <span className="text-gray-500">({post.location} <TimeDisplay date={post.created_at} />)</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}