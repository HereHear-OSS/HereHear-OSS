/**
 * 즐겨찾기 목록.
 * props: items(Array), canPlayId(id)=>boolean (현재 반경 안인지), onPlay(item)
 *
 * 규칙: 즐겨찾기는 유지되지만 다시 재생하려면 반경 안에 있어야 한다.
 * TODO(12주): 항목 표시(곡명/메시지), 반경 밖일 때 재생 비활성화, 즐겨찾기 해제
 */
export default function SavedList({ items = [], canPlayId, onPlay }) {
  if (items.length === 0) return <p className="empty">저장한 발자국이 아직 없어요.</p>;

  return (
    <ul className="saved-list">
      {items.map((item) => (
        <li key={item.id}>
          {/* TODO: 곡 정보 표시 */}
          <span>{item.id}</span>
          <button disabled={!canPlayId?.(item.id)} onClick={() => onPlay?.(item)}>재생</button>
        </li>
      ))}
    </ul>
  );
}
