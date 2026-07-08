"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string }>;
  categories: string[];
  defaults?: {
    name: string;
    category: string;
    dimensions: string;
    image_url?: string | null;
  };
}

export default function TemplateForm({ action, categories, defaults }: Props) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      const result = await action(formData);
      if (result.ok) router.push("/admin/templates");
      return { error: result.error ?? undefined };
    },
    { error: undefined as string | undefined }
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
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

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          disabled={pending}
          className="h-10 rounded-lg bg-accent text-white text-sm font-medium px-6 hover:bg-blue-600 disabled:bg-zinc-300 transition-colors"
        >
          {pending ? "Saving…" : "Save"}
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
