import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { logout } from "@/app/lib/supabase/actions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/admin/login");

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

        <div className="mt-auto pt-4 border-t border-zinc-800">
          <form action={logout}>
            <button className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">{children}</main>
    </div>
  );
}
