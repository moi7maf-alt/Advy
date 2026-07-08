"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/supabase/actions";

export default function LoginPage() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      const result = await login(formData);
      if (result.ok) router.push("/admin");
      return { error: result.error ?? undefined };
    },
    { error: undefined as string | undefined }
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Admin Login</h1>
        <p className="text-sm text-zinc-500 mb-6">Sign in to manage templates</p>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-accent"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-accent"
          />
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <button
            disabled={pending}
            className="h-10 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 disabled:bg-zinc-300 transition-colors"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
