"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(!!user);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <nav className="border-b border-gray-200 bg-white text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <Link href="/" className="text-2xl font-black tracking-tight">
          PEHNAM
        </Link>

        <div className="flex items-center gap-12 text-sm font-semibold">
          <Link href="/trainers">Coaches</Link>
          <Link href="/#disciplines">Disciplines</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#about">About</Link>
          {loggedIn ? (
            <>
              <Link href="/bookings" className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800">
                My Bookings
              </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Log Out
            </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded border border-black px-4 py-2 text-black hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
