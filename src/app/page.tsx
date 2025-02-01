'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

        if (error) {
          throw error;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading posts...</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Missed Connections</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <div className="text-sm text-gray-500">
              <p>Location: {post.location}</p>
              <p>Date: {new Date(post.encounter_date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}