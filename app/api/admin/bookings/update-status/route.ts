import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const allowedStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

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

    // Client used only to verify who is logged in
    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser(token);

    // Check that the logged-in user is the admin
    if (
      userError ||
      !user ||
      user.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const { bookingId, status } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // Admin client can update bookings despite customer RLS rules
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({
        booking_status: status,
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("Booking status update failed:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      booking: data,
    });
  } catch (error) {
    console.error("Admin booking update error:", error);

    return NextResponse.json(
      { error: "Could not update booking status" },
      { status: 500 }
    );
  }
}