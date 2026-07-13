"use client";
import { useState } from "react";
import { Card, Button, Input, Field } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";
import { KeyRound, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { push("New passwords don't match.", "error"); return; }
    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { push(data.error || "Failed to change password.", "error"); return; }
    push("Password updated. Use it next time you log in.", "success");
    setCurrent(""); setNext(""); setConfirm("");
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Settings</h2>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Account & security.</p>
      </div>

      <form onSubmit={submit}>
        <Card>
          <div className="flex items-center gap-2.5 mb-4">
            <KeyRound size={16} color="var(--primary)" />
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>Change password</h3>
          </div>
          <Field label="Current password"><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></Field>
          <Field label="New password"><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={6} /></Field>
          <Field label="Confirm new password"><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} /></Field>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Update password"}</Button>
        </Card>
      </form>

      <Card>
        <div className="flex items-center gap-2.5 mb-2">
          <ShieldCheck size={16} color="var(--signal)" />
          <h3 className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>Session security</h3>
        </div>
        <p className="text-[12.5px]" style={{ color: "var(--ink-dim)" }}>
          Passwords are hashed with bcrypt. Sessions use signed JWTs stored in an httpOnly cookie
          (12-hour expiry). Login attempts are rate-limited to 5 per minute per IP.
        </p>
      </Card>
    </div>
  );
}
