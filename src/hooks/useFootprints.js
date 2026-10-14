import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMarkers } from '../services/footprintService';
import { isWithinRadius } from '../lib/geo';
import { isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * 발자국 마커 목록 + 현재 위치 기준 활성(반경 안) 여부.
 * @param {{lat:number,lng:number}|null} position
 * @returns {{ footprints: Array<{id,songId,lat,lng,isActive:boolean}>, loading, error, reload }}
 *
 * TODO(9주): 진입/이탈 시 isActive 가 갱신되는지 확인, 지도 이동 범위 기반 조회로 확장할지 결정
 */
export function useFootprints(position) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      setMarkers(await fetchMarkers());
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const footprints = useMemo(
    () => markers.map((m) => ({ ...m, isActive: position ? isWithinRadius(position, m) : false })),
    [markers, position],
  );

  return { footprints, loading, error, reload };
}
