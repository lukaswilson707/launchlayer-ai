import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message:
      "Implement Stripe webhook signature verification here and sync subscription status into the Subscription table."
  });
}
