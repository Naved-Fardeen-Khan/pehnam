import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TrainerProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: trainer, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
        <p>Could not load trainer: {error.message}</p>
      </main>
    );
  }

  if (!trainer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-black">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/" className="text-sm font-semibold hover:underline">
          ← Back to home
        </Link>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Trainer photo placeholder */}
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-black text-4xl font-bold text-white">
              {trainer.name
                .split(" ")
                .map((word: string) => word[0])
                .join("")}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black">{trainer.name}</h1>

                {trainer.verified && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="mt-3 text-xl font-semibold">{trainer.discipline}</p>

              <p className="mt-2">
                {trainer.city} • {trainer.years_experience}+ years experience
              </p>

              {trainer.rating && (
                <p className="mt-2">
                  ⭐ {trainer.rating} ({trainer.review_count} reviews)
                </p>
              )}

              {trainer.bio && (
                <p className="mt-6 max-w-2xl leading-7">{trainer.bio}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t pt-6">
                <div>
                  <p className="text-sm">Private session</p>

                  <p className="text-2xl font-bold">${trainer.price_cad} CAD</p>
                </div>
                <Link
                  href={`/book/${trainer.slug}`}
                  className="rounded-xl bg-black px-8 py-4 font-bold text-white"
                >
                  Book session
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
