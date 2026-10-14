-- 시연용 곡 카탈로그. src/data/songCatalog.js 와 id 를 동일하게 유지한다.
insert into public.songs (id, title, artist, audio_url, license_note) values
  ('song-001', 'TODO 곡 제목 1', 'TODO 아티스트', '/audio/sample-01.mp3', 'TODO 사용 허가 근거'),
  ('song-002', 'TODO 곡 제목 2', 'TODO 아티스트', '/audio/sample-02.mp3', 'TODO 사용 허가 근거')
on conflict (id) do nothing;
