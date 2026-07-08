import Link from "next/link";

const categories = [
  "Food",
  "Phones",
  "Cars",
  "Retail",
  "Digital Books",
  "Plants",
  "Animals",
];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-sidebar text-sidebar-text shrink-0 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/templates?cat=${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-3 py-2 rounded-md text-sm hover:bg-sidebar-hover hover:text-white transition-colors"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
