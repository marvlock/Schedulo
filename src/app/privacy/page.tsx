import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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
              <button className="bg-white text-blue-600 hover:bg-blue-50 rounded-md px-4 py-2 text-sm font-medium">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-10 px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none text-gray-700">
            <p className="text-sm text-gray-500">Last updated: May 16, 2025</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">1. Introduction</h2>
            <p>
              Welcome to Schedulo ("we," "our," or "us"). We are committed to protecting your privacy and the information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            <p>
              By accessing or using Schedulo, you consent to the practices described in this Privacy Policy. If you do not agree with the practices described here, please do not use our application.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 my-4">
              <li><strong>Account Information:</strong> When you create an account, we collect your email address, name, and password.</li>
              <li><strong>User Content:</strong> Information you provide when using our application, such as email content, meeting details, attendee lists, and calendar data.</li>
              <li><strong>Google Account Information:</strong> If you choose to sign in with Google, we access your Google profile information and the Google services necessary for our functionality (Google Calendar, Google Meet).</li>
              <li><strong>Usage Information:</strong> We collect information about how you use our application, including log data, device information, and analytics data.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 my-4">
              <li>Provide, maintain, and improve our service</li>
              <li>Process and complete transactions</li>
              <li>Create and manage Google Meet events</li>
              <li>Send email invitations to specified recipients</li>
              <li>Authenticate your access to our application</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send administrative emails and service updates</li>
              <li>Analyze usage patterns to improve our application</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">4. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 my-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us provide our services (such as email delivery, hosting services, analytics providers)</li>
              <li><strong>Google Services:</strong> To facilitate calendar events and meetings</li>
              <li><strong>Email Recipients:</strong> Information you include in emails will be shared with the recipients you specify</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">5. Google API Services</h2>
            <p>
              Our application uses Google API Services for authentication and to interact with Google Calendar and Google Meet. Our use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Accessing, correcting, or deleting your personal information</li>
              <li>Objecting to our processing of your information</li>
              <li>Requesting portability of your information</li>
              <li>Withdrawing consent for future processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">10. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our practices, please contact us at:
            </p>
            <p className="my-4">
              Email: privacy@schedulo.app<br />
              Schedulo Support<br />
              123 Calendar Street<br />
              Email City, EC 12345
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-bold text-white">Schedulo</span>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-6 items-center">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                © {new Date().getFullYear()} Schedulo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}