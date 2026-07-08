"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}

export async function createTemplate(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const dimensions = formData.get("dimensions") as string;
  const image = formData.get("image") as File | null;

  let image_url = "";

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("template-images")
      .upload(path, image);

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("template-images")
      .getPublicUrl(path);

    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("templates").insert({
    name,
    category,
    dimensions,
    image_url,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { ok: true };
}

export async function updateTemplate(id: number, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const dimensions = formData.get("dimensions") as string;
  const image = formData.get("image") as File | null;

  const updates: Record<string, string> = { name, category, dimensions };

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("template-images")
      .upload(path, image);

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("template-images")
      .getPublicUrl(path);

    updates.image_url = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("templates")
    .update(updates)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { ok: true };
}

export async function deleteTemplate(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { ok: true };
}
