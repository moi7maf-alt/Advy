import { notFound } from "next/navigation";
import { getTemplate } from "@/app/lib/supabase/queries";
import Editor from "./Editor";

export default async function EditorPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const template = await getTemplate(Number(id));

  if (!template) notFound();

  return <Editor template={template} />;
}
