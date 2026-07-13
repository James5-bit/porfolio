"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Is `npm run dev` running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Branded illustration panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12" style={{ background: "var(--bg-elevated)" }}>
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 20%, var(--primary), transparent 60%)" }} />
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 80% 80%, var(--accent), transparent 60%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-sm"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mb-8" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
            JP
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--ink)" }}>
            Manage your portfolio like a product.
          </h1>
          <p className="text-[15px]" style={{ color: "var(--ink-dim)" }}>
            Projects, skills, experience, and site content — all editable from one clean dashboard.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Drag-and-drop project ordering", "Live preview before you publish", "Full add / edit / delete everywhere"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2.5 text-[13.5px]"
                style={{ color: "var(--ink-dim)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--signal)" }} />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={submit}
          className="w-full max-w-sm rounded-2xl border p-8"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--surface-hover)" }}>
            <Lock size={18} color="var(--primary)" />
          </div>
          <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--ink)" }}>Admin login</h2>
          <p className="text-[13px] mb-6" style={{ color: "var(--ink-dim)" }}>Enter your password to continue.</p>

          <div className="relative mb-2">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-3 pr-11 rounded-lg border text-[14px] outline-none"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--ink-faint)" }}
              tabIndex={-1}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12.5px] mt-2" style={{ color: "#e05252" }}>
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-5 py-3 rounded-lg text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--primary)" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Checking…" : "Log in"}
          </button>

          <p className="text-[11.5px] mt-5 text-center" style={{ color: "var(--ink-faint)" }}>
            Protected with bcrypt + JWT sessions · rate-limited
          </p>
        </motion.form>
      </div>
    </div>
  );
}
