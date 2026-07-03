
-- Enable RLS on realtime.messages and add restrictive policies.
-- The app uses postgres_changes on public tables (donors, blood_requests, sos_alerts)
-- which is governed by the underlying tables' RLS, not realtime.messages.
-- Broadcast/presence channels are not used by the app; restrict to authenticated only.

ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can receive realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can send realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated can send realtime messages"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);
