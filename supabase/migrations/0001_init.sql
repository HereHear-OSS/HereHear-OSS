-- HereHear 초기 스키마 (Supabase SQL Editor 에서 실행하거나 supabase CLI 마이그레이션으로 사용)
-- 사전 준비: Authentication > Providers > "Anonymous sign-ins" 활성화
-- 정책 숫자(2000m, 1~200자)는 src/constants/policy.js 와 항상 같게 유지할 것.

create extension if not exists postgis with schema extensions;

-- ───────── 테이블 ─────────
create table public.songs (
  id           text primary key,
  title        text not null,
  artist       text not null,
  audio_url    text not null,
  license_note text
);

create table public.footprints (
  id          uuid primary key default gen_random_uuid(),
  song_id     text not null references public.songs(id),
  message     text not null check (char_length(btrim(message)) between 1 and 200),
  location    geography(Point, 4326) not null,   -- 미터 단위 거리 계산(ST_DWithin / ST_Distance)
  author_id   uuid not null default auth.uid(),  -- 익명 작성자 ID
  created_at  timestamptz not null default now()
);
create index footprints_location_gix on public.footprints using gist (location);
create index footprints_song_idx     on public.footprints (song_id);

-- (익명 사용자, 등록 기록) 조합을 기본 키로 → 중복 좋아요/즐겨찾기를 DB 가 막아준다
create table public.likes (
  user_id      uuid not null default auth.uid(),
  footprint_id uuid not null references public.footprints(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, footprint_id)
);

create table public.favorites (
  user_id      uuid not null default auth.uid(),
  footprint_id uuid not null references public.footprints(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, footprint_id)
);

-- ───────── 접근 정책 (RLS) ─────────
-- footprints/likes/favorites 는 정책을 만들지 않는다 = 클라이언트의 직접 접근 차단.
-- 모든 읽기/쓰기는 아래 security definer 함수(RPC)를 통해서만 이뤄진다.
alter table public.songs      enable row level security;
alter table public.footprints enable row level security;
alter table public.likes      enable row level security;
alter table public.favorites  enable row level security;

create policy "songs are readable" on public.songs for select using (true);

-- ───────── RPC 함수 ─────────

-- [구현됨] 마커 목록: 상세(메시지)는 주지 않고 위치/곡 ID 만 반환
create or replace function public.get_footprint_markers()
returns table (id uuid, song_id text, lat double precision, lng double precision)
language sql security definer set search_path = public, extensions
as $$
  select f.id, f.song_id, st_y(f.location::geometry), st_x(f.location::geometry)
  from public.footprints f;
$$;

-- [TODO 10주] 상세 조회
-- 1) 사용자 좌표(p_lat, p_lng) 와 footprint 의 거리가 2000m 이하인지 검사 (ST_DWithin)
-- 2) 반경 밖이면 예외 발생 (예: raise exception 'OUT_OF_RADIUS')
-- 3) 곡 정보 + 메시지 + 좋아요 수 + 내가 좋아요/즐겨찾기 했는지를 jsonb 로 반환 (auth.uid() 사용)
create or replace function public.get_footprint_detail(
  p_footprint_id uuid, p_lat double precision, p_lng double precision
) returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  raise exception 'NOT_IMPLEMENTED';
end;
$$;

-- [TODO 7~8주] 등록
-- 1) 메시지 trim 후 1~200자 검사, p_song_id 가 songs 에 존재하는지 검사
-- 2) 곡별 트랜잭션 락: perform pg_advisory_xact_lock(hashtext(p_song_id));  → 동시 요청 중복 방지
-- 3) 같은 song_id 이면서 2000m 이하인 기존 footprint 가 있으면 raise exception 'DUPLICATE_SONG'
-- 4) insert 후 새 footprint id 반환
create or replace function public.create_footprint(
  p_song_id text, p_message text, p_lat double precision, p_lng double precision
) returns uuid
language plpgsql security definer set search_path = public, extensions
as $$
begin
  raise exception 'NOT_IMPLEMENTED';
end;
$$;

-- [TODO 11주] 좋아요 토글: 있으면 delete, 없으면 insert → {active, count} 반환
create or replace function public.toggle_like(p_footprint_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  raise exception 'NOT_IMPLEMENTED';
end;
$$;

-- [TODO 12주] 즐겨찾기 토글 → {active} 반환
create or replace function public.toggle_favorite(p_footprint_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  raise exception 'NOT_IMPLEMENTED';
end;
$$;

-- [TODO 12주] 내 즐겨찾기 목록 (auth.uid() 기준)
create or replace function public.get_my_favorites()
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  raise exception 'NOT_IMPLEMENTED';
end;
$$;

-- 익명 로그인 사용자(authenticated 역할)만 호출 가능
revoke all on function public.get_footprint_markers() from public;
revoke all on function public.get_footprint_detail(uuid, double precision, double precision) from public;
revoke all on function public.create_footprint(text, text, double precision, double precision) from public;
revoke all on function public.toggle_like(uuid) from public;
revoke all on function public.toggle_favorite(uuid) from public;
revoke all on function public.get_my_favorites() from public;

grant execute on function public.get_footprint_markers() to authenticated;
grant execute on function public.get_footprint_detail(uuid, double precision, double precision) to authenticated;
grant execute on function public.create_footprint(text, text, double precision, double precision) to authenticated;
grant execute on function public.toggle_like(uuid) to authenticated;
grant execute on function public.toggle_favorite(uuid) to authenticated;
grant execute on function public.get_my_favorites() to authenticated;
