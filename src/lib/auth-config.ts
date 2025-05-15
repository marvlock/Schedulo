import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `expiresAt`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || "",
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      // Fall back to old refresh token, but if we got a new one, use it
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Define the config
export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      // Explicitly define the authorization endpoint to avoid URL encoding issues
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: {
          scope: "read:user user:email"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? account.expires_at * 1000 : 0, // Convert to milliseconds
          provider: account.provider, // Save the provider type
        };
      }

      // Return previous token if the access token has not expired yet
      // Add a 5-minute safety margin
      if (token.expiresAt && Date.now() < token.expiresAt - 5 * 60 * 1000) {
        return token;
      }

      // Access token has expired, try to refresh it
      // Only attempt refresh for Google accounts, GitHub tokens don't expire as often
      if (token.provider === "google" && token.refreshToken) {
        return refreshAccessToken(token);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.error) {
        session.error = token.error;
      }
      // Add the provider to the session for client-side awareness
      session.provider = token.provider as string;
      return session;
    },
    async signIn({ account }) {
      if (account?.provider === "google") {
        // Allow any Google sign in during development
        return true;
      }
      if (account?.provider === "github") {
        // Allow any GitHub sign in
        return true;
      }
      return true; // Allow sign in for other providers
    },
    // Add redirect callback to ensure consistent redirect behavior
    async redirect({ url, baseUrl }) {
      // If the URL is absolute and starts with the base URL, allow it
      if (url.startsWith(baseUrl)) return url;
      // If the URL is a relative URL, join it with the base URL
      else if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Always redirect to dashboard after successful authentication
      if (url.includes('/api/auth/signin') || url.includes('/api/auth/callback')) {
        return `${baseUrl}/dashboard`;
      }
      // Default to the base URL for everything else
      return baseUrl;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // Explicitly set after sign-in redirect to dashboard
    signOut: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}