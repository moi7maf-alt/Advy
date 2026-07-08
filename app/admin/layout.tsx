"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    import("@/app/lib/supabase/client").then((mod) => {
      const supabase = mod.createClient();
      supabaseRef.current = supabase;

      supabase.auth.getSession().then(({ data }) => {
        if (!data.session && pathname !== "/admin/login") {
          router.push("/admin/login");
        } else {
          setChecking(false);
        }
      });
    });
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50">
        <div className="text-zinc-400 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-56 bg-zinc-900 text-zinc-400 shrink-0 overflow-y-auto p-4 flex flex-col gap-1">
        <div className="text-xs text-zinc-600 uppercase tracking-wider mb-3 px-3">
          Admin
        </div>
        <Link
          href="/admin"
          className="px-3 py-2 rounded-md text-sm hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/templates"
          className="px-3 py-2 rounded-md text-sm hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          Templates
        </Link>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <Link
            href="/"
            className="px-3 py-2 rounded-md text-sm hover:bg-zinc-800 hover:text-zinc-200 transition-colors block"
          >
            &larr; Home
          </Link>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-800">
          <button
            onClick={async () => {
              if (supabaseRef.current) {
                await supabaseRef.current.auth.signOut();
                router.push("/admin/login");
              }
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">{children}</main>
    </div>
  );
}
