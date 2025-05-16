// These imports are used in the module augmentation
// Using import type to make it clear they're only for types
import type { Session as NextAuthSession } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends NextAuthSession {
    accessToken?: string;
    refreshToken?: string; // Add refreshToken to the Session interface
    error?: string;
    provider?: string; // Add the provider property
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    provider?: string; // Add the provider property
  }
}