import { createServerFn } from "@tanstack/react-start";

/**
 * Public, intentionally narrow endpoints used by the Live Requests page.
 * They can ONLY flip a status field — they cannot delete rows or edit any
 * other column, unlike the previous anonymous write access at the table level.
 */
export const closeBloodRequest = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("Missing id");
    return data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blood_requests")
      .update({ status: "fulfilled" })
      .eq("id", data.id)
      .eq("status", "active");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const closeSosAlert = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("Missing id");
    return data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("sos_alerts")
      .update({ status: "resolved" })
      .eq("id", data.id)
      .eq("status", "active");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
