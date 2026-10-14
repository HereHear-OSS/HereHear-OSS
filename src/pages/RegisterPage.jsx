import { useState } from 'react';
import RegisterForm from '../components/register/RegisterForm';
import LocationStatus from '../components/common/LocationStatus';
import { useGeolocation } from '../hooks/useGeolocation';
import { checkPositionUsable } from '../lib/location';
import { createFootprint } from '../services/footprintService';
import { ERROR_CODES } from '../constants/errors';

/**
 * 등록 화면: 현재 GPS 위치로만 등록한다 (지도에서 임의 위치 지정 불가).
 * TODO(7주): 등록 성공 후 지도 화면으로 이동/반영
 * TODO(8주): 서버 중복 에러 → DUPLICATE_SONG 표시
 */
export default function RegisterPage() {
  const { position, status, errorCode } = useGeolocation();
  const [submitErrorCode, setSubmitErrorCode] = useState(null);
  const usable = checkPositionUsable(position);

  async function handleSubmit({ songId, message }) {
    if (!usable.ok) {
      setSubmitErrorCode(usable.code);
      return;
    }
    try {
      await createFootprint({ songId, message, position });
      setSubmitErrorCode(null);
      // TODO: 성공 처리
    } catch {
      // TODO(8주): 에러를 분석해서 DUPLICATE_SONG / NETWORK 등으로 변환
      setSubmitErrorCode(ERROR_CODES.UNKNOWN);
    }
  }

  return (
    <section className="page">
      <h2>현재 위치에 음악 남기기</h2>
      <LocationStatus position={position} status={status} errorCode={errorCode} />
      <RegisterForm onSubmit={handleSubmit} disabled={!usable.ok} errorCode={submitErrorCode} />
    </section>
  );
}
