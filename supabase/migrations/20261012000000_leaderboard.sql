-- ════════════════════════════════════════════════════════════════════
--  Golden Games — world leaderboard
--
--  HOW TO RUN: paste this WHOLE file into a new query in the Supabase
--  SQL Editor, make sure nothing is highlighted, and press Run.
--  It is safe to run more than once, and safe to run on top of an
--  earlier attempt that stopped halfway.
--
--  Aren's rules, as he set them:
--    1. Names: a nickname or a surname is fine. Age, school, address,
--       phone number and email are not.
--    2. Cheating: every record has a ceiling, a score above it is
--       refused. One record per minute per player.
--    3. The director's button: only Aren and his father can delete.
--
--  How it is locked down:
--    • RLS is on and there are NO table policies for the public roles,
--      so nobody can read or write the tables directly — not even with
--      the publishable key, which ships inside the web page.
--    • Everything goes through three functions below. They check who is
--      calling (auth.uid(), from Supabase anonymous sign-in), validate,
--      rate-limit, and only ever return names, scores and dates.
--
--  Needs, in the dashboard: Authentication → Sign In / Providers →
--  "Allow anonymous sign-ins" switched on.
-- ════════════════════════════════════════════════════════════════════


-- ─── The records the site keeps ─────────────────────────────────────
-- One board per record, under the exact localStorage key the game
-- already writes. Golden Memory keeps three, Golden Cat two. A score for
-- any other key is refused, so nobody can invent boards.
-- max_score is the anti-cheat ceiling. These are PLACEHOLDERS, set high
-- so no honest score is refused on day one; tighten them once real
-- scores show what each game actually produces.
create table if not exists public.games (
  id              text primary key,
  max_score       integer not null check (max_score > 0),
  lower_is_better boolean not null default false
);

insert into public.games (id, max_score) values
  ('cat-best', 100000),            ('aren-bird-best', 100000),      ('aren-rocket-best', 100000),
  ('aren-fish-best', 100000),      ('aren-tower-best', 100000),     ('aren-moles-best', 100000),
  ('aren-maze-max', 100000),       ('aren-race-level', 100000),     ('aren-memory-best', 100000),
  ('aren-repeat-best', 100000),    ('aren-numbers-best', 100000),   ('aren-beat-best', 100000),
  ('aren-ninja-best', 100000),     ('aren-men-best', 100000),       ('aren-runner-best', 100000),
  ('aren-pipes-level', 100000),    ('aren-blocks-best', 100000),    ('aren-words-level', 100000),
  ('aren-map-best', 100000),       ('aren-story-ends', 100000),     ('aren-bridge-level', 100000),
  ('aren-detective-best', 100000), ('aren-elevator-best', 100000),  ('aren-traffic-best', 100000),
  ('aren-garden-best', 100000),    ('aren-bank-best', 100000),      ('aren-camera-best', 100000),
  ('aren-wire-level', 100000),     ('aren-wind-level', 100000),     ('aren-domino-level', 100000),
  ('aren-copy-best', 100000),      ('aren-alphabet-best', 100000),  ('aren-nardi-best', 100000),
  ('aren-lavash-best', 100000),    ('aren-dance-best', 100000),     ('aren-sasuntsi-best', 100000),
  ('aren-rewind-best', 100000),    ('aren-two-best', 100000),       ('aren-mirror-best', 100000),
  ('aren-grow-best', 100000),      ('aren-silence-best', 100000),   ('aren-onelife-best', 100000),
  ('aren-slow-best', 100000),      ('aren-swap-best', 100000),      ('aren-poly-best', 100000),
  ('aren-online-best', 100000),    ('aren-rise-best', 100000)
on conflict (id) do nothing;

-- Golden Memory's pairs count moves: fewer is better.
update public.games set lower_is_better = (id = 'aren-memory-best');


-- ─── Rule 1: is this name allowed? ──────────────────────────────────
-- What a machine can catch reliably, it refuses here: emails, phone
-- numbers, links, and the obvious words for age, school and street in
-- Armenian, Russian and English. What it cannot catch — a school's real
-- name, say — is exactly what the director's delete button is for.
create or replace function public.name_ok(n text)
returns boolean
language sql
immutable
as $$
  select n is not null
     and char_length(btrim(n)) between 1 and 20
     and n !~ '@'                                               -- email
     and n !~ '[0-9].*[0-9].*[0-9].*[0-9].*[0-9]'                -- 5+ digits: a phone number
     and n !~* '(https?://|www\.|\.com|\.am|\.ru|\.net|\.org)'   -- links
     and n !~* '(տարեկ|տարիք|years? ?old|лет|годик|возраст)'      -- age
     and n !~* '(դպրոց|школ|school|լիցեյ|лице|гимназ)'            -- school
     and n !~* '(փողոց|улиц|street|проспект|պողոտա)'             -- address
