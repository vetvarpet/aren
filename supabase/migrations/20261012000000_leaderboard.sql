-- ════════════════════════════════════════════════════════════════════
--  Golden Games — world leaderboard, version 1
--
--  Aren's rules, as he set them:
--    1. Names: a nickname or a surname is fine. Age, school, address,
--       phone number and email are not.
--    2. Cheating: every game has a ceiling, a score above it is refused.
--       One record per minute per player.
--    3. The director's button: only Aren and his father can delete.
--
--  How it is locked down:
--    • RLS is on and there are NO table policies for the public roles,
--      so nobody can read or write the table directly — not even with the
--      anon key, which ships inside the web page and is public by design.
--    • Everything goes through four functions below. They check who is
--      calling (auth.uid(), from Supabase anonymous sign-in), validate,
--      rate-limit, and only ever return names, scores and dates.
--
--  Needs, in the dashboard: Authentication → Sign In / Providers →
--  "Allow anonymous sign-ins" switched on. Each phone then gets its own
--  quiet identity without an email or a password.
-- ════════════════════════════════════════════════════════════════════


-- ─── The games the site knows ───────────────────────────────────────
-- A score for any other game id is refused, so nobody can invent games.
-- max_score is the anti-cheat ceiling. These are PLACEHOLDERS, set
-- generously so that no honest score is ever refused on day one; tighten
-- them once real scores show what each game can actually produce.
create table public.games (
  id              text primary key,
  max_score       integer not null check (max_score > 0),
  lower_is_better boolean not null default false
);

insert into public.games (id, max_score) values
  ('cat-jump', 100000), ('city-drive', 100000), ('piano', 100000), ('rocket', 100000),
  ('memory', 100000),   ('fishing', 100000),    ('duel', 100000),  ('maze', 100000),
  ('tower', 100000),    ('moles', 100000),      ('beat', 100000),  ('ninja', 100000),
  ('men', 100000),      ('runner', 100000),     ('pipes', 100000), ('blocks', 100000),
  ('words', 100000),    ('drums', 100000),      ('map', 100000),   ('story', 100000),
  ('bridge', 100000),   ('detective', 100000),  ('elevator', 100000), ('traffic', 100000),
  ('garden', 100000),   ('bank', 100000),       ('camera', 100000), ('wire', 100000),
  ('wind', 100000),     ('domino', 100000),     ('copy', 100000),  ('alphabet', 100000),
  ('nardi', 100000),    ('lavash', 100000),     ('dance', 100000), ('sasuntsi', 100000),
  ('rewind', 100000),   ('two', 100000),        ('mirror', 100000), ('grow', 100000),
  ('silence', 100000),  ('onelife', 100000),    ('slow', 100000),  ('swap', 100000),
  ('poly', 100000),     ('online', 100000),     ('rise', 100000);

-- Golden Memory counts moves: fewer is better.
update public.games set lower_is_better = true where id = 'memory';


-- ─── Rule 1: is this name allowed? ──────────────────────────────────
-- What a machine can catch reliably, it refuses here: emails, phone
-- numbers, links, and the obvious words for age, school and street in
-- Armenian, Russian and English. What it cannot catch — a school's real
-- name, say — is exactly what the director's delete button is for.
create function public.name_ok(n text)
returns boolean
language sql
immutable
as $$
  select n is not null
     and char_length(btrim(n)) between 1 and 20
     and n !~ '@'                                         -- email
     and n !~ '[0-9].*[0-9].*[0-9].*[0-9].*[0-9]'          -- 5+ digits: a phone number
     and n !~* '(https?://|www\.|\.com|\.am|\.ru|\.net|\.org)'  -- links
     and n !~* '(տարեկ|տարիք|years? ?old|лет|годик|возраст)'   -- age
     and n !~* '(դպրոց|школ|school|լիցեյ|лице|гимназ)'         -- school
     and n !~* '(փողոց|улиц|street|проспект|պողոտա)'          -- address
$$;


-- ─── The scores ─────────────────────────────────────────────────────
-- One row per player per game; it only ever holds that player's best.
create table public.scores (
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

create index scores_board on public.scores (game, score desc);

alter table public.scores enable row level security;
alter table public.games  enable row level security;
-- No policies on purpose: direct access is closed to everyone but the
-- functions below, which run as the table owner.


-- ─── Rule 3: who may delete ─────────────────────────────────────────
-- Filled by hand in the dashboard with the user ids of Aren and Kamo.
create table public.admins (
  user_id uuid primary key,
  label   text
);
alter table public.admins enable row level security;


-- ─── Sending a score ────────────────────────────────────────────────
create function public.submit_score(p_game text, p_name text, p_score integer)
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

  -- rule 2: one record per minute, across all games
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
create function public.top_scores(p_game text, p_limit integer default 20)
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
-- Deletes one entry by name and game. Refuses anyone not in admins.
create function public.admin_delete(p_game text, p_name text)
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
-- Careful: revoking from PUBLIC is not enough on Supabase. Its default
-- privileges grant EXECUTE on every new function straight to anon and
-- authenticated, so those direct grants have to be taken away by name.
-- (Caught by testing this file against Supabase's real default grants.)
revoke all on function public.submit_score(text, text, integer) from public, anon, authenticated;
revoke all on function public.top_scores(text, integer)         from public, anon, authenticated;
revoke all on function public.admin_delete(text, text)          from public, anon, authenticated;
revoke all on function public.name_ok(text)                     from public, anon, authenticated;

grant execute on function public.top_scores(text, integer)         to anon, authenticated;
grant execute on function public.submit_score(text, text, integer) to authenticated;
grant execute on function public.admin_delete(text, text)          to authenticated;
