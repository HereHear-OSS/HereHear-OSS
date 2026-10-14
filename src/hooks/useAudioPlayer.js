import { useCallback, useEffect, useRef, useState } from 'react';
import { ERROR_CODES } from '../constants/errors';

/**
 * HTML audio 재생 훅.
 * @param {boolean} canPlay 반경 안 + 위치 유효 여부. false 가 되면 재생을 중지한다.
 * @returns {{ playingUrl: string|null, errorCode: string|null, play: (url:string)=>Promise<void>, stop: ()=>void }}
 *
 * TODO(10주): 반경 이탈/위치 유효성 상실 시 자동 중지 확인, 재생 종료 이벤트 처리
 */
export function useAudioPlayer(canPlay) {
  const audioRef = useRef(null);
  const [playingUrl, setPlayingUrl] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingUrl(null);
  }, []);

  const play = useCallback(
    async (url) => {
      if (!canPlay) return;
      stop();
      const audio = new Audio(url);
      audioRef.current = audio;
      try {
        await audio.play();
        setPlayingUrl(url);
        setErrorCode(null);
      } catch {
        setErrorCode(ERROR_CODES.AUDIO_FAILED);
        setPlayingUrl(null);
      }
    },
    [canPlay, stop],
  );

  // canPlay 가 false 로 바뀌면 재생 중지
  useEffect(() => {
    if (!canPlay) stop();
  }, [canPlay, stop]);

  // 언마운트 시 정리
  useEffect(() => stop, [stop]);

  return { playingUrl, errorCode, play, stop };
}
