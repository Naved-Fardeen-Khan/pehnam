"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadBookings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          trainers (
            name,
            slug,
            discipline
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setBookings(data ?? []);
      setLoading(false);
    }

    loadBookings();
  }, [router]);

  if (loading) {
    return <main className="p-10 text-black">Loading bookings...</main>;
  }
 async function handlePayment(bookingId: number) {
  setMessage("");

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        bookingId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not start payment.");
      return;
    }

    if (!data.url) {
      setMessage("Stripe did not return a checkout URL.");
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Payment error:", error);
    setMessage("Could not start payment.");
  }
}
  async function handleDeleteBooking(bookingId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this booking?",
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== bookingId),
    );
  }
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black">My Bookings</h1>

        <p className="mt-2">Your Pehnam training sessions.</p>

        {message && <p className="mt-6 text-red-600">{message}</p>}

        {bookings.length > 0 ? (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/trainers/${booking.trainers?.slug}`}
                      className="text-xl font-bold hover:underline"
                    >
                      {booking.trainers?.name}
                    </Link>

                    <p className="mt-1">{booking.trainers?.discipline}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">${booking.price_cad} CAD</p>

                    <p className="mt-1">{booking.payment_status}</p>
                  </div>
                </div>

                <div className="mt-5 border-t pt-5">
                  <p>
                    <strong>Date:</strong> {booking.session_date}
                  </p>

                  <p className="mt-2">
                    <strong>Time:</strong> {booking.session_time}
                  </p>

                  <p className="mt-2">
                    <strong>Location:</strong> {booking.location}
                  </p>

                  {booking.goal && (
                    <p className="mt-2">
                      <strong>Goal:</strong> {booking.goal}
                    </p>
                  )}

                  <p className="mt-4">
                    <strong>Booking status:</strong> {booking.booking_status}
                  </p>
                  
                </div>
                <div className="mt-6 flex gap-3 border-t pt-5">
                  {String(booking.payment_status).trim().toLowerCase() ===
                    "unpaid" && (
                    <button
                      onClick={() => handlePayment(booking.id)}
                      className="rounded-lg bg-black px-5 py-3 font-bold text-white"
                    >
                      Pay ${booking.price_cad} CAD
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="rounded-lg border border-red-600 px-5 py-3 font-bold text-red-600"
                  >
                    Remove booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-8">
            <p>You don't have any bookings yet.</p>

            <Link
              href="/trainers"
              className="mt-5 inline-block rounded-lg bg-black px-5 py-3 font-bold text-white"
            >
              Find a coach
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
