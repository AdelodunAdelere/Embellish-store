"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account?tab=security`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-plum mb-2">Reset password</h1>
        <p className="text-sm text-taupe">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blush/20 p-8 shadow-sm">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-taupe mx-auto mb-4" />
            <h2 className="font-serif text-xl text-plum mb-2">Check your inbox</h2>
            <p className="text-sm text-taupe mb-6">
              We sent a password reset link to{" "}
              <span className="text-brown font-medium">{email}</span>.
            </p>
            <Link
              href="/login"
              className="text-xs tracking-widest text-plum uppercase hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-xs tracking-widest text-taupe uppercase block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-blush/30 rounded-xl px-4 py-3 text-sm text-plum placeholder:text-taupe/50 focus:outline-none focus:border-taupe bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-plum text-blush text-xs tracking-widest uppercase py-4 rounded-full hover:bg-mauve transition-colors disabled:opacity-60 font-medium"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-xs text-taupe hover:text-plum transition-colors"
            >
              <ArrowLeft size={13} /> Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
