import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase-server";

const PLAN_CONFIG = {
  pro: {
    name: "PagePulse Pro",
    price: 499, // $4.99 in cents
    metadata: { pagepulse_plan: "pro" },
  },
  business: {
    name: "PagePulse Business",
    price: 1499, // $14.99 in cents
    metadata: { pagepulse_plan: "business" },
  },
} as const;

type PlanKey = keyof typeof PLAN_CONFIG;

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

/**
 * Find or create a Stripe Price for the given plan.
 * Uses product metadata to identify PagePulse-created products.
 */
async function getOrCreatePrice(
  stripe: Stripe,
  plan: PlanKey
): Promise<string> {
  const config = PLAN_CONFIG[plan];

  // Search for existing product by metadata
  const products = await stripe.products.search({
    query: `metadata["pagepulse_plan"]:"${plan}"`,
  });

  let productId: string;

  if (products.data.length > 0) {
    productId = products.data[0].id;

    // Check for an active recurring price at the correct amount
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      type: "recurring",
      limit: 10,
    });

    const match = prices.data.find(
      (p) =>
        p.unit_amount === config.price &&
        p.currency === "usd" &&
        p.recurring?.interval === "month"
    );

    if (match) {
      return match.id;
    }
  } else {
    // Create product
    const product = await stripe.products.create({
      name: config.name,
      metadata: config.metadata,
    });
    productId = product.id;
  }

  // Create price
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: config.price,
    currency: "usd",
    recurring: { interval: "month" },
  });

  return price.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan || !Object.keys(PLAN_CONFIG).includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'pro' or 'business'." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Get authenticated user
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    const customerEmail = user?.email || undefined;

    const priceId = await getOrCreatePrice(stripe, plan as PlanKey);

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://pagepulse.eu";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      metadata: {
        pagepulse_plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Payment system not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
