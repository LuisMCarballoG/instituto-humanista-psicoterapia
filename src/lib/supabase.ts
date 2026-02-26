import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Certificate = {
    id: string; // uuid
    full_name: string;
    certification_date: string; // YYYY-MM-DD
    created_at: string; // timestamp
    pdf_url: string; // storage link
};
