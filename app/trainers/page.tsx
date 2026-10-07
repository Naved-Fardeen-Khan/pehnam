import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TrainersPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string }>;
}) {
  const { discipline } = await searchParams;

  let query = supabase
  .from("trainers")
  .select("*")
  .eq("active", true);
  if (discipline) {
    query = query.eq("discipline", discipline);
  }
  
  const { data: trainers, error } = await query.order("name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
        <h1 className="text-3xl font-bold">Trainers</h1>

        <p className="mt-4 text-red-600">
          Could not load trainers: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/" className="text-sm font-semibold hover:underline">
          ← Back to home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-widest">
            Halifax combat-sports coaching
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Meet our verified coaches.
          </h1>

          <p className="mt-3">
            Find a coach based on discipline, experience, and training goals.
          </p>
        </div>

        {trainers && trainers.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => (
              <Link
                key={trainer.id}
                href={`/trainers/${trainer.slug}`}
                className="block rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                  {trainer.name
                    .split(" ")
                    .map((word: string) => word[0])
                    .join("")}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{trainer.name}</h2>

                  {trainer.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p className="mt-3 font-semibold">{trainer.discipline}</p>

                <p className="mt-2">
                  {trainer.city} • {trainer.years_experience}+ years experience
                </p>

                {trainer.bio && (
                  <p className="mt-4 line-clamp-3">{trainer.bio}</p>
                )}

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <span className="font-bold">${trainer.price_cad} CAD</span>

                  <span>
                    ⭐ {trainer.rating} ({trainer.review_count})
                  </span>
                </div>

                <p className="mt-5 font-bold">View profile →</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10">No trainers available.</p>
        )}
      </div>
    </main>
  );
}
