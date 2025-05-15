import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Updated import path
import nodemailer from "nodemailer";
import { z } from "zod";

// Email request schema validation
const emailSchema = z.object({
  to: z.union([
    z.string().email(), // Single email
    z.array(z.string().email()), // Array of emails
    z.string().refine((val) => {
      // Comma-separated email addresses
      const emails = val.split(',').map(email => email.trim());
      return emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, {
      message: "Invalid email format. Please provide valid email addresses separated by commas."
    })
  ]),
  cc: z.union([
    z.string().email(),
    z.array(z.string().email()),
    z.string().refine((val) => {
      const emails = val.split(',').map(email => email.trim());
      return emails.length === 0 || emails.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    })
  ]).optional().or(z.literal("")),
  subject: z.string(),
  body: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to send emails" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    
    // Validate request data
    const validationResult = emailSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { to, cc, subject, body: emailBody } = validationResult.data;

    // Process recipients - convert to a format that nodemailer accepts
    // Nodemailer accepts comma-separated strings or arrays for recipients
    const processRecipients = (recipients: string | string[]) => {
      if (Array.isArray(recipients)) {
        return recipients;
      }
      // If it's a string that contains commas, split it
      if (typeof recipients === 'string' && recipients.includes(',')) {
        return recipients.split(',').map(email => email.trim());
      }
      // Otherwise, return as is
      return recipients;
    };

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_SERVER_PASSWORD || "your-app-password",
      },
    });

    // Prepare email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || "Your App <your-email@gmail.com>",
      to: processRecipients(to),
      ...(cc && { cc: processRecipients(cc) }),
      subject,
      // Generate plain text version by stripping HTML tags
      text: emailBody.replace(/<[^>]*>/g, ''),
      // Use the HTML content directly from the rich text editor
      html: emailBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully",
      recipients: Array.isArray(mailOptions.to) ? mailOptions.to.length : 1
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: (error as Error).message },
      { status: 500 }
    );
  }
}