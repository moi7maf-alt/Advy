"use client";

import { useState, useRef, useCallback } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import Link from "next/link";
import html2canvas from "html2canvas";
import type { Template } from "@/app/lib/templates";

export default function Editor({ template }: { template: Template }) {  const [bgImage, setBgImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 200, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const resizingRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({ active: false, startX: 0, startY: 0, startW: 0, startH: 0 });

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Template not found.
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBgImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExport = useCallback(async () => {
    if (!workspaceRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(workspaceRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#09090b",
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template?.name ?? "export"}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.95);
    } finally {
      setExporting(false);
    }
  }, [template?.name]);

  const handleSuggest = useCallback(async () => {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/suggest-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: template?.category }),
      });
      const data = await res.json();
      if (data.suggestions) setSuggestions(data.suggestions);
    } catch {
      // silently fail
    } finally {
      setSuggesting(false);
    }
  }, [template?.category]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      resizingRef.current = {
        active: true,
        startX,
        startY,
        startW: imageSize.width,
        startH: imageSize.height,
      };

      const onMouseMove = (ev: globalThis.MouseEvent) => {
        if (!resizingRef.current.active) return;
        const dx = ev.clientX - resizingRef.current.startX;
        const dy = ev.clientY - resizingRef.current.startY;
        const newW = Math.max(50, resizingRef.current.startW + dx);
        const newH = Math.max(50, resizingRef.current.startH + dy);
        setImageSize({ width: newW, height: newH });
      };

      const onMouseUp = () => {
        resizingRef.current.active = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [imageSize]
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div
          ref={workspaceRef}
          className="relative border border-zinc-700 bg-zinc-950 shadow-2xl"
          style={{
            width: 800,
            height: 600,
            aspectRatio: "auto",
          }}
        >
          {/* Layer 1: User image (draggable & resizable) */}
          {bgImage && (
            <Draggable
              position={position}
              onDrag={(_e: DraggableEvent, data: DraggableData) =>
                setPosition({ x: data.x, y: data.y })
              }
            >
              <div
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: 1,
                  width: imageSize.width,
                  height: imageSize.height,
                  left: 0,
                  top: 0,
                }}
              >
                <img
                  src={bgImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                {/* Resize handle */}
                <div
                  onMouseDown={handleResizeStart}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize z-10"
                />
              </div>
            </Draggable>
          )}

          {/* Layer 2: Template overlay (fixed) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="template-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>

              <rect width="800" height="600" fill="url(#template-bg)" />

              {/* Header bar */}
              <rect
                x="40"
                y="30"
                width="720"
                height="60"
                rx="6"
                className="fill-white/10"
              />
              <rect x="60" y="48" width="120" height="24" rx="4" className="fill-white/15" />
              <circle cx="710" cy="60" r="12" className="fill-white/10" />
              <rect x="680" y="48" width="0" height="0" />

              {/* Image placeholder */}
              <rect
                x="40"
                y="110"
                width="480"
                height="340"
                rx="8"
                className="fill-white/5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="6 4"
              />

              {/* Text lines */}
              <rect x="540" y="110" width="220" height="14" rx="3" className="fill-white/15" />
              <rect x="540" y="134" width="180" height="14" rx="3" className="fill-white/10" />
              <rect x="540" y="158" width="200" height="14" rx="3" className="fill-white/10" />
              <rect x="540" y="190" width="160" height="14" rx="3" className="fill-white/10" />
              <rect x="540" y="214" width="140" height="14" rx="3" className="fill-white/10" />

              {/* Footer bar */}
              <rect
                x="40"
                y="530"
                width="720"
                height="40"
                rx="6"
                className="fill-white/5"
              />
              <rect x="60" y="542" width="80" height="16" rx="4" className="fill-white/10" />
              <rect x="660" y="542" width="80" height="16" rx="4" className="fill-white/10" />
            </svg>
          </div>

          {/* Layer 3: Text input (top) */}
          <div
            className="absolute inset-0 p-10"
            style={{ zIndex: 20 }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title..."
              className="w-full bg-transparent border-b border-white/20 text-white text-3xl font-bold pb-2 outline-none placeholder-white/30"
            />
          </div>
        </div>
      </div>

      {/* Right sidebar — image upload */}
      <div className="w-72 bg-zinc-950 border-l border-zinc-800 p-5 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-zinc-100 font-semibold text-sm uppercase tracking-wider">
            Layers
          </h2>
          <Link
            href="/templates"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            &larr; Back
          </Link>
        </div>

        {/* Layer 1: Background */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Background</span>
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 rounded">
              z:1
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-2 rounded-md transition-colors"
          >
            {bgImage ? "Change Image" : "Upload Image"}
          </button>
        </div>

        {/* Layer 2: Template */}
        <div className="bg-zinc-800/50 border border-accent/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Template</span>
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 rounded">
              z:10
            </span>
          </div>
          <p className="text-xs text-zinc-500">{template.name}</p>
          <p className="text-xs text-zinc-600">{template.category}</p>
        </div>

        {/* Layer 3: Text */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Text</span>
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 rounded">
              z:20
            </span>
          </div>
          <p className="text-xs text-zinc-500">Title input</p>
          <p className="text-xs text-zinc-400 mt-1 truncate">
            {title || <span className="text-zinc-600">Empty</span>}
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-4 mt-2 flex flex-col gap-3">
          <button
            onClick={handleSuggest}
            disabled={suggesting}
            className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-200 text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {suggesting ? "Thinking…" : "Suggest Ad Copy"}
          </button>

          {suggestions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setTitle(s)}
                  className="text-left text-xs text-zinc-400 bg-zinc-800/50 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700/50 rounded-lg px-3 py-2 transition-colors leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-accent hover:bg-blue-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {exporting ? "Exporting…" : "Export JPG"}
          </button>
        </div>
      </div>
    </div>
  );
}
