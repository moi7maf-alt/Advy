import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { category } = await req.json();

  if (!category || typeof category !== "string") {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional marketing copywriter. Respond with only a JSON array of exactly 3 short, punchy advertising slogans. No markdown, no numbering, no extra text.",
        },
        {
          role: "user",
          content: `Write 3 professional marketing slogans for a business in the "${category}" category.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "Failed to generate copy" }, { status: 500 });
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "[]";

  try {
    const suggestions = JSON.parse(raw);
    return NextResponse.json({ suggestions });
  } catch {
    const fallback = raw
      .split("\n")
      .map((l: string) => l.replace(/^[\d."'\s-]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
    return NextResponse.json({ suggestions: fallback });
  }
}
