import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const websiteId = String(body.websiteId || "");
  const name = String(body.name || "");
  const email = String(body.email || "");
  const message = String(body.message || "");

  if (!websiteId || !name || !email) {
    return NextResponse.json({ error: "websiteId, name, and email are required" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      websiteId,
      name,
      email,
      message
    }
  });

  return NextResponse.json(lead);
}
