import { notFound } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { updateTemplate } from "@/app/lib/supabase/actions";
import TemplateForm from "../../components/TemplateForm";

const categories = [
  "Food",
  "Phones",
  "Cars",
  "Retail",
  "Digital Books",
  "Plants",
  "Animals",
];

export default async function EditTemplatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!template) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Edit template</h1>
      <TemplateForm
        action={updateTemplate.bind(null, template.id)}
        categories={categories}
        defaults={template}
      />
    </div>
  );
}
