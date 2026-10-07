"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [trainer, setTrainer] = useState<any>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchTrainer() {
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (error) {
        setMessage(`Could not load trainer: ${error.message}`);
        return;
      }

      if (!data) {
        setMessage("Trainer not found.");
        return;
      }

      setTrainer(data);
    }

    fetchTrainer();
  }, [slug]);
  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!trainer) {
      setMessage("Trainer could not be loaded.");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      trainer_id: trainer.id,
      session_date: date,
      session_time: time,
      location,
      goal,
      price_cad: trainer.price_cad,
      booking_status: "pending",
      payment_status: "unpaid",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/bookings");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-black">
          Book {trainer?.name ?? "Trainer"}
        </h1>

        {trainer && (
          <p className="mt-2">
            {trainer.discipline} • ${trainer.price_cad} CAD
          </p>
        )}

        <form
          onSubmit={handleBooking}
          className="mt-8 flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-semibold">Date</label>

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-lg border border-gray-300 px-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Time</label>

            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 w-full rounded-lg border border-gray-300 px-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Location</label>

            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Some location in Halifax"
              className="h-12 w-full rounded-lg border border-gray-300 px-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              What do you want to work on?
            </label>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="For example: boxing fundamentals, conditioning..."
              className="min-h-28 w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {message && <p className="text-red-600">{message}</p>}

          <button
            type="submit"
            className="h-14 rounded-xl bg-black font-bold text-white"
          >
            Request booking
          </button>
        </form>
      </div>
    </main>
  );
}
