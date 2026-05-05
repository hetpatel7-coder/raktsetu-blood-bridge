
-- Ensure anon and authenticated roles have base table privileges (RLS still applies)
GRANT SELECT, INSERT ON public.donors TO anon, authenticated;
GRANT SELECT, INSERT ON public.blood_requests TO anon, authenticated;
GRANT SELECT, INSERT ON public.sos_alerts TO anon, authenticated;
GRANT UPDATE, DELETE ON public.donors TO authenticated;
GRANT UPDATE, DELETE ON public.blood_requests TO authenticated;
GRANT UPDATE, DELETE ON public.sos_alerts TO authenticated;

-- Replace donor SELECT policies with a single permissive public-read policy
DROP POLICY IF EXISTS "Anon can view donor non-sensitive columns" ON public.donors;
DROP POLICY IF EXISTS "Authenticated users can view donors" ON public.donors;
CREATE POLICY "Public can view donors"
  ON public.donors FOR SELECT
  TO anon, authenticated
  USING (true);
