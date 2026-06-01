import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, subtotal, shipping, discount, total, deliveryAddress, promoCode } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        items,
        subtotal,
        shipping,
        discount,
        total,
        delivery_address: deliveryAddress,
        promo_code: promoCode ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: order.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
