import { checkPositionUsable } from '../../lib/location';
import ErrorBanner from './ErrorBanner';

/**
 * 위치 상태 표시 (권한 거부 / 측정 실패 / 오래됨 / 부정확).
 * TODO(6주): "다시 측정" 버튼 연결, 정확도 표시 등 UI 다듬기
 */
export default function LocationStatus({ position, status, errorCode }) {
  if (status === 'pending') return <p className="location-status">위치 확인 중…</p>;
  if (status === 'error') return <ErrorBanner code={errorCode} />;

  const usable = checkPositionUsable(position);
  if (!usable.ok) return <ErrorBanner code={usable.code} />;
  return null;
}
