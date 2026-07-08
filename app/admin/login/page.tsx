"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (err) {
      setError(err.message);
      setPending(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Admin Login</h1>
        <p className="text-sm text-zinc-500 mb-6">Sign in to manage templates</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {error && <p className="text-sm text-red-500">{error}</p>}
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
