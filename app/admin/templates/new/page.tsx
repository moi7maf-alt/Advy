"use client";

import TemplateForm from "../components/TemplateForm";

const categories = [
  "Food",
  "Phones",
  "Cars",
  "Retail",
  "Digital Books",
  "Plants",
  "Animals",
];

export default function NewTemplatePage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">New template</h1>
      <TemplateForm categories={categories} />
    </div>
  );
}
