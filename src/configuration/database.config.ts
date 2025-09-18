import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

export const init = (url: string, anonKey: string) => {
    try {
        if (!supabase) {
            supabase = createClient(url, anonKey);
            console.log('✅ Supabase initialized.');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        throw error;
    }
};

export const getDB = (): SupabaseClient => {
    try {
        if (!supabase) throw new Error('Supabase client not initialized!');
        return supabase;
    } catch (error) {
        console.error('❌ Error getting Supabase client:', error);
        throw error;
    }
};
