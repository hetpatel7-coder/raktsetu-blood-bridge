
DROP POLICY IF EXISTS "Admins can update donors" ON public.donors;
DROP POLICY IF EXISTS "Admins can delete donors" ON public.donors;
DROP POLICY IF EXISTS "Admins can update requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Admins can delete requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Admins can update sos" ON public.sos_alerts;
DROP POLICY IF EXISTS "Admins can delete sos" ON public.sos_alerts;

GRANT UPDATE, DELETE ON public.donors TO anon;
GRANT UPDATE, DELETE ON public.blood_requests TO anon;
GRANT UPDATE, DELETE ON public.sos_alerts TO anon;

CREATE POLICY "Public can update donors" ON public.donors FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete donors" ON public.donors FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public can update requests" ON public.blood_requests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete requests" ON public.blood_requests FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public can update sos" ON public.sos_alerts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete sos" ON public.sos_alerts FOR DELETE TO anon, authenticated USING (true);
