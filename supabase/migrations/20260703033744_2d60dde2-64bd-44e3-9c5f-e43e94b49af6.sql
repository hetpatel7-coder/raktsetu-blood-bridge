
ALTER TABLE public.donors
  ADD COLUMN IF NOT EXISTS last_declaration_date timestamptz;

-- Nightly job: flip donors to unavailable if their last declaration is older than 56 days.
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'donors-expire-56d') THEN
    PERFORM cron.unschedule('donors-expire-56d');
  END IF;
END$$;

SELECT cron.schedule(
  'donors-expire-56d',
  '0 3 * * *',
  $$UPDATE public.donors
       SET available = false
     WHERE available = true
       AND last_declaration_date IS NOT NULL
       AND last_declaration_date < now() - interval '56 days';$$
);
