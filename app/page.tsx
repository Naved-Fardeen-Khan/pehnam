import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

// This part pulls all active trainers from the Supabase database and randomly selects 3 of them to display on the homepage. If there is an error fetching the data, it displays an error message instead.
export default async function Home() {
  const { data: trainers, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("active", true);

  const disciplines = Array.from(
    new Set(
      (trainers ?? []).map((trainer) => trainer.discipline).filter(Boolean),
    ),
  ).sort();

  const randomTrainers =
    trainers?.sort(() => Math.random() - 0.5).slice(0, 3) ?? [];

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Pehnam</h1>
        <p className="mt-4 text-red-600">
          Could not load trainer: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-10 text-black">
      <h1 className="text-4xl font-black p-10">PEHNAM</h1>
      <div className="p-6">
        <p className="mt-2 text-black">
          Verified Halifax combat-sports coaches.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Meet our verified Halifax coaches.
          </h2>

          {randomTrainers.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {randomTrainers.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/trainers/${trainer.slug}`}
                  className="rounded-2xl bg-white p-6 text-black shadow-sm"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                    {trainer.name
                      .split(" ")
                      .map((word: string) => word[0])
                      .join("")}
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-black">
                      {trainer.name}
                    </h3>

                    {trainer.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-2 font-medium">{trainer.discipline}</p>

                  <p className="mt-1 text-black">
                    {trainer.city} • {trainer.years_experience}+ years
                    experience
                  </p>

                  <p className="mt-5 font-bold">
                    ${trainer.price_cad} CAD / session
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6">No trainers available.</p>
          )}
          <div className="mt-6 flex justify-center">
            <Link
              href="/trainers"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              View All Trainers
            </Link>
          </div>
        </section>
        <section id="disciplines" className="mt-24 w-full">
          <div className="w-full text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              Choose your discipline
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Train what matters to you.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl">
              Find private coaching across Halifax in the combat sport you want
              to improve.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {disciplines.map((discipline) => (
              <Link
                key={discipline}
                href={`/trainers?discipline=${encodeURIComponent(discipline)}`}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-black shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-bold">{discipline}</h3>
              </Link>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="mt-24">
          <div className="w-full text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              From choosing a coach to your first session.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl">
              Pehnam keeps the booking process simple from start to finish.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-5">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-2xl font-black">01</div>
              <h3 className="mt-4 font-bold">Choose discipline</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-2xl font-black">02</div>
              <h3 className="mt-4 font-bold">Tell us your goal</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-2xl font-black">03</div>
              <h3 className="mt-4 font-bold">Choose time & location</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-2xl font-black">04</div>
              <h3 className="mt-4 font-bold">Pehnam confirms your coach</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-2xl font-black">05</div>
              <h3 className="mt-4 font-bold">Pay & confirm</h3>
            </div>
          </div>
        </section>
        <section id="about" className="mt-24">
          <div className="w-full text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              About Pehnam
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              More than just booking a workout.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl">
              Pehnam connects people in Halifax with trusted combat-sports
              coaches for private, goal-focused training.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold">Verified Coaches</h3>

              <p className="mt-3">Real people with real coaching experience.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold">A Stronger Halifax</h3>

              <p className="mt-3">
                Support local coaches and train within your community.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold">All Levels Welcome</h3>

              <p className="mt-3">
                From complete beginners to experienced athletes.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold">More Than Fitness</h3>

              <p className="mt-3">
                Confidence, discipline, skills, and community.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
