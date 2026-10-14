import ErrorBanner from '../common/ErrorBanner';
import { ERROR_CODES } from '../../constants/errors';

/**
 * 바텀시트: 선택한 발자국의 상세 + 재생 + 좋아요/즐겨찾기.
 *
 * props
 *  - footprint: 선택한 마커 { id, songId, isActive } (없으면 렌더 안 함)
 *  - detail: 서버에서 받은 상세 { message, song, likeCount, liked, favorited } | null
 *  - playing: 현재 재생 중인지
 *  - onPlay / onStop / onToggleLike / onToggleFavorite / onClose: 콜백
 *
 * 규칙
 *  - 반경 밖: 접근 제한 안내만 (상세·재생 불가)
 *  - 반경 안: 곡/메시지 확인 + 재생
 *
 * TODO(10주): 상세 표시, 재생 버튼   TODO(11주): 좋아요 토글   TODO(12주): 즐겨찾기 토글
 * TODO(11주): 요청 중 버튼 잠금(중복 요청 방지), 실패 시 성공 표시 유지 금지
 */
// eslint-disable-next-line no-unused-vars
export default function FootprintSheet({
  footprint,
  detail,
  playing,
  onPlay,
  onStop,
  onToggleLike,
  onToggleFavorite,
  onClose,
}) {
  if (!footprint) return null;

  return (
    <aside className="sheet">
      <button className="sheet-close" onClick={onClose} aria-label="닫기">×</button>

      {!footprint.isActive ? (
        <ErrorBanner code={ERROR_CODES.OUT_OF_RADIUS} />
      ) : (
        <div>
          {/* TODO: detail.song.title / artist / detail.message 표시 */}
          <p>상세 영역 (TODO)</p>
          <button onClick={playing ? onStop : onPlay}>{playing ? '정지' : '재생'}</button>
          <button onClick={onToggleLike}>좋아요</button>
          <button onClick={onToggleFavorite}>즐겨찾기</button>
        </div>
      )}
    </aside>
  );
}
