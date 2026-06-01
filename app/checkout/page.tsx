"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";

const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

type Step = "info" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", street: "", city: "", state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = total();
  const shipping = subtotal >= 30000 ? 0 : 2500;
  const finalTotal = subtotal - discount + shipping;

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.phone || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone required";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyPromo = async () => {
    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data = await res.json();
      if (data.error) {
        setDiscount(0);
        setPromoMsg(data.error);
      } else {
        setDiscount(data.discount);
        setPromoMsg(`Code applied! You saved ${formatPrice(data.discount)}`);
      }
    } catch {
      // fallback client-side check
      if (promoCode.toUpperCase() === "EMBELLISH10") {
        const d = Math.round(subtotal * 0.1);
        setDiscount(d);
        setPromoMsg(`Code applied! You saved ${formatPrice(d)}`);
      } else {
        setDiscount(0);
        setPromoMsg("Invalid promo code");
      }
    }
  };

  const handlePaystack = async () => {
    setLoading(true);

    // Create order in DB first (status: pending)
    let orderId: string | undefined;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          shipping,
          discount,
          total: finalTotal,
          deliveryAddress: {
            fullName: form.fullName,
            phone: form.phone,
            street: form.street,
            city: form.city,
            state: form.state,
          },
          promoCode: discount > 0 ? promoCode : null,
        }),
      });
      const data = await res.json();
      orderId = data.id;
    } catch {
      toast.error("Could not create order. Please try again.");
      setLoading(false);
      return;
    }

    // Load Paystack inline JS dynamically (keeps bundle small)
    const PaystackPop = (await import("@paystack/inline-js")).default;
    const popup = new PaystackPop();

    popup.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: form.email,
      amount: finalTotal * 100, // Paystack uses kobo
      currency: "NGN",
      ref: orderId ?? `EMB-${Date.now()}`,
      metadata: {
        order_id: orderId,
        customer_name: form.fullName,
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: form.fullName },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
        ],
      },
      onSuccess: (tx: { reference: string }) => {
        clearCart();
        router.push(`/order-confirmation?ref=${tx.reference}&orderId=${orderId ?? ""}`);
      },
      onCancel: () => {
        toast("Payment cancelled");
        setLoading(false);
      },
    });
  };

  const inputClass =
    "w-full border border-blush/30 rounded-xl px-4 py-3 text-sm text-plum placeholder:text-taupe/50 focus:outline-none focus:border-taupe bg-white";
  const labelClass = "text-xs tracking-widest text-taupe uppercase block mb-1.5";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="bg-plum py-10 px-4 text-center">
          <h1 className="font-serif text-4xl text-blush">Checkout</h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            {(["info", "payment"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s ? "bg-blush text-plum"
                  : (["info","payment"]).indexOf(step) > i ? "bg-taupe text-white"
                  : "bg-mauve text-taupe"
                }`}>
                  {i + 1}
                </div>
                <span className="text-[10px] text-taupe tracking-widest uppercase hidden md:inline">
                  {s === "info" ? "Details" : "Payment"}
                </span>
                {i < 1 && <div className="w-8 h-px bg-taupe/30" />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              {step === "info" ? (
                <div className="space-y-5">
                  <h3 className="font-serif text-xl text-plum mb-4">Delivery information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full name</label>
                      <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Adaeze Okonkwo" className={inputClass} />
                      {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone number</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className={inputClass} />
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email address</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="adaeze@example.com" className={inputClass} />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Street address</label>
                    <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="12 Adeola Odeku Street" className={inputClass} />
                    {errors.street && <p className="text-xs text-red-400 mt-1">{errors.street}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lagos" className={inputClass} />
                      {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass}>
                        <option value="">Select state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  <button onClick={() => validateInfo() && setStep("payment")} className="w-full bg-plum text-blush text-xs tracking-widest uppercase py-4 rounded-full hover:bg-mauve transition-colors flex items-center justify-center gap-2">
                    Continue to payment <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif text-xl text-plum mb-6">Payment</h3>
                  <div className="bg-white rounded-2xl border border-blush/20 p-6 mb-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock size={16} className="text-taupe" />
                      <span className="text-xs text-taupe tracking-widest uppercase">
                        Secure payment via Paystack
                      </span>
                    </div>
                    <p className="text-sm text-brown leading-relaxed">
                      You&apos;ll complete payment via Paystack&apos;s secure overlay. We accept cards, bank transfer, and USSD.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("info")} className="flex-1 border border-blush/30 text-brown text-xs tracking-widest uppercase py-4 rounded-full hover:border-taupe transition-colors">
                      Back
                    </button>
                    <button onClick={handlePaystack} disabled={loading} className="flex-1 bg-plum text-blush text-xs tracking-widest uppercase py-4 rounded-full hover:bg-mauve transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading ? "Loading…" : `Pay ${formatPrice(finalTotal)}`}
                      {!loading && <ArrowRight size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-2xl border border-blush/20 p-6 sticky top-24">
                <h3 className="font-serif text-lg text-plum mb-5">Order summary</h3>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-brown truncate flex-1 mr-2">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="text-plum font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 text-xs border border-blush/30 rounded-full px-4 py-2.5 text-plum placeholder:text-taupe/60 focus:outline-none focus:border-taupe"
                    />
                    <button onClick={applyPromo} className="text-xs tracking-widest uppercase bg-plum text-blush px-4 py-2.5 rounded-full hover:bg-mauve transition-colors">
                      Apply
                    </button>
                  </div>
                  {promoMsg && (
                    <p className={`text-xs mt-2 ${discount > 0 ? "text-green-700" : "text-red-400"}`}>
                      {promoMsg}
                    </p>
                  )}
                </div>

                <div className="border-t border-blush/20 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-brown">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-taupe">
                      <span>Discount</span><span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brown">
                    <span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-plum pt-1 border-t border-blush/20">
                    <span>Total</span><span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
