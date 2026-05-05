
-- Switch view back to security_invoker (no SECURITY DEFINER warning)
ALTER VIEW public.donors_public SET (security_invoker = on);

-- Allow anon to SELECT donors but restrict columns: revoke broad SELECT, then grant only non-sensitive columns
REVOKE SELECT ON public.donors FROM anon;
GRANT SELECT (id, name, blood_type, city, available, donations_count, verified, lat, lng, created_at)
  ON public.donors TO anon;

-- Re-add anon SELECT policy so RLS allows it (column privileges still gate phone access)
CREATE POLICY "Anon can view donor non-sensitive columns"
  ON public.donors FOR SELECT
  TO anon
  USING (true);
