"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh(); // Refresh the page to update the authentication state
  }

  return (
    <main>
        <h1 className="text-4xl font-black p-10">Sign In</h1>
        <form onSubmit={handleSignIn} className="flex max flex-col gap-4 p-10">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
          <button
            type="submit"
            className="rounded bg-black text-white p-2 hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
        {message && <p className="p-10 text-red-600">{message}</p>}
        <p className="p-10">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </main>
  );
}