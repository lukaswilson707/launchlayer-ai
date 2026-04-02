import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const base = String(query || "mybrand").replace(/\s+/g, "").toLowerCase();

  return NextResponse.json({
    results: [
      { hostname: `${base}.com`, status: "available", price: 14 },
      { hostname: `${base}.app`, status: "available", price: 24 },
      { hostname: `${base}.site`, status: "available", price: 9 }
    ]
  });
}
