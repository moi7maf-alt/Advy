"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function AdminDashboard() {
  const supabase = createClient();
  const [count, setCount] = useState(0);

  useEffect(() => {
    supabase
      .from("templates")
      .select("id", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-zinc-900">{count}</div>
          <div className="text-sm text-zinc-500 mt-1">Templates</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/templates/new"
          className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Add template
        </Link>
        <Link
          href="/admin/templates"
          className="inline-flex h-10 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
