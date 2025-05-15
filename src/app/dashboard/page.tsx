"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Import directly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

// Form validation schema for email
const emailFormSchema = z.object({
  to: z.string().refine((val) => {
    // Allow a single email or comma-separated list of emails
    const emails = val.split(',').map(email => email.trim());
    return emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, { 
    message: "Please enter valid email addresses (separate multiple emails with commas)" 
  }),
  cc: z.string().refine((val) => {
    // Empty string or valid emails
    if (val === "") return true;
    const emails = val.split(',').map(email => email.trim());
    return emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, { 
    message: "Please enter valid email addresses (separate multiple emails with commas)" 
  }).optional().or(z.literal("")),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Email body is required" }),
  includeMeet: z.boolean().default(false),
  meetDate: z.string().optional(),
  meetTime: z.string().optional(),
  meetDuration: z.string().optional(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

export default function DashboardPage() {
  // Use session without variable name to keep the authentication active
  useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  // Define the function with an underscore prefix for the parameter to indicate it's intentionally unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setShowMeetOptions = (_value: boolean) => {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: "",
      cc: "",
      subject: "",
      body: "",
      includeMeet: false,
      meetDate: new Date().toISOString().split('T')[0],
      meetTime: "10:00",
      meetDuration: "60",
    },
  });

  // Remove includeMeet since it's not being used
  // const includeMeet = watch("includeMeet");

  // Function to handle form submission
  async function onSubmit(data: EmailFormValues) {
    setIsLoading(true);
    try {
      // First, create a Google Meet if requested
      if (data.includeMeet) {
        if (!data.meetDate || !data.meetTime || !data.meetDuration) {
          toast.error("Please complete all meeting fields");
          setIsLoading(false);
          return;
        }

        // Parse recipients for attendees
        const toEmails = data.to.split(',').map(email => email.trim());
        const ccEmails = data.cc ? data.cc.split(',').map(email => email.trim()).filter(email => email !== "") : [];
        const attendees = [...toEmails, ...ccEmails];

        // Create Google Meet
        const meetResponse = await fetch("/api/meet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: data.subject,
            description: data.body,
            startDateTime: `${data.meetDate}T${data.meetTime}:00`,
            durationMinutes: parseInt(data.meetDuration),
            attendees: attendees, // Send all recipients as attendees
          }),
        });

        if (!meetResponse.ok) {
          throw new Error("Failed to create Google Meet");
        }

        const meetData = await meetResponse.json();
        setMeetLink(meetData.meetLink);
        
        // Update email body to include Meet link and meeting details
        const meetingDate = new Date(`${data.meetDate}T${data.meetTime}:00`);
        const formattedDate = meetingDate.toLocaleString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true 
        });
        
        data.body = `${data.body}\n\n----- Meeting Details -----\nTime: ${formattedDate}\nDuration: ${data.meetDuration} minutes\nJoin the meeting: ${meetData.meetLink}\n\nA calendar invitation has been sent to all recipients.`;
      }

      // Send the email
      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }

      // Show appropriate success message based on whether a meeting was scheduled
      if (data.includeMeet) {
        toast.success("Email sent and calendar invitations delivered to all recipients!");
      } else {
        toast.success("Email sent successfully!");
      }
      
      reset();
      setShowMeetOptions(false);
      setMeetLink(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Send Email & Create Meeting</h1>
        <p className="text-blue-100 mt-2">
          Create a Google Meet and send the link in an email
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Form */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="to" className="text-gray-700 font-medium">To</Label>
              <Input
                id="to"
                placeholder="recipient@example.com, recipient2@example.com"
                {...register("to")}
                className="mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.to && (
                <p className="text-red-600 text-sm mt-1">{errors.to.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Separate multiple email addresses with commas
              </p>
            </div>

            <div>
              <Label htmlFor="cc" className="text-gray-700 font-medium">CC (Optional)</Label>
              <Input
                id="cc"
                placeholder="cc@example.com, cc2@example.com"
                {...register("cc")}
                className="mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.cc && (
                <p className="text-red-600 text-sm mt-1">{errors.cc.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Separate multiple email addresses with commas
              </p>
            </div>

            <div>
              <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                {...register("subject")}
                className="mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="body" className="text-gray-700 font-medium">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Write your email content here..."
                {...register("body")}
                className="min-h-[150px] mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {errors.body && (
                <p className="text-red-600 text-sm mt-1">{errors.body.message}</p>
              )}
            </div>

            {/* Google Meet Toggle - Keeping checkbox but not using it for visibility toggling */}
            <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <input
                type="checkbox"
                id="includeMeet"
                className="h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                {...register("includeMeet")}
              />
              <Label htmlFor="includeMeet" className="cursor-pointer text-gray-800 font-medium">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952a4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  Create a Google Meet for this email
                </div>
              </Label>
            </div>

            {/* Google Meet Options - Always visible */}
            <div className="border p-6 rounded-lg bg-blue-50 space-y-4 border-blue-100 shadow-sm">
              <h3 className="font-medium text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Meeting Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="meetDate" className="text-gray-700 font-medium">Date</Label>
                  <Input
                    type="date"
                    id="meetDate"
                    {...register("meetDate")}
                    className="mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  {errors.meetDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="meetTime" className="text-gray-700 font-medium">Time</Label>
                  <Input
                    type="time"
                    id="meetTime"
                    {...register("meetTime")}
                    className="mt-1 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  {errors.meetTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetTime.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="meetDuration" className="text-gray-700 font-medium">Duration (minutes)</Label>
                  <select
                    id="meetDuration"
                    className="w-full rounded-md border border-gray-200 py-2 px-3 mt-1 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black"
                    {...register("meetDuration")}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                  {errors.meetDuration && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetDuration.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : "Send Email"}
            </Button>
            
            {/* Display Meet Link if created */}
            {meetLink && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                <div className="flex items-center text-green-800 font-medium mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  Meeting created successfully!
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Link: <a href={meetLink} target="_blank" rel="noopener noreferrer" className="underline font-medium">{meetLink}</a>
                </p>
                <p className="text-sm text-green-700 mt-1">
                  This link has been included in your email.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}