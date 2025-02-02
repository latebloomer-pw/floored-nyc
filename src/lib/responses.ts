import { supabase } from './supabase';
import type { Response } from '@/types';

export const responsesService = {
    // Create a response
    async createResponse(postId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in to respond');

        const { data, error } = await supabase
            .from('responses')
            .insert({
                post_id: postId,
                responder_id: user.id,
                content
            })
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('You have already responded to this post');
            }
            throw error;
        }

        return data;
    },

    // Get responses for a post (only works if you're the post owner)
    async getResponsesForPost(postId: string): Promise<Response[]> {
        const { data, error } = await supabase
            .from('responses')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Get responses you've sent
    async getSentResponses(): Promise<Response[]> {
        const { data, error } = await supabase
            .from('responses')
            .select('*, posts(title)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Check if user has responded to a post
    async hasResponded(postId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('responses')
            .select('id')
            .eq('post_id', postId)
            .maybeSingle();

        if (error) throw error;
        return !!data;
    }
};