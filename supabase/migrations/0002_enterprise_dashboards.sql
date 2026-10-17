-- Enterprise accounts, employee rosters, course assignments and training requests.
alter type user_role add value if not exists 'company_admin';
alter table profiles add column account_status text not null default 'active'
  check (account_status in ('active', 'suspended'));

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' in ('learner', 'teacher', 'school_admin', 'company_admin')
        then (new.raw_user_meta_data->>'role')::user_role
      else 'learner'::user_role
    end,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create type company_status as enum ('pending', 'approved', 'suspended');
create type training_request_status as enum ('submitted', 'in_review', 'quoted', 'approved', 'declined', 'completed');

create table companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references profiles(id) on delete cascade,
  name text not null,
  legal_name text,
  sector text,
  location text,
  contact_email text,
  status company_status not null default 'pending',
  seats_allocated integer not null default 0 check (seats_allocated >= 0),
  training_budget_dzd numeric(12, 2) not null default 0 check (training_budget_dzd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table company_employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  email text not null,
  full_name text,
  department text,
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  unique (company_id, email),
  unique (company_id, user_id),
  unique (company_id, id)
);

create table company_course_assignments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  employee_id uuid not null,
  course_id uuid not null references courses(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (employee_id, course_id),
  foreign key (company_id, employee_id) references company_employees(company_id, id) on delete cascade
);

create table training_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  title text not null,
  objectives text not null,
  target_seats integer not null check (target_seats > 0),
  status training_request_status not null default 'submitted',
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function guard_privileged_dashboard_fields()
returns trigger as $$
begin
  if tg_table_name = 'profiles'
    and new.account_status is distinct from old.account_status
    and not is_admin() and current_user <> 'postgres' then
    raise exception 'Only a platform administrator may change account access status.';
  end if;
  if tg_table_name = 'schools'
    and (new.status is distinct from old.status or new.verified is distinct from old.verified)
    and not is_admin() and current_user <> 'postgres' then
    raise exception 'Only a platform administrator may verify or reject a school.';
  end if;
  if tg_table_name = 'companies'
    and new.status is distinct from old.status
    and not is_admin() and current_user <> 'postgres' then
    raise exception 'Only a platform administrator may change company verification status.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_guard_profile_access before update of account_status on profiles
  for each row execute function guard_privileged_dashboard_fields();
create trigger trg_guard_school_verification before update of status, verified on schools
  for each row execute function guard_privileged_dashboard_fields();
create trigger trg_guard_company_verification before update of status on companies
  for each row execute function guard_privileged_dashboard_fields();

create index idx_company_employees_company on company_employees(company_id);
create index idx_company_assignments_company on company_course_assignments(company_id);
create index idx_training_requests_company on training_requests(company_id);
create trigger trg_companies_updated before update on companies for each row execute function set_updated_at();

alter table companies enable row level security;
alter table company_employees enable row level security;
alter table company_course_assignments enable row level security;
alter table training_requests enable row level security;
alter table audit_logs enable row level security;

create policy "company admins manage own company" on companies for all
  using (owner_id = auth.uid() or is_admin())
  with check ((owner_id = auth.uid() and auth_role()::text = 'company_admin') or is_admin());
create policy "company admins manage employee roster" on company_employees for all
  using (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())))
  with check (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())));
create policy "employees read their own roster entry" on company_employees for select
  using (user_id = auth.uid());
create policy "company admins manage course assignments" on company_course_assignments for all
  using (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())))
  with check (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())));
create policy "company admins manage training requests" on training_requests for all
  using (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())))
  with check (exists (select 1 from companies c where c.id = company_id and (c.owner_id = auth.uid() or is_admin())));
create policy "administrators read audit log" on audit_logs for select using (is_admin());
create policy "administrators write audit log" on audit_logs for insert with check (actor_id = auth.uid() and is_admin());
