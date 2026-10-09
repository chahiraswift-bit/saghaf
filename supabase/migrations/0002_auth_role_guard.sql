create or replace function prevent_profile_role_change()
returns trigger as $$
begin
  if new.role is distinct from old.role
    and coalesce(auth.role(), '') <> 'service_role'
    and current_user <> 'postgres' then
    raise exception 'Profile roles can only be changed by a trusted administrator.';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_role_guard on profiles;
create trigger trg_profiles_role_guard
  before update of role on profiles
  for each row execute function prevent_profile_role_change();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' in ('learner', 'teacher', 'school_admin')
        then (new.raw_user_meta_data->>'role')::user_role
      else 'learner'::user_role
    end,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;