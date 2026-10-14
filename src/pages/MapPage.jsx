import { useState } from 'react';
import MapView from '../components/map/MapView';
import FootprintSheet from '../components/sheet/FootprintSheet';
import LocationStatus from '../components/common/LocationStatus';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFootprints } from '../hooks/useFootprints';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { checkPositionUsable } from '../lib/location';

/**
 * 발견 화면: 지도 → 마커 선택 → 바텀시트 → 재생/좋아요/즐겨찾기
 *
 * TODO(9주): 선택 로직   TODO(10주): 상세 조회(fetchFootprintDetail) + 재생 연결
 * TODO(11~12주): 좋아요/즐겨찾기 연결(reactionService)
 */
export default function MapPage() {
  const { position, status, errorCode } = useGeolocation();
  const { footprints } = useFootprints(position);
  const [selected, setSelected] = useState(null);

  // 반경 안 + 위치가 유효할 때만 재생 가능
  const selectedLive = footprints.find((f) => f.id === selected?.id) ?? null;
  const canPlay = Boolean(selectedLive?.isActive) && checkPositionUsable(position).ok;
  const player = useAudioPlayer(canPlay);

  return (
    <section className="page page-map">
      <LocationStatus position={position} status={status} errorCode={errorCode} />
      <MapView
        position={position}
        footprints={footprints}
        selectedId={selected?.id}
        onSelectFootprint={setSelected}
      />
      <FootprintSheet
        footprint={selectedLive}
        detail={null /* TODO(10주): 서버 상세 연결 */}
        playing={Boolean(player.playingUrl)}
        onPlay={() => {/* TODO(10주): player.play(detail.song.audioUrl) */}}
        onStop={player.stop}
        onToggleLike={() => {/* TODO(11주) */}}
        onToggleFavorite={() => {/* TODO(12주) */}}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
