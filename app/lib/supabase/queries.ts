import "server-only";
import { createClient } from "./server";
import type { Template } from "@/app/lib/templates";

export async function getTemplates(): Promise<Template[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Template[];
}

export async function getTemplate(id: number): Promise<Template | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  return data as Template | null;
}
