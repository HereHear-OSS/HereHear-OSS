import { requireSupabase } from '../lib/supabaseClient';

// 좋아요/즐겨찾기는 (익명 사용자, 등록 기록) 조합당 1개. 다시 누르면 취소(토글).

/** @returns {Promise<{active:boolean,count:number}>} */
export async function toggleLike(footprintId) {
  const { data, error } = await requireSupabase().rpc('toggle_like', { p_footprint_id: footprintId });
  if (error) throw error;
  return data;
}

/** @returns {Promise<{active:boolean}>} */
export async function toggleFavorite(footprintId) {
  const { data, error } = await requireSupabase().rpc('toggle_favorite', { p_footprint_id: footprintId });
  if (error) throw error;
  return data;
}

/** 내 즐겨찾기 목록 (재접속 후 복원). TODO(12주): 구현 방식 결정 (RPC or 뷰) */
export async function fetchMyFavorites() {
  const { data, error } = await requireSupabase().rpc('get_my_favorites');
  if (error) throw error;
  return data;
}
