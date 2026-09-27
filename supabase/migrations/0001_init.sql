-- ============================================================================
-- SHAGAF — initial schema
-- Run this once against a fresh Supabase project (SQL Editor, or supabase db push).
-- Safe to re-run only after a full reset: objects are created with IF NOT EXISTS
-- where practical, but this is a from-scratch migration, not an idempotent patch.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('learner', 'teacher', 'school_admin', 'super_admin');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type course_mode as enum ('online', 'offline', 'hybrid');
create type course_status as enum ('draft', 'pending', 'published', 'rejected');
create type school_status as enum ('pending', 'approved', 'rejected');
create type ad_status as enum ('pending', 'approved', 'rejected', 'expired');
create type ad_target as enum ('school', 'course', 'event');
create type subscription_plan as enum ('free', 'basic', 'pro', 'enterprise');
create type enrollment_status as enum ('active', 'completed', 'cancelled');
create type transaction_status as enum ('pending', 'succeeded', 'failed', 'refunded');
create type favorite_target as enum ('course', 'school', 'teacher');

-- ---------------------------------------------------------------------------
-- profiles — one row per auth.users row, created by trigger on signup
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'learner',
  full_name text not null,
  avatar_url text,
  bio text,
  headline text,
  skills text[],
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- schools
-- ---------------------------------------------------------------------------
create table schools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  location text,
  website_url text,
  contact_email text,
  contact_phone text,
  status school_status not null default 'pending',
  subscription_plan subscription_plan not null default 'free',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table school_teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  teacher_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (school_id, teacher_id)
);

-- ---------------------------------------------------------------------------
-- courses & lessons
-- ---------------------------------------------------------------------------
create table courses (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete set null,
  teacher_id uuid not null references profiles(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  level course_level not null default 'beginner',
  mode course_mode not null default 'online',
  language text not null default 'en',
  price_dzd numeric(10, 2) not null default 0,
  status course_status not null default 'draft',
  duration_hours numeric(5, 1),
  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  students_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  order_index integer not null,
  duration_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, order_index)
);

-- ---------------------------------------------------------------------------
-- enrollments & progress
-- ---------------------------------------------------------------------------
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (learner_id, course_id)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references course_lessons(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (learner_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- certificates, reviews, favorites
-- ---------------------------------------------------------------------------
create table certificates (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  certificate_code text not null unique,
  issued_at timestamptz not null default now(),
  unique (learner_id, course_id)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (learner_id, course_id)
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  target_type favorite_target not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (learner_id, target_type, target_id)
);

-- ---------------------------------------------------------------------------
-- advertisements, notifications, transactions, settings
-- ---------------------------------------------------------------------------
create table advertisements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  target_type ad_target not null,
  target_id uuid,
  title text not null,
  image_url text,
  status ad_status not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Forward-looking structure for Section 38/39 — not wired to a real payment
-- gateway in the MVP. Enrollment does not require a row here yet.
create table transactions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  school_id uuid references schools(id) on delete set null,
  amount_dzd numeric(10, 2) not null,
  status transaction_status not null default 'pending',
  provider text,
  created_at timestamptz not null default now()
);

create table platform_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_courses_school on courses(school_id);
create index idx_courses_teacher on courses(teacher_id);
create index idx_courses_category on courses(category_id);
create index idx_courses_status on courses(status);
create index idx_lessons_course on course_lessons(course_id);
create index idx_enrollments_learner on enrollments(learner_id);
create index idx_enrollments_course on enrollments(course_id);
create index idx_progress_learner on lesson_progress(learner_id);
create index idx_reviews_course on reviews(course_id);
create index idx_favorites_learner on favorites(learner_id);
create index idx_school_teachers_school on school_teachers(school_id);
create index idx_ads_school on advertisements(school_id);
create index idx_notifications_user on notifications(user_id, read);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger trg_schools_updated before update on schools
  for each row execute function set_updated_at();
create trigger trg_courses_updated before update on courses
  for each row execute function set_updated_at();
create trigger trg_lessons_updated before update on course_lessons
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- Reads role/full_name out of the signup call's `options.data` payload.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'learner'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Keep courses.rating_avg / rating_count in sync with reviews
-- ---------------------------------------------------------------------------
create or replace function refresh_course_rating()
returns trigger as $$
declare
  target_course uuid := coalesce(new.course_id, old.course_id);
begin
  update courses c
  set rating_avg = coalesce((select round(avg(rating)::numeric, 1) from reviews where course_id = target_course), 0),
      rating_count = (select count(*) from reviews where course_id = target_course)
  where c.id = target_course;
  return null;
end;
$$ language plpgsql;

create trigger trg_reviews_rating
  after insert or update or delete on reviews
  for each row execute function refresh_course_rating();

-- ---------------------------------------------------------------------------
-- Keep courses.students_count in sync with enrollments
-- ---------------------------------------------------------------------------
create or replace function refresh_students_count()
returns trigger as $$
declare
  target_course uuid := coalesce(new.course_id, old.course_id);
begin
  update courses c
  set students_count = (select count(*) from enrollments where course_id = target_course and status <> 'cancelled')
  where c.id = target_course;
  return null;
end;
$$ language plpgsql;

create trigger trg_enrollments_count
  after insert or update or delete on enrollments
  for each row execute function refresh_students_count();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table schools enable row level security;
alter table school_teachers enable row level security;
alter table courses enable row level security;
alter table course_lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table certificates enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table advertisements enable row level security;
alter table notifications enable row level security;
alter table transactions enable row level security;
alter table categories enable row level security;
alter table platform_settings enable row level security;

-- Helper: current user's role, without recursive RLS lookups
create or replace function auth_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function is_admin()
returns boolean as $$
  select auth_role() = 'super_admin';
$$ language sql stable security definer set search_path = public;

-- profiles ------------------------------------------------------------------
create policy "profiles are publicly readable" on profiles
  for select using (true);
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);
create policy "admin manages profiles" on profiles
  for all using (is_admin());

