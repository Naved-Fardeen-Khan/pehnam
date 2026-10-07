import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser(token);

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

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: bookings, error: bookingsError } =
    await supabaseAdmin
      .from("bookings")
      .select(`
        *,
        trainers (
          name,
          discipline
        )
      `)
      .order("created_at", { ascending: false });

  if (bookingsError) {
    return NextResponse.json(
      { error: bookingsError.message },
      { status: 500 }
    );
  }

  const { data: trainers, error: trainersError } =
    await supabaseAdmin
      .from("trainers")
      .select("*")
      .order("name");

  if (trainersError) {
    return NextResponse.json(
      { error: trainersError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    bookings,
    trainers,
  });
}