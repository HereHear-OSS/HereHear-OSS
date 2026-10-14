import { useState } from 'react';
import SongPicker from './SongPicker';
import ErrorBanner from '../common/ErrorBanner';
import { validateMessage } from '../../lib/validators';
import { POLICY } from '../../constants/policy';
import { ERROR_CODES } from '../../constants/errors';

/**
 * 곡 + 메시지 입력 폼.
 * props: onSubmit({ songId, message }) => Promise<void>, disabled, errorCode
 *
 * TODO(7주): 글자 수 표시, 입력 검증 메시지 다듬기
 * TODO(8주): 저장 중 버튼 잠금(중복 제출 방지), 서버 에러(DUPLICATE_SONG 등) 표시
 */
export default function RegisterForm({ onSubmit, disabled, errorCode }) {
  const [songId, setSongId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localErrorCode, setLocalErrorCode] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const checked = validateMessage(message);
    if (!songId || !checked.ok) {
      setLocalErrorCode(ERROR_CODES.INVALID_MESSAGE);
      return;
    }
    setLocalErrorCode(null);
    setSubmitting(true);
    try {
      await onSubmit({ songId, message: checked.value });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <SongPicker value={songId} onChange={setSongId} />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={POLICY.MESSAGE_MAX}
        placeholder="이 장소의 기억을 남겨보세요 (1~200자)"
      />
      <ErrorBanner code={localErrorCode ?? errorCode} />
      <button type="submit" disabled={disabled || submitting}>
        {submitting ? '등록 중…' : '현재 위치에 등록'}
      </button>
    </form>
  );
}
