"use client";
import { useState, useEffect } from "react";
import { User, Heart, Package, LogOut, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { useWishlistStore } from "@/store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";
import type { Product } from "@/types";

const STATUS_COLOURS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { items: wishlist } = useWishlistStore();

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?redirectTo=/account"); return; }
      setProfile((p) => ({ ...p, email: user.email ?? "", name: user.user_metadata?.name ?? "" }));

      // Fetch profile details
      supabase.from("profiles").select("name, phone").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) setProfile((p) => ({ ...p, name: data.name ?? p.name, phone: data.phone ?? "" }));
        });
    });
  }, [router]);

  useEffect(() => {
    if (activeTab !== "orders") return;
    setLoadingOrders(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders((data as Record<string, unknown>[]) ?? []);
          setLoadingOrders(false);
        });
    });
  }, [activeTab]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles")
      .upsert({ id: user.id, name: profile.name, phone: profile.phone, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error("Failed to save profile");
    else toast.success("Profile updated");
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const tabs = [
    { id: "profile", label: "Profile", Icon: User },
    { id: "orders", label: "Orders", Icon: Package },
    { id: "wishlist", label: "Wishlist", Icon: Heart },
    { id: "addresses", label: "Addresses", Icon: MapPin },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="bg-plum py-10 px-4 text-center">
          <h1 className="font-serif text-4xl text-blush">My Account</h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-blush/20 p-4 space-y-1">
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-left ${
                      activeTab === id ? "bg-plum text-blush" : "text-brown hover:bg-cream"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                    {id === "wishlist" && wishlist.length > 0 && (
                      <span className="ml-auto text-xs bg-taupe/20 text-taupe rounded-full px-2">{wishlist.length}</span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-taupe hover:bg-cream transition-colors"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-blush/20 p-6">
                  <h2 className="font-serif text-2xl text-plum mb-6">Profile details</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Full name", key: "name", type: "text", placeholder: "Adaeze Okonkwo" },
                      { label: "Email address", key: "email", type: "email", placeholder: "adaeze@example.com" },
                      { label: "Phone number", key: "phone", type: "tel", placeholder: "+234 800 000 0000" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="text-xs tracking-widest text-taupe uppercase block mb-1.5">{f.label}</label>
                        <input
                          type={f.type}
                          value={profile[f.key as keyof typeof profile]}
                          onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          disabled={f.key === "email"}
                          className="w-full border border-blush/30 rounded-xl px-4 py-3 text-sm text-plum placeholder:text-taupe/50 focus:outline-none focus:border-taupe bg-cream disabled:opacity-60"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-plum text-blush text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-mauve transition-colors mt-2 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-white rounded-2xl border border-blush/20 p-6">
                  <h2 className="font-serif text-2xl text-plum mb-6">Order history</h2>
                  {loadingOrders ? (
                    <div className="space-y-3">
                      {[1,2,3].map((i) => (
                        <div key={i} className="animate-pulse h-16 bg-blush/20 rounded-xl" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="text-blush mx-auto mb-4" />
                      <p className="font-serif text-xl text-plum mb-2">No orders yet</p>
                      <p className="text-sm text-taupe mb-6">Your orders will appear here</p>
                      <Link href="/shop" className="bg-plum text-blush text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-mauve transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const o = order as { id: string; created_at: string; total: number; status: string; items: unknown[] };
                        return (
                          <div key={o.id} className="border border-blush/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-xs text-taupe tracking-widest">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-xs text-taupe">
                                  {new Date(o.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide ${STATUS_COLOURS[o.status] ?? "bg-gray-100 text-gray-800"}`}>
                                  {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                </span>
                                <span className="text-sm font-medium text-plum">{formatPrice(o.total)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-taupe">{Array.isArray(o.items) ? o.items.length : 0} item(s)</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="font-serif text-2xl text-plum mb-6">Wishlist ({wishlist.length})</h2>
                  {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-blush/20 p-12 text-center">
                      <Heart size={48} className="text-blush mx-auto mb-4" />
                      <p className="font-serif text-xl text-plum mb-2">Nothing saved yet</p>
                      <p className="text-sm text-taupe mb-6">Tap the heart on any product to save it here</p>
                      <Link href="/shop" className="bg-plum text-blush text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-mauve transition-colors">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlist.map((w) => (
                        <ProductCard key={w.product.id} product={w.product as Product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="bg-white rounded-2xl border border-blush/20 p-6">
                  <h2 className="font-serif text-2xl text-plum mb-6">Saved addresses</h2>
                  <div className="text-center py-12">
                    <MapPin size={48} className="text-blush mx-auto mb-4" />
                    <p className="font-serif text-xl text-plum mb-2">No addresses saved</p>
                    <p className="text-sm text-taupe">Addresses saved during checkout will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