$$;


-- ─── The scores ─────────────────────────────────────────────────────
-- One row per player per record; it only ever holds that player's best.
create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  player     uuid not null references auth.users(id) on delete cascade,
  game       text not null references public.games(id),
  name       text not null check (public.name_ok(name)),
  score      integer not null check (score >= 0),
  flagged    boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player, game)
);

create index if not exists scores_board on public.scores (game, score desc);


-- ─── Rule 3: who may delete ─────────────────────────────────────────
-- Filled by hand in the dashboard with the user ids of Aren and Kamo.
create table if not exists public.admins (
  user_id uuid primary key,
  label   text
);


-- An earlier attempt may have left board ids that are game folders
-- rather than records. Drop the ones no score points at.
delete from public.games g
 where g.id not like 'aren-%' and g.id <> 'cat-best'
   and not exists (select 1 from public.scores s where s.game = g.id);


alter table public.games  enable row level security;
alter table public.scores enable row level security;
alter table public.admins enable row level security;
-- No policies on purpose: direct access is closed to everyone but the
-- functions below, which run as the table owner.


-- ─── Sending a score ────────────────────────────────────────────────
create or replace function public.submit_score(p_game text, p_name text, p_score integer)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me    uuid := auth.uid();
  g     public.games%rowtype;
  prev  public.scores%rowtype;
  best  integer;
begin
  if me is null then
    return 'not-signed-in';
  end if;

  select * into g from public.games where id = p_game;
  if not found then
    return 'unknown-game';
  end if;

  if not public.name_ok(p_name) then
    return 'bad-name';
  end if;

  if p_score is null or p_score < 0 or p_score > g.max_score then
    return 'too-high';                    -- rule 2: the ceiling
  end if;

  -- rule 2: one record per minute, across all boards
  if exists (select 1 from public.scores
              where player = me and updated_at > now() - interval '60 seconds') then
    return 'too-soon';
  end if;

  select * into prev from public.scores where player = me and game = p_game;

  if not found then
    insert into public.scores (player, game, name, score)
    values (me, p_game, btrim(p_name), p_score);
    return 'new';
  end if;

  best := case when g.lower_is_better then least(prev.score, p_score)
               else greatest(prev.score, p_score) end;

  if best = prev.score and btrim(p_name) = prev.name then
    return 'not-better';                  -- nothing changed, no write
  end if;

  update public.scores
     set score = best, name = btrim(p_name), updated_at = now()
   where id = prev.id;
  return case when best = prev.score then 'renamed' else 'better' end;
end;
$$;


-- ─── Reading a board ────────────────────────────────────────────────
-- Names, scores and dates only. The player id never leaves the database.
create or replace function public.top_scores(p_game text, p_limit integer default 20)
returns table (rank bigint, name text, score integer, at timestamptz, mine boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select row_number() over (order by
           case when g.lower_is_better then s.score end asc,
           case when not g.lower_is_better then s.score end desc,
           s.updated_at asc),
         s.name, s.score, s.updated_at,
         s.player = auth.uid()
    from public.scores s
    join public.games g on g.id = s.game
   where s.game = p_game and not s.flagged
   order by 1
   limit least(greatest(coalesce(p_limit, 20), 1), 100);
$$;


-- ─── The director's button ──────────────────────────────────────────
create or replace function public.admin_delete(p_game text, p_name text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  n integer;
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'not an admin';
  end if;
  delete from public.scores where game = p_game and name = p_name;
  get diagnostics n = row_count;
  return n;
end;
$$;


-- ─── Who may call what ──────────────────────────────────────────────
-- Revoking from PUBLIC is not enough on Supabase: its default
-- privileges grant EXECUTE on every new function straight to anon and
-- authenticated, so those direct grants are taken away by name too.
revoke all on function public.submit_score(text, text, integer) from public, anon, authenticated;
revoke all on function public.top_scores(text, integer)         from public, anon, authenticated;
revoke all on function public.admin_delete(text, text)          from public, anon, authenticated;
revoke all on function public.name_ok(text)                     from public, anon, authenticated;

grant execute on function public.top_scores(text, integer)         to anon, authenticated;
grant execute on function public.submit_score(text, text, integer) to authenticated;
grant execute on function public.admin_delete(text, text)          to authenticated;


-- ─── Done — this last line is what you should see in the results ────
select 'Golden Games leaderboard ready: '
       || (select count(*) from public.games)  || ' boards, '
       || (select count(*) from public.scores) || ' scores, '
       || (select count(*) from public.admins) || ' admins' as status;
