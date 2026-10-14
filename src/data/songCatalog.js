// 사용 허가가 확인된 시연용 음원 카탈로그 (1~2주차에 권한 확인 후 채우기).
// 서버 songs 테이블(supabase/seed.sql)과 id 를 동일하게 유지한다.
// audioUrl 은 public/audio/ 아래 파일을 가리킨다.
export const SONG_CATALOG = [
  {
    id: 'song-001',
    title: 'TODO 곡 제목 1',
    artist: 'TODO 아티스트',
    audioUrl: '/audio/sample-01.mp3',
    licenseNote: 'TODO 사용 허가 근거',
  },
  {
    id: 'song-002',
    title: 'TODO 곡 제목 2',
    artist: 'TODO 아티스트',
    audioUrl: '/audio/sample-02.mp3',
    licenseNote: 'TODO 사용 허가 근거',
  },
];

export function findSong(songId) {
  return SONG_CATALOG.find((song) => song.id === songId) ?? null;
}
