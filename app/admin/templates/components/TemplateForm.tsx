"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

interface Props {
  categories: string[];
  defaults?: {
    id?: number;
    name: string;
    category: string;
    dimensions: string;
    image_url?: string | null;
  };
}

export default function TemplateForm({ categories, defaults }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const category = form.get("category") as string;
    const dimensions = form.get("dimensions") as string;
    const image = form.get("image") as File | null;

    let image_url = defaults?.image_url ?? "";

    if (image && image.size > 0) {
      const ext = image.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("template-images")
        .upload(path, image);

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("template-images")
        .getPublicUrl(path);

      image_url = urlData.publicUrl;
    }

    if (defaults?.id) {
      const { error: updateError } = await supabase
        .from("templates")
        .update({ name, category, dimensions, image_url })
        .eq("id", defaults.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("templates")
        .insert({ name, category, dimensions, image_url });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/templates");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Name</label>
        <input
          name="name"
          defaultValue={defaults?.name}
          required
          className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Category</label>
        <select
          name="category"
          defaultValue={defaults?.category}
          required
          className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-accent bg-white"
        >
          <option value="">Select…</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Dimensions</label>
        <input
          name="dimensions"
          defaultValue={defaults?.dimensions}
          placeholder="e.g. 1080×1920"
          required
          className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-zinc-600 mb-1 block">Image</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent file:text-white hover:file:bg-blue-600"
        />
        {defaults?.image_url && (
          <img
            src={defaults.image_url}
            alt=""
            className="mt-2 h-16 rounded border border-zinc-200 object-cover"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 mt-2">
        <button
          disabled={saving}
          className="h-10 rounded-lg bg-accent text-white text-sm font-medium px-6 hover:bg-blue-600 disabled:bg-zinc-300 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/templates")}
          className="h-10 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-700 px-6 hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
