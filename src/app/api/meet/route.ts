import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Updated import path
import { google } from "googleapis";
import { z } from "zod";
import { addMinutes, formatISO } from "date-fns";

// Meet request schema validation
const meetSchema = z.object({
  summary: z.string(),
  description: z.string(),
  startDateTime: z.string(),
  durationMinutes: z.number().int().positive(),
  attendees: z.array(z.string()).default([]),
  timeZone: z.string().optional().default("Etc/UTC"), // Add timeZone with default
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to create meetings" },
        { status: 401 }
      );
    }

    // Debug session information
    console.log("Session info:", {
      user: session.user?.email,
      hasAccessToken: !!session.accessToken,
      provider: session.provider || "unknown"
    });

    // If user authenticated with GitHub, they can't access Google Calendar
    if (session.provider !== "google") {
      return NextResponse.json(
        { error: "Google Calendar access requires Google authentication. Please sign in with Google to create meetings." },
        { status: 403 }
      );
    }

    // For Google auth, ensure we have an access token
    if (!session.accessToken) {
      return NextResponse.json(
        { error: "Missing access token. Please re-authenticate with Google." },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    
    // Validate request data
    const validationResult = meetSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { summary, description, startDateTime, durationMinutes, attendees, timeZone } = validationResult.data;

    // Calculate end time by adding duration to start time
    const startTime = new Date(startDateTime);
    const endTime = addMinutes(startTime, durationMinutes);

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set credentials from session
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    // Create Calendar API client
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Format attendees for Google Calendar
    const formattedAttendees = attendees.map((email) => ({
      email,
      responseStatus: 'needsAction'
    }));

    // Create calendar event with Google Meet conference
    const event = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all", // Send email notifications to attendees
      requestBody: {
        summary,
        description,
        start: {
          dateTime: formatISO(startTime),
          timeZone: timeZone || "UTC", // Use provided timeZone or default to UTC
        },
        end: {
          dateTime: formatISO(endTime),
          timeZone: timeZone || "UTC", // Use provided timeZone or default to UTC
        },
        attendees: formattedAttendees,
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      conferenceDataVersion: 1,
    });

    // Extract the Google Meet link
    const meetLink = event.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri;

    if (!meetLink) {
      throw new Error("Failed to create Google Meet link");
    }

    // Log event creation with timezone information
    console.log("Event created successfully", {
      eventId: event.data.id,
      timeZone: timeZone,
      startTime: event.data.start?.dateTime,
      creator: session.user?.email
    });

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      meetLink,
      timeZone: timeZone,
      message: "Google Meet created successfully",
    });
  } catch (error) {
    console.error("Meet creation error:", error);
    // More detailed error response
    return NextResponse.json(
      {
        error: "Failed to create Google Meet",
        details: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
      { status: 500 }
    );
  }
}