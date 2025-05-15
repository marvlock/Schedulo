"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Create a client component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "Unknown error";

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Please contact support.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link may have been expired or already used.",
    OAuthSignin: "Error in the OAuth sign-in process.",
    OAuthCallback: "Error in the OAuth callback process.",
    OAuthCreateAccount: "Unable to create OAuth provider account.",
    EmailCreateAccount: "Unable to create email provider account.",
    Callback: "Error in the OAuth callback handler.",
    OAuthAccountNotLinked: "This email is already associated with another account.",
    default: "An unexpected error occurred. Please try again."
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-red-600">
            {errorMessage}
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Error code: {error}
          </p>
        </div>
        <div className="mt-6">
          <Link 
            href="/auth/signin" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}