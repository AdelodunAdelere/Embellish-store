"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderConfirmationContent() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const orderId = params.get("orderId");
  const display = ref ?? orderId ?? "—";

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[#EDE8F0] flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-taupe" />
      </div>

      <p className="text-xs tracking-[0.3em] text-taupe uppercase mb-3">Thank you</p>
      <h1 className="font-serif text-4xl md:text-5xl text-plum mb-4 leading-tight">
        Order confirmed!
      </h1>
      <p className="text-sm text-brown leading-relaxed mb-6">
        Thank you for shopping with EMBELLISH. We&apos;ve received your order and a confirmation email is on its way to you.
      </p>

      <div className="bg-white rounded-2xl border border-blush/20 p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <Package size={16} className="text-taupe flex-shrink-0" />
          <p className="text-xs tracking-widest text-taupe uppercase">Order details</p>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-taupe">Order reference</span>
            <span className="text-plum font-medium">{display}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-taupe">Estimated delivery</span>
            <span className="text-plum">3–5 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-taupe">Status</span>
            <span className="text-green-700 font-medium">Payment received</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[
          { label: "Order placed", done: true },
          { label: "Processing", done: false },
          { label: "Shipped", done: false },
          { label: "Delivered", done: false },
        ].map((step, i, arr) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${step.done ? "bg-taupe text-white" : "bg-blush/40 text-taupe"}`}>
                {i + 1}
              </div>
              <span className="text-[10px] text-taupe tracking-wide whitespace-nowrap">{step.label}</span>
            </div>
            {i < arr.length - 1 && <div className="w-6 h-px bg-blush/50 mb-4" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="bg-plum text-blush text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-mauve transition-colors inline-flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight size={14} />
        </Link>
        <Link
          href="/account?tab=orders"
          className="border border-blush/30 text-brown text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:border-taupe transition-colors inline-flex items-center justify-center"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
