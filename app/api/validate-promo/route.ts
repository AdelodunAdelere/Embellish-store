import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: "This code has expired" }, { status: 400 });
    }

    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      return NextResponse.json({ error: "This code has reached its usage limit" }, { status: 400 });
    }

    const discount =
      data.type === "percentage"
        ? Math.round(subtotal * (data.value / 100))
        : Math.min(data.value, subtotal);

    return NextResponse.json({ discount, code: data.code, type: data.type, value: data.value });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
