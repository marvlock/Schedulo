"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
        return;
      }
      
      router.push("/dashboard");
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header matching landing page */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Schedulo</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white flex justify-center items-center px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/>
                </svg>
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
                </svg>
                Google
              </Button>
            </div>
          </div>

          {/* Removed "Don't have an account? Sign up" section */}
          {/* Removed testing credentials section */}
        </div>
      </main>

      {/* Simple footer matching landing page */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-bold text-white">Schedulo</span>
            </div>
            <p className="mt-4 md:mt-0 text-gray-400 text-sm">
              © {new Date().getFullYear()} Schedulo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}