import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Verify webhook signature
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const { reference, amount } = event.data;
    const supabase = await createServiceClient();

    // Update order status to paid
    const result = await supabase
      .from("orders")
      .update({ status: "paid", paystack_ref: reference, updated_at: new Date().toISOString() })
      .eq("id", reference)
      .select("*")
      .single();

    const order = result.data as OrderRow | null;
    const error = result.error;

    if (error) {
      console.error("Webhook order update failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger confirmation email
    if (order) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order_confirmed",
            orderId: reference,
            email: (order.delivery_address as Record<string, string>)?.email,
            total: amount / 100,
          }),
        });
      } catch (e) {
        console.error("Email send failed:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
