import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import Stripe from "stripe";

export async function POST() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("stripe_subscription_id, plan")
      .eq("email", user.email)
      .single();

    if (!userData?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    await stripe.subscriptions.cancel(userData.stripe_subscription_id);

    await supabase
      .from("users")
      .update({
        plan: "free",
        url_limit: 3,
        check_interval_minutes: 1440,
        stripe_subscription_id: null,
      })
      .eq("email", user.email);

    return NextResponse.json({ success: true, message: "Subscription cancelled. Downgraded to Free plan." });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
