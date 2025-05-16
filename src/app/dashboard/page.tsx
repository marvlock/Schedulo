"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  meetTimeZone: z.string().default("Etc/UTC"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

// Helper function to get tomorrow's date
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Function to format time for display
const formatTimeDisplay = (time: string | undefined) => {
  if (!time) return "12:00 PM";
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};

// Common time zones with friendly names
const commonTimeZones = [
  { value: "Etc/UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Anchorage", label: "Alaska (US)" },
  { value: "Pacific/Honolulu", label: "Hawaii (US)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time (Paris, Berlin)" },
  { value: "Europe/Helsinki", label: "Eastern European Time (Helsinki, Athens)" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Kolkata", label: "India (Mumbai, New Delhi)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Japan (Tokyo)" },
  { value: "Australia/Sydney", label: "Australia Eastern (Sydney, Melbourne)" },
  { value: "Pacific/Auckland", label: "New Zealand (Auckland)" },
];

// Helper function to get local time zone
const getLocalTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Etc/UTC";
  } catch {
    return "Etc/UTC";
  }
};

// Helper to format date and time with time zone
const formatDateTimeWithZone = (dateStr: string, timeStr: string, timeZone: string) => {
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: timeZone
    }).format(date);
  } catch (e) {
    console.error("Error formatting date with timezone:", e);
    return `${dateStr} ${timeStr}`;
  }
};

// Fix the getTimeZoneDisplay function to handle undefined values
const getTimeZoneDisplay = (timeZoneValue: string | undefined) => {
  if (!timeZoneValue) return "UTC (Coordinated Universal Time)";
  const tz = commonTimeZones.find(tz => tz.value === timeZoneValue);
  return tz ? tz.label : timeZoneValue;
};

