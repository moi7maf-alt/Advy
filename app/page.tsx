import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-zinc-50 to-white">
        <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 max-w-2xl leading-tight">
          Design stunning ads in minutes
        </h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl">
          Advy gives you ready-made templates for every category. Upload your image, tweak the copy, and export a professional ad — no design skills needed.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/templates"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Browse templates
          </Link>
          <Link
            href="/guide"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            How it works
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent text-lg font-bold">1</div>
            <h3 className="text-zinc-900 font-semibold mb-1">Pick a template</h3>
            <p className="text-sm text-zinc-500">Choose from 8 categories and find the perfect layout for your ad.</p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent text-lg font-bold">2</div>
            <h3 className="text-zinc-900 font-semibold mb-1">Customize</h3>
            <p className="text-sm text-zinc-500">Upload an image, drag and resize it, and add your own headline.</p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent text-lg font-bold">3</div>
            <h3 className="text-zinc-900 font-semibold mb-1">Export</h3>
            <p className="text-sm text-zinc-500">Download a high-quality JPG with one click — ready to publish.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
