"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage("You must be logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/data", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Could not load admin data.");
        setLoading(false);
        return;
      }

      setBookings(data.bookings ?? []);
      setTrainers(data.trainers ?? []);
      setLoading(false);
    }

    loadAdminData();
  }, []);
  async function handleStatusChange(bookingId: number, status: string) {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setMessage("You are not logged in.");
      return;
    }

    const response = await fetch("/api/admin/bookings/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        bookingId,
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not update booking.");
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, booking_status: status }
          : booking,
      ),
    );
  }

  if (loading) {
    return <main className="p-10">Loading admin...</main>;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">Pehnam Admin</h1>

        {message && <p className="mt-6 text-red-600">{message}</p>}

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Bookings</h2>

          <div className="mt-5 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between gap-6">
                  <div>
                    <h3 className="font-bold">{booking.trainers?.name}</h3>

                    <p>{booking.trainers?.discipline}</p>

                    <p className="mt-3">
                      {booking.session_date} • {booking.session_time}
                    </p>

                    <p>{booking.location}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">${booking.price_cad} CAD</p>

                    <p>Payment: {booking.payment_status}</p>

                    <p>Booking: {booking.booking_status}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {booking.booking_status !== "confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "confirmed")
                          }
                          className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                        >
                          Confirm
                        </button>
                      )}

                      {booking.booking_status !== "completed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "completed")
                          }
                          className="rounded-lg border border-black px-4 py-2 font-semibold"
                        >
                          Complete
                        </button>
                      )}

                      {booking.booking_status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "cancelled")
                          }
                          className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Trainers</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold">{trainer.name}</h3>

                <p className="mt-1">{trainer.discipline}</p>

                <p className="mt-2">${trainer.price_cad} CAD</p>

                <p className="mt-2">{trainer.active ? "Active" : "Inactive"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