-- categories ------------------------------------------------------------------
create policy "categories are publicly readable" on categories
  for select using (true);
create policy "admin manages categories" on categories
  for all using (is_admin());

-- schools ---------------------------------------------------------------------
create policy "approved schools are publicly readable" on schools
  for select using (status = 'approved' or owner_id = auth.uid() or is_admin());
create policy "school admin creates own school" on schools
  for insert with check (owner_id = auth.uid() and auth_role() = 'school_admin');
create policy "school admin updates own school" on schools
  for update using (owner_id = auth.uid() or is_admin());
create policy "admin deletes schools" on schools
  for delete using (is_admin());

-- school_teachers ---------------------------------------------------------------
create policy "school roster readable by school + teacher + admin" on school_teachers
  for select using (
    teacher_id = auth.uid()
    or is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "school admin manages roster" on school_teachers
  for all using (
    exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
    or is_admin()
  );

-- courses -----------------------------------------------------------------------
create policy "published courses are publicly readable" on courses
  for select using (
    status = 'published'
    or teacher_id = auth.uid()
    or is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "teacher creates own course" on courses
  for insert with check (teacher_id = auth.uid() and auth_role() in ('teacher', 'school_admin'));
create policy "teacher or school updates own course" on courses
  for update using (
    teacher_id = auth.uid()
    or is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "teacher or school deletes own course" on courses
  for delete using (
    teacher_id = auth.uid()
    or is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );

-- course_lessons ------------------------------------------------------------------
create policy "lessons readable if course readable" on course_lessons
  for select using (
    exists (
      select 1 from courses c
      where c.id = course_id
        and (c.status = 'published' or c.teacher_id = auth.uid() or is_admin())
    )
  );
create policy "course owner manages lessons" on course_lessons
  for all using (
    exists (select 1 from courses c where c.id = course_id and c.teacher_id = auth.uid())
    or is_admin()
  );

-- enrollments ------------------------------------------------------------------
create policy "learner reads own enrollments" on enrollments
  for select using (
    learner_id = auth.uid()
    or is_admin()
    or exists (select 1 from courses c where c.id = course_id and c.teacher_id = auth.uid())
  );
create policy "learner enrolls self" on enrollments
  for insert with check (learner_id = auth.uid());
create policy "learner updates own enrollment" on enrollments
  for update using (learner_id = auth.uid() or is_admin());

-- lesson_progress ------------------------------------------------------------------
create policy "learner manages own progress" on lesson_progress
  for all using (learner_id = auth.uid() or is_admin());

-- certificates ------------------------------------------------------------------
create policy "certificates readable by owner, issuer, admin" on certificates
  for select using (
    learner_id = auth.uid()
    or is_admin()
    or exists (select 1 from courses c where c.id = course_id and c.teacher_id = auth.uid())
  );
create policy "system issues certificates" on certificates
  for insert with check (learner_id = auth.uid());

-- reviews ------------------------------------------------------------------
create policy "reviews are publicly readable" on reviews
  for select using (true);
create policy "learner writes own review" on reviews
  for insert with check (
    learner_id = auth.uid()
    and exists (
      select 1 from enrollments e
      where e.learner_id = auth.uid() and e.course_id = reviews.course_id
    )
  );
create policy "learner edits own review" on reviews
  for update using (learner_id = auth.uid());
create policy "learner deletes own review" on reviews
  for delete using (learner_id = auth.uid() or is_admin());

-- favorites ------------------------------------------------------------------
create policy "learner manages own favorites" on favorites
  for all using (learner_id = auth.uid());

-- advertisements ------------------------------------------------------------------
create policy "approved ads are publicly readable" on advertisements
  for select using (
    status = 'approved'
    or is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "school creates own ads" on advertisements
  for insert with check (
    exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "school updates own ads, admin moderates" on advertisements
  for update using (
    is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
create policy "school deletes own ads" on advertisements
  for delete using (
    is_admin()
    or exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );

-- notifications ------------------------------------------------------------------
create policy "user reads own notifications" on notifications
  for select using (user_id = auth.uid());
create policy "user marks own notifications read" on notifications
  for update using (user_id = auth.uid());
create policy "system inserts notifications" on notifications
  for insert with check (true);

-- transactions ------------------------------------------------------------------
create policy "learner reads own transactions" on transactions
  for select using (learner_id = auth.uid() or is_admin());
create policy "learner creates own transaction" on transactions
  for insert with check (learner_id = auth.uid());

-- platform_settings ------------------------------------------------------------------
create policy "settings are publicly readable" on platform_settings
  for select using (true);
create policy "admin manages settings" on platform_settings
  for all using (is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('school-logos', 'school-logos', true),
  ('course-thumbnails', 'course-thumbnails', true),
  ('lesson-materials', 'lesson-materials', false)
on conflict (id) do nothing;

create policy "avatar images are publicly readable" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "users upload own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "school logos are publicly readable" on storage.objects
  for select using (bucket_id = 'school-logos');
create policy "school admins upload own logo" on storage.objects
  for insert with check (bucket_id = 'school-logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "course thumbnails are publicly readable" on storage.objects
  for select using (bucket_id = 'course-thumbnails');
create policy "teachers upload course thumbnails" on storage.objects
  for insert with check (bucket_id = 'course-thumbnails' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "lesson materials readable by enrolled + owner" on storage.objects
  for select using (
    bucket_id = 'lesson-materials' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "teachers upload lesson materials" on storage.objects
  for insert with check (bucket_id = 'lesson-materials' and auth.uid()::text = (storage.foldername(name))[1]);
