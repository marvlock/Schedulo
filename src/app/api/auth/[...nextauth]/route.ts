// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth-config";

// Create the Auth object including handlers
const { handlers } = NextAuth(authConfig);

// Only export route handlers for the API route
export const { GET, POST } = handlers;