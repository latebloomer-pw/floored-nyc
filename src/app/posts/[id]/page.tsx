'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { responsesService } from '@/lib/responses';
import type { Post, Response } from '@/types';

export default function PostPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const [hasResponded, setHasResponded] = useState(false);
    const [responses, setResponses] = useState<Response[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!params?.id) return;

            try {
                setLoading(true);

                const { data: { user } } = await supabase.auth.getUser();

                const { data: post, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setPost(post);

                const owner = user?.id === post.user_id;
                setIsOwner(owner);

                if (owner) {
                    const responses = await responsesService.getResponsesForPost(params.id);
                    setResponses(responses);
                } else if (user) {
                    const responded = await responsesService.hasResponded(params.id);
                    setHasResponded(responded);
                }
            } catch (err) {
                setError('Error loading post');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [params?.id]);

    const handleRespond = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !params?.id) return;

        setSending(true);
        setError(null);

        try {
            await responsesService.createResponse(params.id, message.trim());
            setHasResponded(true);
            setMessage('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error sending response');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    if (loading || isOwner === null) return <div className="p-4">Loading...</div>;
    if (!post) return <div className="p-4">Post not found</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-8">
                <h1 className="text-xl font-semibold mb-4">{post.title}</h1>
                <p className="whitespace-pre-wrap mb-4">{post.description}</p>
                <div className="text-sm text-gray-600">
                    <p>Location: {post.location}</p>
                    <p>Date: {formatDate(post.encounter_date)}</p>
                    <p>Posted: {formatDate(post.created_at)}</p>
                    <p>Contact: {post.contact_method}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            {isOwner ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Responses ({responses.length})</h2>
                    {responses.length === 0 ? (
                        <p className="text-gray-600">No responses yet</p>
                    ) : (
                        <div className="space-y-4">
                            {responses.map((response) => (
                                <div key={response.id} className="border rounded-lg p-4">
                                    <p className="whitespace-pre-wrap">{response.content}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Received {formatDate(response.created_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {hasResponded ? (
                        <div className="bg-green-50 text-green-600 p-4 rounded-md">
                            You have already responded to this post
                        </div>
                    ) : (
                        <form onSubmit={handleRespond} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Send a Response
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    required
                                    disabled={sending}
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="You can only respond once.
                                    Include your contact info or anything else you'd like them to know."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Response'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <button
                onClick={() => router.back()}
                className="mt-8 text-gray-600 hover:underline"
            >
                ← Back
            </button>
        </div>
    );
}