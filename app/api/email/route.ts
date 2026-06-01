import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "EMBELLISH <orders@embellish.ng>";

function orderConfirmedHtml(orderId: string, total: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
    <body style="margin:0;padding:0;background:#FAF5F2;font-family:Georgia,serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #EDBFC6;">
        <tr><td style="background:#260C1A;padding:32px;text-align:center;">
          <h1 style="color:#EDBFC6;font-size:28px;letter-spacing:6px;margin:0;">EMBELLISH</h1>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h2 style="color:#260C1A;font-size:22px;margin:0 0 16px;">Order confirmed!</h2>
          <p style="color:#5F4842;font-size:14px;line-height:1.7;margin:0 0 24px;">
            Thank you for shopping with EMBELLISH. Your order has been received and is being prepared.
          </p>
          <div style="background:#FAF5F2;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-size:12px;color:#AF8D86;letter-spacing:2px;text-transform:uppercase;">Order reference</p>
            <p style="margin:0;color:#260C1A;font-size:16px;font-weight:600;">${orderId}</p>
            <p style="margin:8px 0 0;color:#5F4842;font-size:14px;">Total: ₦${total.toLocaleString()}</p>
          </div>
          <p style="color:#5F4842;font-size:13px;line-height:1.7;margin:0 0 8px;">
            Estimated delivery: <strong>3–5 business days</strong>
          </p>
          <p style="color:#AF8D86;font-size:12px;margin:0;">
            Questions? Reply to this email or visit our website.
          </p>
        </td></tr>
        <tr><td style="background:#260C1A;padding:20px;text-align:center;">
          <p style="color:#AF8D86;font-size:11px;margin:0;letter-spacing:1px;">
            © ${new Date().getFullYear()} EMBELLISH. Where style meets sophistication.
          </p>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

function shippedHtml(orderId: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#FAF5F2;font-family:Georgia,serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #EDBFC6;">
        <tr><td style="background:#260C1A;padding:32px;text-align:center;">
          <h1 style="color:#EDBFC6;font-size:28px;letter-spacing:6px;margin:0;">EMBELLISH</h1>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h2 style="color:#260C1A;font-size:22px;margin:0 0 16px;">Your order is on its way!</h2>
          <p style="color:#5F4842;font-size:14px;line-height:1.7;margin:0 0 24px;">
            Great news — your EMBELLISH order <strong>${orderId}</strong> has been shipped and is on its way to you.
          </p>
          <p style="color:#AF8D86;font-size:13px;">Expected delivery within 1–2 business days.</p>
        </td></tr>
        <tr><td style="background:#260C1A;padding:20px;text-align:center;">
          <p style="color:#AF8D86;font-size:11px;margin:0;letter-spacing:1px;">© ${new Date().getFullYear()} EMBELLISH.</p>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { type, orderId, email, total } = await request.json();

    if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

    let subject = "";
    let html = "";

    if (type === "order_confirmed") {
      subject = `Order confirmed — ${orderId} | EMBELLISH`;
      html = orderConfirmedHtml(orderId, total);
    } else if (type === "order_shipped") {
      subject = `Your order has shipped — ${orderId} | EMBELLISH`;
      html = shippedHtml(orderId);
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const { error } = await resend.emails.send({ from: FROM, to: email, subject, html });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ sent: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
