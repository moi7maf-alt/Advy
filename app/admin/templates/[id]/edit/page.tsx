"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateForm from "../../components/TemplateForm";
import { createClient } from "@/app/lib/supabase/client";
import type { Template } from "@/app/lib/templates";

const categories = [
  "Food",
  "Phones",
  "Cars",
  "Retail",
  "Digital Books",
  "Plants",
  "Animals",
];

export default function EditTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("templates")
      .select("*")
      .eq("id", Number(id))
      .single()
      .then(({ data }) => {
        if (data) setTemplate(data as Template);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg">
        <p className="text-zinc-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-lg">
        <p className="text-zinc-400 text-sm">Template not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Edit template</h1>
      <TemplateForm categories={categories} defaults={template} />
    </div>
  );
}
