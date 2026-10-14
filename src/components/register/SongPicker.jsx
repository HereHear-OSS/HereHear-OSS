import { SONG_CATALOG } from '../../data/songCatalog';

/** 허용 카탈로그에서 곡 ID 를 고른다 (상용 음원 검색은 MVP 범위 밖). */
export default function SongPicker({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required>
      <option value="">곡 선택</option>
      {SONG_CATALOG.map((song) => (
        <option key={song.id} value={song.id}>
          {song.title} - {song.artist}
        </option>
      ))}
    </select>
  );
}
