import { requireSupabase } from '../lib/supabaseClient';

/**
 * 로그인 화면 없이 익명 세션을 보장한다 (좋아요·즐겨찾기 소유자 식별용).
 * Supabase 대시보드 > Authentication > Providers 에서 "Anonymous sign-ins" 를 켜야 한다.
 * 같은 브라우저에서는 세션이 localStorage 에 유지되어 재접속 시 그대로 복원된다.
 */
export async function ensureAnonymousSession() {
  const supabase = requireSupabase();
  const { data: current } = await supabase.auth.getSession();
  if (current.session) return current.session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}
