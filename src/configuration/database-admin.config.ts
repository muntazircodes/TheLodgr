import { createClient, SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | null = null;

/**
 * Initialize admin Supabase client once (service role)
 */
export const init = (url: string, serviceKey: string) => {
    try {
        if (!admin) {
            admin = createClient(url, serviceKey);
            console.log('✅ Supabase Admin initialized.');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Supabase Admin:', error);
        throw error;
    }
};

/**
 * Get admin Supabase client anywhere (server-only)
 */
export const getAdminDB = (): SupabaseClient => {
    try {
        if (!admin) throw new Error('Supabase Admin not initialized!');
        return admin;
    } catch (error) {
        console.error('❌ Error getting Supabase Admin client:', error);
        throw error;
    }
};
