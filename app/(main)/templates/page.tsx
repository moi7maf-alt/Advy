import { Suspense } from "react";
import Gallery from "@/app/(main)/components/Gallery";

function GalleryFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 animate-pulse">
          <div className="w-full aspect-[4/3] rounded-lg bg-zinc-700/50 mb-4" />
          <div className="h-4 w-16 bg-zinc-700/50 rounded mb-2" />
          <div className="h-5 w-32 bg-zinc-700/50 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<GalleryFallback />}>
      <Gallery />
    </Suspense>
  );
}
