"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-blush/30 rounded-xl px-4 py-3 text-sm text-plum placeholder:text-taupe/50 focus:outline-none focus:border-taupe bg-white";
  const labelClass = "text-xs tracking-widest text-taupe uppercase block mb-1.5";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to verify.");
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-plum mb-2">Create account</h1>
        <p className="text-sm text-taupe">Join EMBELLISH for a personalised experience</p>
      </div>

      <div className="bg-white rounded-2xl border border-blush/20 p-8 shadow-sm">
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className={labelClass}>Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Adaeze Okonkwo"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-plum"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm password</label>
            <input
              type={showPw ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat password"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum text-blush text-xs tracking-widest uppercase py-4 rounded-full hover:bg-mauve transition-colors disabled:opacity-60 font-medium"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-plum font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
