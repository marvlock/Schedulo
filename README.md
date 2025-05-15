# Schedulo

Schedulo is a modern web application that streamlines the process of scheduling meetings and sending emails in one unified workflow.

## Features

- **Unified Workflow**: Create emails and schedule meetings in one seamless process
- **Google Meet Integration**: Automatically generate meeting links and calendar invitations
- **Rich Text Editor**: Format your emails with a user-friendly editor
- **Authentication**: Secure login via Google and GitHub OAuth
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- Google account with Calendar API enabled
- GitHub account (optional, for OAuth login)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/schedulo.git
   cd schedulo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create and configure environment variables
   ```bash
   cp .env.example .env.local
   ```
   
   Then fill in:
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (for GitHub login)
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (e.g., http://localhost:3000)
   - Email service credentials

4. Start the development server
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` to use the application

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Email Service**: Nodemailer
- **Calendar API**: Google Calendar API
- **Form Handling**: React Hook Form with Zod validation

## Usage

1. Log in using Google or GitHub
2. Compose your email 
3. Toggle the "Create a Google Meet" option if needed
4. Fill in meeting details (date, time, duration)
5. Send your email with meeting details included
6. Calendar invitations are automatically sent to all recipients

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Pranav Murali
