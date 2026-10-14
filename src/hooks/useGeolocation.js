import { useEffect, useState } from 'react';
import { ERROR_CODES } from '../constants/errors';

/**
 * watchPosition 으로 위치를 계속 갱신한다.
 * @returns {{
 *   position: {lat:number,lng:number,accuracy:number,timestamp:number}|null,
 *   status: 'pending'|'ready'|'error',
 *   errorCode: string|null
 * }}
 *
 * TODO(6주): 오래된 측정값 처리(주기적 재검사), 재측정(retry) 함수 제공,
 *            enableHighAccuracy / maximumAge 등 옵션 조정
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('pending');
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setErrorCode(ERROR_CODES.LOCATION_UNAVAILABLE);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setStatus('ready');
        setErrorCode(null);
      },
      (err) => {
        setStatus('error');
        setErrorCode(
          err.code === err.PERMISSION_DENIED ? ERROR_CODES.LOCATION_DENIED : ERROR_CODES.LOCATION_UNAVAILABLE,
        );
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, status, errorCode };
}
