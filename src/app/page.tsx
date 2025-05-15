import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header matching login page */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xl font-bold tracking-tight">Schedulo</span>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
        {/* Hero section */}
        <div className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  <span className="block">Simplify your</span>
                  <span className="block text-blue-600">meeting workflow</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  Create Google Meet events and send professional email invitations in one seamless platform. Save time and boost your productivity.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                  <Link href="/login">
                    <Button size="lg" className="px-6 py-3 text-base font-medium shadow-md bg-blue-600 hover:bg-blue-700">
                      Get Started — It's Free
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-white p-8 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="mb-4">
                        <div className="h-4 w-20 bg-blue-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-blue-300 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-blue-100 rounded w-full"></div>
                        <div className="h-3 bg-blue-100 rounded w-5/6"></div>
                        <div className="h-3 bg-blue-100 rounded w-4/6"></div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <div className="h-8 w-20 bg-blue-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Everything you need in one place
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform simplifies your communication workflow
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Send Emails
                    </h3>
                    <p className="text-gray-600">
                      Create professional emails with our intuitive editor featuring smart templates and rich formatting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Create Meetings
                    </h3>
                    <p className="text-gray-600">
                      Schedule Google Meet events with intelligent time suggestions and calendar integration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      All-in-One
                    </h3>
                    <p className="text-gray-600">
                      Combine meeting creation and email invitations in one streamlined process with automated reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-600">
          <div className="container mx-auto px-4 max-w-7xl py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                Ready to streamline your meeting workflow?
              </h2>
              <div className="mt-6">
                <Link href="/login">
                  <Button size="lg" className="px-6 py-3 text-base font-medium bg-white text-blue-600 hover:bg-blue-50">
                    Get Started Now
                  </Button>
                </Link>
              </div>
              {/* Removed "No credit card required" text */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching login page */}
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