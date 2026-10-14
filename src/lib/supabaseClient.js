import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// .env 가 없어도 앱 화면은 뜨도록 null 허용 (서비스 계층에서 체크)
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase 환경 변수(.env)가 설정되지 않았어요. .env.example 을 참고하세요.');
  }
  return supabase;
}
