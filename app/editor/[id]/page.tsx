import Editor from "./Editor";

export default async function EditorPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <Editor id={id} />;
}
