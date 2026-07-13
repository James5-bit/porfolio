"use client";
import { usePathname, useRouter } from "next/navigation";
import { ToastProvider } from "@/components/admin/Toast";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { navItems } from "@/components/admin/navItems";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  const current = navItems.find((i) => (i.exact ? pathname === i.href : pathname.startsWith(i.href)));

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
        <Sidebar onLogout={logout} />
        <div className="flex-1 min-w-0">
          <Topbar title={current?.label ?? "Dashboard"} onLogout={logout} />
          <main className="p-5 md:p-8 max-w-6xl mx-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
