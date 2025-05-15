import NextAuth from "next-auth";
import { authConfig } from "./auth-config";

// Export the auth helper functions
const { signIn, signOut, auth } = NextAuth(authConfig);

export { signIn, signOut, auth };