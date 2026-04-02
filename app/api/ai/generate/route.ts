import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { buildFallbackSite } from "@/lib/site-builder";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompt = String(body.prompt || "");
  const siteName = String(body.siteName || "New Website");

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return NextResponse.json(buildFallbackSite(prompt, siteName));
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You generate website JSON. Return valid JSON with keys: siteName, slug, seoTitle, seoDescription, pages. Each page has title, slug, sections."
        },
        {
          role: "user",
          content: JSON.stringify({ prompt, siteName })
        }
      ]
    });

    const output = response.output_text?.trim();
    if (!output) throw new Error("No AI output");

    return NextResponse.json(JSON.parse(output));
  } catch {
    return NextResponse.json(buildFallbackSite(prompt, siteName));
  }
}
