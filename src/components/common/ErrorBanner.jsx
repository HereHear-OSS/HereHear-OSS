import { toErrorMessage } from '../../constants/errors';

/** code(ERROR_CODES) 또는 message 를 받아 화면 상단에 표시 */
export default function ErrorBanner({ code, message, onRetry }) {
  if (!code && !message) return null;
  return (
    <div className="error-banner" role="alert">
      <span>{message ?? toErrorMessage(code)}</span>
      {onRetry && <button onClick={onRetry}>다시 시도</button>}
    </div>
  );
}
