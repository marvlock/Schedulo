"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./button";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold tracking-tight">Schedulo</span>
          </Link>
          <div className="flex items-center space-x-4">
            {session?.user?.name && (
              <span className="text-sm text-white">
                Hello, {session.user.name}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 border-none"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}