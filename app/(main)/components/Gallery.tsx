"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { templates, categories } from "@/app/lib/templates";

export default function Gallery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("cat") || "All";

  const filtered =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const slug = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, "-");
          return (
            <button
              key={cat}
              onClick={() => router.push(slug ? `/templates?cat=${slug}` : "/templates")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/editor/${t.id}`}
            className="group bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 hover:border-accent hover:bg-zinc-800 transition-all duration-200 block"
          >
            <div className="w-full aspect-[4/3] rounded-lg bg-zinc-700/50 mb-4 flex items-center justify-center text-zinc-500 text-sm group-hover:bg-zinc-700/70 transition-colors">
              {t.dimensions}
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-700 text-zinc-300 text-xs font-medium mb-2">
                {t.category}
              </span>
              <h3 className="text-zinc-100 font-semibold text-base leading-tight">
                {t.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-zinc-500 text-center mt-16">
          No templates found for this category.
        </p>
      )}
    </div>
  );
}
