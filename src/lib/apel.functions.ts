import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as React from "react";
import { render } from "@react-email/components";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TEMPLATES } from "@/lib/email-templates/registry";

type AppRole = "admin" | "apel" | "user";

async function userHasAnyRole(userId: string, roles: AppRole[]) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", roles as any);
  return (data ?? []).length > 0;
}

const SITE_NAME = "BISP Paris";
const SENDER_DOMAIN = "notify.franceuniformes.fr";
const FROM_DOMAIN = "notify.franceuniformes.fr";

function genToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function renderAndEnqueue(params: {
  templateName: string;
  recipientEmail: string;
  templateData: Record<string, any>;
  idempotencyKey: string;
}) {
  const tpl = TEMPLATES[params.templateName];
  if (!tpl) throw new Error(`Template '${params.templateName}' not found`);
  const recipient = tpl.to || params.recipientEmail;
  if (!recipient) throw new Error("recipientEmail is required");

  // Suppression check
  const { data: suppressed } = await supabaseAdmin
    .from("suppressed_emails")
    .select("id")
    .eq("email", recipient.toLowerCase())
    .maybeSingle();
  if (suppressed) return { skipped: true as const, reason: "suppressed" };

  // Unsubscribe token (reuse existing if any)
  let unsubscribeToken: string;
  const { data: existingTok } = await supabaseAdmin
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", recipient.toLowerCase())
    .maybeSingle();
  if (existingTok && !existingTok.used_at) {
    unsubscribeToken = existingTok.token;
  } else {
    unsubscribeToken = genToken();
    await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .upsert({ token: unsubscribeToken, email: recipient.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });
    const { data: stored } = await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", recipient.toLowerCase())
      .maybeSingle();
    if (stored?.token) unsubscribeToken = stored.token;
  }

  const element = React.createElement(tpl.component as any, params.templateData);
  const html = await render(element);
  const plainText = await render(element, { plainText: true });
  const subject = typeof tpl.subject === "function" ? tpl.subject(params.templateData) : tpl.subject;
  const messageId = crypto.randomUUID();

  await supabaseAdmin.from("email_send_log").insert({
    message_id: messageId,
    template_name: params.templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error } = await supabaseAdmin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: "transactional",
      label: params.templateName,
      idempotency_key: params.idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

// Liste des familles avec statut commande
export const apelListFamilies = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ seasonStart: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    if (!(await userHasAnyRole(userId, ["admin", "apel"]))) {
      return { ok: false as const, error: "forbidden" as const, families: [] };
    }
    const { data: rows, error } = await supabaseAdmin.rpc("apel_families_overview", {
      _season_start: data.seasonStart ?? "2026-01-01",
    });
    if (error) {
      console.error("apelListFamilies:", error);
      return { ok: false as const, error: error.message, families: [] };
    }
    return { ok: true as const, families: rows ?? [] };
  });

// Relance APEL
export const sendApelReminders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        userIds: z.array(z.string().uuid()).min(1).max(500),
        customMessage: z.string().max(1000).optional(),
        deadline: z.string().max(50).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    if (!(await userHasAnyRole(userId, ["admin", "apel"]))) {
      return { ok: false as const, error: "forbidden" as const, sent: 0, total: 0 };
    }
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, prenom, nom")
      .in("id", data.userIds);
    let sent = 0;
    const errors: string[] = [];
    for (const p of profiles ?? []) {
      if (!p.email) continue;
      try {
        await renderAndEnqueue({
          templateName: "apel-reminder",
          recipientEmail: p.email,
          templateData: {
            prenom: p.prenom ?? "",
            familyName: (p as any).nom ?? "",
            deadline: data.deadline ?? "24 mai 2026",
            customMessage: data.customMessage,
          },
          idempotencyKey: `apel-reminder-${p.id}-${new Date().toISOString().slice(0, 10)}`,
        });
        sent++;
      } catch (e: any) {
        errors.push(`${p.email}: ${e?.message ?? e}`);
      }
    }
    return { ok: true as const, sent, total: profiles?.length ?? 0, errors };
  });

// Attribuer / révoquer un rôle (admin only)
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        email: z.string().email(),
        role: z.enum(["apel", "admin"]),
        action: z.enum(["grant", "revoke"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    if (!(await userHasAnyRole(userId, ["admin"]))) {
      return { ok: false as const, error: "forbidden" as const };
    }
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (!profile) return { ok: false as const, error: "user_not_found" as const };
    if (data.action === "grant") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: profile.id, role: data.role } as any);
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        return { ok: false as const, error: error.message };
      }
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", profile.id)
        .eq("role", data.role as any);
      if (error) return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });

// Liste des rôles attribués (admin only)
export const listRoleAssignments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { userId } = context;
    if (!(await userHasAnyRole(userId, ["admin"]))) {
      return { ok: false as const, error: "forbidden" as const, assignments: [] };
    }
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: false });
    const ids = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
    const profilesResp = ids.length
      ? await supabaseAdmin.from("profiles").select("id, email, prenom, nom").in("id", ids)
      : { data: [] as any[] };
    const pmap = new Map(((profilesResp.data as any[]) ?? []).map((p: any) => [p.id, p]));
    const assignments = (roles ?? []).map((r: any) => ({
      user_id: r.user_id,
      role: r.role,
      created_at: r.created_at,
      email: pmap.get(r.user_id)?.email ?? "—",
      prenom: pmap.get(r.user_id)?.prenom ?? "",
      nom: pmap.get(r.user_id)?.nom ?? "",
    }));
    return { ok: true as const, assignments };
  });