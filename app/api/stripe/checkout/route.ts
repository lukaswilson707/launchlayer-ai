import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { appConfig } from "@/lib/config";

export async function POST(req: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY." },
      { status: 400 }
    );
  }

  const { planKey } = await req.json();
  const plan = appConfig.plans.find((item) => item.key === planKey);
  if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  return NextResponse.json({
    message: "Create a Stripe Checkout Session here once you add product and price IDs.",
    plan
  });
}
