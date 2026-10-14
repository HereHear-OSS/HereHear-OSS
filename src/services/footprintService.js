import { requireSupabase } from '../lib/supabaseClient';

// 서버 로직은 Supabase RPC(SQL 함수)에 둔다 → supabase/migrations/0001_init.sql
// 클라이언트는 "호출 + 에러 코드 변환"만 담당한다.

/** 지도 마커용 목록 (곡·메시지 상세 없음: id, songId, lat, lng) */
export async function fetchMarkers() {
  const { data, error } = await requireSupabase().rpc('get_footprint_markers');
  if (error) throw error;
  return data.map((row) => ({ id: row.id, songId: row.song_id, lat: row.lat, lng: row.lng }));
}

/** 상세 조회: 서버가 사용자의 위치로 반경 안인지 다시 검사한다. */
export async function fetchFootprintDetail(footprintId, position) {
  const { data, error } = await requireSupabase().rpc('get_footprint_detail', {
    p_footprint_id: footprintId,
    p_lat: position.lat,
    p_lng: position.lng,
  });
  if (error) throw error; // TODO(13주): error.message 를 ERROR_CODES 로 변환
  return data;
}

/** 현재 위치에 등록. 서버에서 곡별 락 + 반경 내 동일 곡 중복 검사. */
export async function createFootprint({ songId, message, position }) {
  const { data, error } = await requireSupabase().rpc('create_footprint', {
    p_song_id: songId,
    p_message: message,
    p_lat: position.lat,
    p_lng: position.lng,
  });
  if (error) throw error; // TODO(8주): DUPLICATE_SONG 등 서버 에러를 ERROR_CODES 로 변환
  return data;
}
