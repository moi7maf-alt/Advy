"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import type { Template } from "@/app/lib/templates";

export default function AdminTemplatesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTemplates(data as Template[]);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    await supabase.from("templates").delete().eq("id", id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Templates</h1>
        <Link
          href="/admin/templates/new"
          className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Add template
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Dimensions</th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 text-zinc-900 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-zinc-600">{t.category}</td>
                <td className="px-4 py-3 text-zinc-500">{t.dimensions}</td>
                <td className="px-4 py-3">
                  {t.image_url ? (
                    <img
                      src={t.image_url}
                      alt=""
                      className="w-12 h-8 object-cover rounded border border-zinc-200"
                    />
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/templates/${t.id}/edit`}
                      className="text-xs text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  No templates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
