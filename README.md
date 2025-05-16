# Schedulo

Schedulo is a modern web application that streamlines the process of scheduling meetings and sending emails in one unified workflow.

## Features

- **Unified Workflow**: Create emails and schedule meetings in one seamless process
- **Google Meet Integration**: Automatically generate meeting links and calendar invitations
- **Enhanced Date Selection**: Interactive calendar with month navigation for meeting scheduling
- **Authentication**: Secure login via Google with NextAuth v5
- **Modern UI**: Clean, responsive interface built with Tailwind CSS v4 and shadcn/ui components
- **Dark Mode Support**: Comfortable viewing experience in any lighting conditions

## Getting Started

### Prerequisites

- Node.js 18 or later
- Google account with Calendar API enabled

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Marvellousz/schedulo.git
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
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (e.g., http://localhost:3000)
   - Email service credentials

4. Start the development server
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` to use the application

## Tech Stack

- **Frontend**: 
  - Next.js 15.3 with App Router
  - React 19
  - Tailwind CSS v4
  - shadcn/ui components

- **State Management**:
  - React Hook Form v7 with Zod validation

- **Authentication**: 
  - NextAuth.js v5 (Beta)
  - OAuth providers (Google)

- **API Integration**:
  - Google APIs (Gmail, Calendar, Meet)
  - Nodemailer for email handling

- **Developer Experience**:
  - TypeScript
  - ESLint v9
  - Turbopack for faster development

## Usage

1. Log in using Google
2. Compose your email 
3. Toggle the "Create a Google Meet" option if needed
4. Select meeting date from the interactive calendar
5. Choose time, duration, and timezone for your meeting
6. Send your email with meeting details included
7. Calendar invitations are automatically sent to all recipients

## Advanced Features

- **Timezone Support**: Schedule meetings across different time zones
- **Duration Options**: Customize meeting length based on your needs
- **Calendar Integration**: Direct sync with Google Calendar
- **Email CC Support**: Include additional recipients as needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Pranav Murali 
