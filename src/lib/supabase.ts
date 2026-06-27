import { createClient } from '@supabase/supabase-js';

const tautanSupabase = import.meta.env.VITE_SUPABASE_URL || '';
const kunciAnonSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!tautanSupabase || !kunciAnonSupabase) {
  console.warn(
    'Tautan Supabase atau Kunci Anonim tidak ditemukan. Pastikan untuk mengonfigurasi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di berkas .env Anda.'
  );
}

export const supabase = createClient(tautanSupabase, kunciAnonSupabase);
