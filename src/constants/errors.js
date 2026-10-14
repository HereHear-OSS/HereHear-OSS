// 13주차: 위치·네트워크·지도·음원 오류를 한 곳에서 관리한다.
// 서비스/훅에서는 코드(ERROR_CODES)만 던지고, 화면에서는 이 메시지를 보여준다.
export const ERROR_CODES = {
  LOCATION_DENIED: 'LOCATION_DENIED',
  LOCATION_UNAVAILABLE: 'LOCATION_UNAVAILABLE',
  LOCATION_STALE: 'LOCATION_STALE',
  LOCATION_INACCURATE: 'LOCATION_INACCURATE',
  DUPLICATE_SONG: 'DUPLICATE_SONG',
  OUT_OF_RADIUS: 'OUT_OF_RADIUS',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  NETWORK: 'NETWORK',
  AUDIO_FAILED: 'AUDIO_FAILED',
  MAP_FAILED: 'MAP_FAILED',
  UNKNOWN: 'UNKNOWN',
};

export const ERROR_MESSAGES = {
  LOCATION_DENIED: '위치 권한이 필요해요. 브라우저 설정에서 허용해 주세요.',
  LOCATION_UNAVAILABLE: '현재 위치를 가져오지 못했어요. 다시 시도해 주세요.',
  LOCATION_STALE: '위치 정보가 오래됐어요. 위치를 다시 측정하는 중이에요.',
  LOCATION_INACCURATE: '위치 정확도가 낮아요. 하늘이 트인 곳에서 다시 시도해 주세요.',
  DUPLICATE_SONG: '이미 등록된 노래입니다',
  OUT_OF_RADIUS: '반경 2km 안에서만 확인할 수 있어요.',
  INVALID_MESSAGE: '곡을 선택하고 메시지를 1~200자로 입력해 주세요.',
  NETWORK: '네트워크 연결을 확인하고 다시 시도해 주세요.',
  AUDIO_FAILED: '음악을 재생하지 못했어요.',
  MAP_FAILED: '지도를 불러오지 못했어요.',
  UNKNOWN: '알 수 없는 오류가 발생했어요.',
};

export function toErrorMessage(code) {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN;
}
