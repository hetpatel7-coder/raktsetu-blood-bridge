
-- Hide donor phone numbers from anonymous users
-- 1. Restrict base donors SELECT to authenticated users (they get phone)
DROP POLICY IF EXISTS "Anyone can view donors" ON public.donors;

CREATE POLICY "Authenticated users can view donors"
  ON public.donors FOR SELECT
  TO authenticated
  USING (true);

-- 2. Public view exposing non-sensitive columns (no phone) for anonymous browsing
CREATE OR REPLACE VIEW public.donors_public
WITH (security_invoker = on) AS
SELECT id, name, blood_type, city, available, donations_count, verified, lat, lng, created_at
FROM public.donors;

GRANT SELECT ON public.donors_public TO anon, authenticated;

-- 3. Allow anon to read the underlying rows ONLY through the view via a column-less SELECT policy
-- security_invoker requires base-table access; add a policy that allows anon SELECT but the view excludes phone.
CREATE POLICY "Anyone can view donors via public view"
  ON public.donors FOR SELECT
  TO anon
  USING (true);

-- Note: anon can technically still SELECT phone from base table; to truly hide phone we use security_invoker=off.
-- Switch the view to definer (security_invoker=off) so anon does NOT need base-table access, then drop the anon policy.
DROP POLICY "Anyone can view donors via public view" ON public.donors;

ALTER VIEW public.donors_public SET (security_invoker = off);

-- 4. Remove donors and sos_alerts from realtime publication (not consumed by client; reduces leak via Realtime).
ALTER PUBLICATION supabase_realtime DROP TABLE public.donors;
ALTER PUBLICATION supabase_realtime DROP TABLE public.sos_alerts;
