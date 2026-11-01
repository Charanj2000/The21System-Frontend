-- Prevent duplicate cohorts created by racing auto-pick calls.
alter table public.cohorts
  add constraint cohorts_product_start_unique unique (product_id, start_date);

-- Prevent duplicate enrollments from racing verify-payment / webhook calls.
alter table public.enrollments
  add constraint enrollments_user_cohort_unique unique (user_id, cohort_id);

-- Auto-transition cohort status based on dates. Row-level trigger keeps the
-- column coherent on every read-after-write without needing a cron.
create or replace function public.cohorts_apply_status() returns trigger
language plpgsql as $$
declare
  today date := (now() at time zone 'utc')::date;
begin
  if new.end_date is not null and new.end_date < today then
    new.status := 'completed';
  elsif new.start_date is not null and new.start_date <= today then
    new.status := 'active';
  else
    new.status := 'upcoming';
  end if;
  return new;
end;
$$;

drop trigger if exists cohorts_apply_status_trigger on public.cohorts;
create trigger cohorts_apply_status_trigger
  before insert or update of start_date, end_date on public.cohorts
  for each row execute function public.cohorts_apply_status();

-- Nightly sweep so cohorts transition even without writes.
-- Requires the pg_cron extension (enabled by default on Supabase).
create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'cohorts-daily-status-sweep',
  '5 0 * * *',
  $$
    update public.cohorts
    set status = case
      when end_date < (now() at time zone 'utc')::date then 'completed'
      when start_date <= (now() at time zone 'utc')::date then 'active'
      else 'upcoming'
    end
    where status is distinct from case
      when end_date < (now() at time zone 'utc')::date then 'completed'
      when start_date <= (now() at time zone 'utc')::date then 'active'
      else 'upcoming'
    end;
  $$
);

-- Hourly cleanup of abandoned pending orders (older than 1 hour, never paid).
select cron.schedule(
  'payments-prune-stale-pending',
  '*/30 * * * *',
  $$
    delete from public.payments
    where status = 'pending'
      and created_at < now() - interval '1 hour';
  $$
);
