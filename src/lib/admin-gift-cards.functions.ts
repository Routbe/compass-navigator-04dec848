import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/middleware";

/** Adminlijst met fysieke cadeaubon-zendingen (België). */
export const listGiftShipments = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z.object({ openOnly: z.boolean().default(true) }).parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { assertAdminRole } = await import("./admin.server");
    await assertAdminRole(context.userId);
    const { fetchGiftShipments } = await import("./admin-gift-cards.server");
    return fetchGiftShipments(data.openOnly);
  });

/** Zet een zending op pending_print / packaged / shipped. */
export const setGiftShipmentStatus = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        giftId: z.string().uuid(),
        status: z.enum(["pending_print", "packaged", "shipped"]),
        trackingCode: z.string().max(64).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { assertAdminRole } = await import("./admin.server");
    await assertAdminRole(context.userId);
    const { updateGiftShipment } = await import("./admin-gift-cards.server");
    return updateGiftShipment({
      giftId: data.giftId,
      status: data.status,
      trackingCode: data.trackingCode ?? null,
    });
  });

/** Admin geeft zelf een bon uit (bv. actie of compensatie): direct actief, geen betaling. */
export const adminIssueGiftCard = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        amountCents: z.number().int().min(500).max(50_000),
        recipientEmail: z.string().trim().toLowerCase().email().max(254).optional().or(z.literal("")),
        recipientName: z.string().trim().max(80).optional(),
        message: z.string().trim().max(300).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { assertAdminRole, writeAudit } = await import("./admin.server");
    await assertAdminRole(context.userId);
    const { createGiftOrder, markGiftCardPaid } = await import("./gift-cards.server");
    const order = await createGiftOrder({
      amountCents: data.amountCents,
      purchaserUserId: context.userId,
      purchaserEmail: String(context.claims.email ?? "hallo@rout.be"),
      purchaserName: "ROUT",
      recipientEmail: data.recipientEmail || null,
      recipientName: data.recipientName || null,
      message: data.message || null,
      physicalDelivery: false,
    });
    await markGiftCardPaid({ giftId: order.id, reference: `admin:${context.userId}` });
    await writeAudit({ adminId: context.userId, action: "gift_card_issue", targetLabel: order.code }).catch(() => undefined);
    return { code: order.code };
  });
