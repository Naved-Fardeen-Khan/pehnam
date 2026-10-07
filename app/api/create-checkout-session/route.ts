import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid login session" },
        { status: 401 }
      );
    }

    const { bookingId } = await request.json();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        id,
        price_cad,
        payment_status,
        trainers (
          name,
          discipline
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.payment_status === "paid") {
      return NextResponse.json(
        { error: "Booking is already paid" },
        { status: 400 }
      );
    }

    const trainer = Array.isArray(booking.trainers)
      ? booking.trainers[0]
      : booking.trainers;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "cad",

            product_data: {
              name: `Private session with ${trainer?.name ?? "Pehnam coach"}`,
              description: trainer?.discipline ?? "Combat-sports coaching",
            },

            unit_amount: Math.round(Number(booking.price_cad) * 100),
          },

          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings?payment=cancelled`,

      metadata: {
        booking_id: String(booking.id),
        user_id: user.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}