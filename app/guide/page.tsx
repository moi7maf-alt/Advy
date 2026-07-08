import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          &larr; Back to home
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-zinc-900">User Guide</h1>
        <p className="mt-2 text-zinc-500">
          Everything you need to know to create ads with Advy.
        </p>

        <hr className="my-8 border-zinc-200" />

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Browse templates</h2>
          <p className="text-zinc-600 leading-relaxed">
            Start on the{" "}
            <Link href="/templates" className="text-accent hover:underline">
              Templates page
            </Link>
            . Use the sidebar or the filter buttons to narrow templates by category: Food, Phones, Cars, Retail, Digital Books, Plants, or Animals. Each card shows the template name, category, and dimensions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Open the editor</h2>
          <p className="text-zinc-600 leading-relaxed">
            Click any template card to open the editor workspace. The workspace has three layers arranged by z-index:
          </p>
          <ul className="mt-3 space-y-2 text-zinc-600">
            <li><strong className="text-zinc-900">Background (z:1)</strong> &mdash; Your uploaded image, which you can drag and resize freely.</li>
            <li><strong className="text-zinc-900">Template overlay (z:10)</strong> &mdash; A fixed SVG guide that stays in place.</li>
            <li><strong className="text-zinc-900">Text layer (z:20)</strong> &mdash; A title input on top of the canvas.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Upload an image</h2>
          <p className="text-zinc-600 leading-relaxed">
            In the right sidebar, click <strong>Upload Image</strong> and select a file from your computer. The image appears on the canvas. Drag it to reposition, or grab the blue resize handle at the bottom-right corner to change its size.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Generate ad copy with AI</h2>
          <p className="text-zinc-600 leading-relaxed">
            Click <strong>Suggest Ad Copy</strong> in the right sidebar. Advy uses OpenAI to generate three professional marketing slogans tailored to the template&apos;s category. Click any suggestion to insert it into the title field, or type your own.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Export your design</h2>
          <p className="text-zinc-600 leading-relaxed">
            When you&apos;re happy with the result, click <strong>Export JPG</strong>. The entire workspace is captured at high resolution (3x scale) and downloaded as a JPG file — ready to share or publish.
          </p>
        </section>

        <hr className="my-8 border-zinc-200" />

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">Tips</h2>
          <ul className="space-y-2 text-zinc-600 list-disc list-inside">
            <li>Upload high-resolution images for the best export quality.</li>
            <li>Use the AI copy feature to get slogan ideas — you can always edit them afterwards.</li>
            <li>The template overlay is for guidance only and won&apos;t appear in the exported JPG if it&apos;s rendered as part of the same DOM.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
