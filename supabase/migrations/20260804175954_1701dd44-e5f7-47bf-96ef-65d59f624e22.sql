-- Remove permissive anon/authenticated write policies
DROP POLICY IF EXISTS "Public can update donors" ON public.donors;
DROP POLICY IF EXISTS "Public can delete donors" ON public.donors;
DROP POLICY IF EXISTS "Public can update requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Public can delete requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Public can update sos" ON public.sos_alerts;
DROP POLICY IF EXISTS "Public can delete sos" ON public.sos_alerts;

REVOKE UPDATE, DELETE ON public.donors FROM anon;
REVOKE UPDATE, DELETE ON public.blood_requests FROM anon;
REVOKE UPDATE, DELETE ON public.sos_alerts FROM anon;

GRANT UPDATE, DELETE ON public.donors TO authenticated;
GRANT UPDATE, DELETE ON public.blood_requests TO authenticated;
GRANT UPDATE, DELETE ON public.sos_alerts TO authenticated;
GRANT ALL ON public.donors TO service_role;
GRANT ALL ON public.blood_requests TO service_role;
GRANT ALL ON public.sos_alerts TO service_role;

CREATE POLICY "Admins can update donors" ON public.donors
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete donors" ON public.donors
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update requests" ON public.blood_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete requests" ON public.blood_requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sos" ON public.sos_alerts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete sos" ON public.sos_alerts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));