export default function DashboardPage() {
  // Use session without variable name to keep the authentication active
  useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // Add state for date picker UI
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(getTomorrowDate()));

  // Find the local timezone
  const localTimeZone = getLocalTimeZone();
  const defaultTimeZone = commonTimeZones.find(tz => tz.value === localTimeZone) 
    ? localTimeZone 
    : "Etc/UTC";

  // For searching time zones
  const [timeZoneQuery, setTimeZoneQuery] = useState('');
  const [isTimeZoneDropdownOpen, setIsTimeZoneDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: "",
      cc: "",
      subject: "",
      body: "",
      includeMeet: false,
      meetDate: getTomorrowDate(),
      meetTime: "10:00",
      meetDuration: "60",
      meetTimeZone: defaultTimeZone,
    },
  });

  const includeMeet = watch("includeMeet");
  const meetTime = watch("meetTime");
  const meetDuration = watch("meetDuration");
  const meetTimeZone = watch("meetTimeZone");

  // Toggle show/hide Google Meet options
  const handleIncludeMeetToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("includeMeet", checked);
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDay(date);
    setValue("meetDate", date.toISOString().split('T')[0]);
  };

  // Filter time zones based on search query
  const filteredTimeZones = timeZoneQuery
    ? commonTimeZones.filter(tz => 
        tz.label.toLowerCase().includes(timeZoneQuery.toLowerCase()) || 
        tz.value.toLowerCase().includes(timeZoneQuery.toLowerCase()))
    : commonTimeZones;

  // Select a time zone
  const handleTimeZoneSelect = (value: string) => {
    setValue("meetTimeZone", value);
    setIsTimeZoneDropdownOpen(false);
    setTimeZoneQuery('');
  };

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
            timeZone: data.meetTimeZone, // Include the time zone
          }),
        });

        if (!meetResponse.ok) {
          throw new Error("Failed to create Google Meet");
        }

        const meetData = await meetResponse.json();
        setMeetLink(meetData.meetLink);
        
        // Update email body to include Meet link and meeting details with time zone
        const formattedDate = formatDateTimeWithZone(
          data.meetDate,
          data.meetTime,
          data.meetTimeZone
        );
        
        data.body = `${data.body}\n\n----- Meeting Details -----\nTime: ${formattedDate}\nDuration: ${data.meetDuration} minutes\nTime Zone: ${getTimeZoneDisplay(data.meetTimeZone)}\nJoin the meeting: ${meetData.meetLink}\n\nA calendar invitation has been sent to all recipients. The meeting will appear in your local time zone in your calendar.`;
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
      setMeetLink(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time options for time picker
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push(time);
      }
    }
    return options;
  };

  // Generate days of the week for date picker
  const generateDaysOfWeek = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  // Generate dates for the week view
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    // Start with today and show next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Get name of the month and year for display
  const getMonthYearDisplay = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDay.toDateString();
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

            {/* Google Meet Toggle */}
            <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all hover:border-blue-200 cursor-pointer" onClick={() => setValue("includeMeet", !includeMeet)}>
              <input
                type="checkbox"
                id="includeMeet"
                className="h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={includeMeet}
                onChange={handleIncludeMeetToggle}
              />
              <Label htmlFor="includeMeet" className="cursor-pointer text-gray-800 font-medium flex-grow">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952a4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  Create a Google Meet for this email
                </div>
              </Label>
            </div>

            {/* Google Meet Options - Show only if includeMeet is checked */}
            {includeMeet && (
              <div className="border p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 space-y-5 border-blue-200 shadow-sm transition-all duration-300">
                <h3 className="font-semibold text-blue-900 flex items-center text-lg mb-4 pb-2 border-b border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Configure Meeting Details
                </h3>

                {/* Date Picker - Enhanced Calendar Style */}
                <div className="mb-6">
                  <Label htmlFor="meetDate" className="text-gray-900 font-medium block mb-2 text-sm">
                    Date
                  </Label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-center mb-4 text-gray-900 font-medium">
                      {getMonthYearDisplay(selectedDay)}
                    </div>
                    
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {generateDaysOfWeek().map((day) => (
                        <div key={day} className="text-center text-xs text-gray-900 font-medium py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar dates */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateWeekDates().map((date, index) => (
                        <div
                          key={index}
                          className={`
                            text-center p-2 rounded-full cursor-pointer text-sm
                            ${isDateSelected(date) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                            ${isToday(date) && !isDateSelected(date) ? 'border border-blue-400' : ''}
                          `}
                          onClick={() => handleDateChange(date)}
                        >
                          {date.getDate()}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hidden input for form */}
                    <input 
                      type="hidden" 
                      id="meetDate"
                      {...register("meetDate")} 
                    />
                  </div>
                  {errors.meetDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetDate.message}</p>
                  )}
                </div>

                {/* Time Zone Selector */}
                <div className="mb-6 relative">
                  <Label htmlFor="meetTimeZone" className="text-gray-900 font-medium block mb-2 text-sm">
                    Time Zone
                  </Label>
                  <div className="relative">
                    <div 
                      className="w-full p-3 border border-gray-200 rounded-lg flex items-center justify-between bg-white cursor-pointer"
                      onClick={() => setIsTimeZoneDropdownOpen(!isTimeZoneDropdownOpen)}
                    >
                      <span className="text-gray-900">{getTimeZoneDisplay(meetTimeZone)}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-gray-700 transition-transform ${isTimeZoneDropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {isTimeZoneDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            value={timeZoneQuery}
                            onChange={(e) => setTimeZoneQuery(e.target.value)}
                            placeholder="Search time zones..."
                            className="w-full p-2 border border-gray-200 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredTimeZones.map((tz) => (
                            <div 
                              key={tz.value}
                              className={`p-2 cursor-pointer hover:bg-blue-50 ${meetTimeZone === tz.value ? 'bg-blue-100 font-medium' : ''}`}
                              onClick={() => handleTimeZoneSelect(tz.value)}
                            >
                              {tz.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input 
                    type="hidden" 
                    id="meetTimeZone"
                    {...register("meetTimeZone")} 
                  />
                  <p className="text-gray-800 text-xs mt-1">
                    The meeting will appear in each attendee&apos;s local time zone in their calendar.
                  </p>
                </div>

                {/* Time Picker - Enhanced Time Selection */}
                <div className="mb-6">
                  <Label htmlFor="meetTime" className="text-black font-semibold block mb-2 text-sm">
                    Time
                  </Label>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 flex items-center justify-between bg-blue-50 border-b border-gray-200">
                      <span className="text-black font-medium">Select start time: </span>
                      <span className="text-blue-900 font-bold">{formatTimeDisplay(meetTime)}</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
                      {generateTimeOptions().map((time) => (
                        <div
                          key={time}
                          className={`
                            text-center p-2 rounded cursor-pointer text-sm
                            ${time === meetTime ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-900'}
                          `}
                          onClick={() => setValue("meetTime", time)}
                        >
                          {formatTimeDisplay(time)}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hidden input for form */}
                    <input 
                      type="hidden" 
                      id="meetTime"
                      {...register("meetTime")} 
                    />
                  </div>
                  {errors.meetTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetTime.message}</p>
                  )}
                </div>

                {/* Duration Slider */}
                <div className="mb-6">
                  <Label htmlFor="meetDuration" className="text-gray-900 font-medium block mb-2 text-sm">
                    Duration: <span className="font-bold">{meetDuration} minutes</span>
                  </Label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-wrap gap-2 justify-between">
                      {['15', '30', '45', '60', '90', '120'].map((duration) => (
                        <div
                          key={duration}
                          className={`
                            rounded-full px-4 py-2 cursor-pointer text-sm text-center flex-grow
                            ${meetDuration === duration ? 
                              'bg-blue-600 text-white font-medium shadow-sm' : 
                              'bg-gray-100 hover:bg-gray-200 text-gray-900'}
                          `}
                          onClick={() => setValue("meetDuration", duration)}
                        >
                          {duration === '60' ? '1 hour' : 
                           duration === '90' ? '1.5 hours' : 
                           duration === '120' ? '2 hours' : 
                           `${duration} min`}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hidden input for form */}
                    <input 
                      type="hidden" 
                      id="meetDuration"
                      {...register("meetDuration")} 
                    />
                  </div>
                  {errors.meetDuration && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetDuration.message}</p>
                  )}
                </div>

                {/* Meeting Preview */}
                <div className="bg-white p-4 rounded-lg border border-blue-100 mt-4 shadow-sm">
                  <div className="text-blue-800 font-medium mb-2">Meeting Summary</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {selectedDay.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatTimeDisplay(meetTime)} • {meetDuration === '60' ? '1 hour' : meetDuration === '90' ? '1.5 hours' : meetDuration === '120' ? '2 hours' : `${meetDuration} minutes`}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{getTimeZoneDisplay(meetTimeZone)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>Google Meet link will be generated and sent to all recipients</span>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                      The meeting will be scheduled in {getTimeZoneDisplay(meetTimeZone)} and adjusted to each recipient&apos;s local time zone in their calendar.
                    </div>
                  </div>
                </div>
              </div>
            )}

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