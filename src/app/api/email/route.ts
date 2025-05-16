import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import nodemailer from "nodemailer";
import { z } from "zod";

// Email request schema validation
const emailSchema = z.object({
  to: z.union([
    z.string().email(),
    z.array(z.string().email()),
    z.string().refine((val) => {
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

    // Debug session and environment
    console.log("Email route - Session info:", {
      user: session.user?.email,
      provider: session.provider || "unknown",
      emailServerConfigured: !!process.env.EMAIL_SERVER_HOST,
    });

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
    const processRecipients = (recipients: string | string[]) => {
      if (Array.isArray(recipients)) {
        return recipients;
      }
      if (typeof recipients === 'string' && recipients.includes(',')) {
        return recipients.split(',').map(email => email.trim());
      }
      return recipients;
    };

    // Verify email configuration is present
    if (!process.env.EMAIL_SERVER_USER) {
      return NextResponse.json(
        { 
          error: "Email server not configured properly", 
          details: "The required email server environment variables are not set."
        },
        { status: 500 }
      );
    }

    // Create Nodemailer transporter using OAuth2 for Gmail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_SERVER_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: session.refreshToken,
        accessToken: session.accessToken,
      },
    });

    // Verify SMTP connection configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (smtpError) {
      console.error("SMTP verification failed:", smtpError);
      return NextResponse.json(
        { 
          error: "Failed to connect to email server", 
          details: (smtpError as Error).message 
        },
        { status: 500 }
      );
    }

    // Use the authenticated user's info if available
    const senderName = session.user?.name || 'Schedulo App User';
    const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER;

    // Prepare email data
    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: processRecipients(to),
      ...(cc && { cc: processRecipients(cc) }),
      subject,
      // Generate plain text version by stripping HTML tags
      text: emailBody.replace(/<[^>]*>/g, ''),
      // Use the HTML content directly from the rich text editor
      html: emailBody,
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: info.messageId,
      recipients: Array.isArray(mailOptions.to) ? mailOptions.to.length : 1,
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: (error as Error).message },
      { status: 500 }
    );
  }
}