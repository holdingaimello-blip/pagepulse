import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const plan = session.metadata?.pagepulse_plan || "pro";
        const customerEmail = session.customer_details?.email;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        console.log("Checkout completed:", {
          plan,
          customerEmail,
          customerId,
          subscriptionId,
        });

        // Supabase persistence: upsert user record
        // Dynamically import to avoid issues when Supabase is not configured
        try {
          const { supabaseAdmin } = await import("@/lib/supabase");
          if (supabaseAdmin && customerEmail) {
            const urlLimit = plan === "business" ? 25 : plan === "pro" ? 5 : 1;
            const checkInterval = 1440; // Daily for all plans

            const { error } = await supabaseAdmin
              .from("users")
              .upsert(
                {
                  email: customerEmail,
                  stripe_customer_id: customerId || null,
                  plan,
                  stripe_subscription_id: subscriptionId || null,
                  url_limit: urlLimit,
                  check_interval_minutes: checkInterval,
                },
                { onConflict: "email" }
              );

            if (error) {
              console.error("Supabase upsert error:", error);
            } else {
              console.log(`User ${customerEmail} upgraded to ${plan}`);
            }
          }
        } catch (supaError) {
          console.warn("Supabase not available for webhook, skipping persistence:", supaError);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
