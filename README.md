# EventEase - Event Planning and Management Tool

EventEase is a comprehensive event management solution designed for efficient and professional handling of event planning and participant engagement. The application allows authenticated users with specific roles (Admin, Staff, and Event Owner) to seamlessly manage events, participants, and interactions.

## Features

### Authentication & Authorization
- Role-based access control (Admin, Staff, Event Owner)
- Secure email-based authentication
- Protected routes and API endpoints

### Event Management
- Create, edit, and delete events
- Customizable event fields
- Public event sharing
- RSVP collection and management

### Attendee Management
- Track RSVPs with timestamps
- Export attendee data to CSV
- Filter and search attendees

### Dashboard & Analytics
- Overview of events and attendees
- Event-specific statistics
- Recent activity tracking

## Tech Stack

- **Language**: TypeScript
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS v4 with shadcn/ui
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js v22.16.0 or higher
- MongoDB database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/eventease.git
   cd eventease
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file based on `.env.example` and fill in your environment variables:
   \`\`\`
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sample Credentials

For testing purposes, you can use the following credentials:

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Staff User**:
  - Email: staff@example.com
  - Password: password123

- **Event Owner**:
  - Email: owner@example.com
  - Password: password123

## Deployment

The application is deployed on Vercel. You can access the live version at [https://eventease.vercel.app](https://eventease.vercel.app).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Your Full Name
- GitHub: [github.com/yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourusername](https://linkedin.com/in/yourusername)
