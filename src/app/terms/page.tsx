import Link from "next/link";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none text-gray-700">
            <p className="text-sm text-gray-500">Last updated: May 16, 2025</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Schedulo ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Your continued use of the Service following the posting of changes constitutes your acceptance of such changes.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">2. Description of Service</h2>
            <p>
              Schedulo provides tools to create, schedule, and manage meetings along with email communications in one integrated platform. Our Service utilizes Google API services to connect with Google Calendar and Google Meet for scheduling functionality.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">3. User Accounts</h2>
            <p>
              To use certain features of our Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Providing accurate and complete information during registration</li>
              <li>Maintaining the security of your password and account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to terminate accounts, remove or edit content, or cancel services at our sole discretion.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">4. User Content</h2>
            <p>
              You retain all ownership rights to content you submit, post, or display using our Service ("User Content"). By providing User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute such content for the purpose of providing and improving our Service.
            </p>
            <p>
              You agree not to submit User Content that:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Infringes on any third party's intellectual property or other rights</li>
              <li>Contains unlawful, defamatory, abusive, or objectionable material</li>
              <li>Contains viruses, malware, or other harmful code</li>
              <li>Violates or encourages violation of any applicable laws or regulations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">5. Google API Services</h2>
            <p>
              Our Service integrates with Google API services to provide core functionality. By using these integrations, you agree to:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Google's Terms of Service</li>
              <li>Google's Privacy Policy</li>
            </ul>
            <p>
              Our use and transfer to any other app of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">6. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SCHEDULO, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
            <p>
              SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">7. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Schedulo, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or related to your use of the Service or violation of these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Schedulo is established, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">11. Contact</h2>
            <p>
              If you have any questions or concerns about these Terms, please contact us at:
            </p>
            <p className="my-4">
              Email: terms@schedulo.app<br />
              Schedulo Legal Department<br />
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