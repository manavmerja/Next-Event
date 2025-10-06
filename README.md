# Next Event - Event Aggregator Platform

A full-stack event management and discovery platform built with Next.js, TypeScript, MongoDB, and Express.

## Features

- **Event Discovery**: Browse and search events by category, date, and keywords
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Event Registration**: Register for events with duplicate prevention
- **Interactive Maps**: Leaflet integration for event location visualization
- **Admin Dashboard**: Create and manage events (admin-only)
- **User Dashboard**: View registrations and manage profile
- **Dark Theme**: Beautiful dark-first design with purple accent colors
- **Responsive Design**: Mobile-first responsive layout
- **Smooth Animations**: Framer Motion animations throughout
- **Custom Cursor**: Glowing cursor effect for enhanced UX

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS v4**
- **Framer Motion** (animations)
- **React Leaflet** (maps)
- **SWR** (data fetching)
- **shadcn/ui** (UI components)

### Backend
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** (authentication)
- **bcryptjs** (password hashing)
- **express-validator** (input validation)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd next-event
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   \`\`\`env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/next-event?retryWrites=true&w=majority

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Next.js Public Variables
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   \`\`\`

4. **Connect to MongoDB Atlas**
   
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<cluster>` in the connection string
   - Add your IP address to the whitelist (or use 0.0.0.0/0 for development)

5. **Seed the database**
   \`\`\`bash
   npm run seed
   \`\`\`
   
   This creates:
   - Admin user: `admin@nextevent.com` / `admin123`
   - Student user: `student@nextevent.com` / `student123`
   - 6 sample events

6. **Run the development servers**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   This starts:
   - Next.js frontend: `http://localhost:3000`
   - Express backend: `http://localhost:3001`

## Project Structure

\`\`\`
next-event/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   ├── events/               # Event pages
│   ├── dashboard/            # User dashboard
│   ├── about/                # About page
│   ├── faq/                  # FAQ page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── navbar.tsx            # Navigation bar
│   ├── footer.tsx            # Footer
│   ├── event-card.tsx        # Event card component
│   ├── event-map.tsx         # Leaflet map component
│   └── ...
├── lib/                      # Utility functions
│   ├── api.ts                # API client
│   ├── auth-context.tsx      # Auth context provider
│   └── utils.ts              # Helper functions
├── server/                   # Express backend
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── lib/                  # Backend utilities
│   ├── scripts/              # Database scripts
│   └── index.ts              # Server entry point
├── public/                   # Static assets
├── .env.example              # Environment variables template
└── package.json              # Dependencies
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration

### Users
- `GET /api/users/me/registrations` - Get user's registrations

## Testing the Application

### Manual Test Checklist

1. **Authentication**
   - [ ] Sign up with new account
   - [ ] Login with existing account
   - [ ] Logout successfully
   - [ ] Access protected routes (dashboard)

2. **Event Discovery**
   - [ ] Browse events on home page
   - [ ] Filter events by category
   - [ ] Search events by keyword
   - [ ] View event details
   - [ ] See event location on map

3. **Event Registration**
   - [ ] Register for an event
   - [ ] Prevent duplicate registration
   - [ ] View registrations in dashboard
   - [ ] Cancel registration

4. **Admin Features** (login as admin)
   - [ ] Create new event
   - [ ] View created events
   - [ ] Update event details
   - [ ] Delete event

5. **UI/UX**
   - [ ] Responsive design on mobile
   - [ ] Smooth animations
   - [ ] Custom cursor effect
   - [ ] Scroll to top button
   - [ ] Toast notifications

### Sample API Requests (cURL)

**Signup:**
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "studentId": "STU002",
    "department": "Computer Science",
    "phone": "+1234567892"
  }'
\`\`\`

**Login:**
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@nextevent.com",
    "password": "admin123"
  }'
\`\`\`

**Get Events:**
\`\`\`bash
curl http://localhost:3001/api/events?category=Hackathon&limit=10
\`\`\`

**Create Event (Admin):**
\`\`\`bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "New Event",
    "description": "Event description",
    "category": "Technical",
    "startsAt": "2025-04-01T10:00:00",
    "venue": "Main Hall",
    "locationText": "Building B",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "bannerUrl": "/placeholder.svg"
  }'
\`\`\`

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

### Backend (Render/Railway/DigitalOcean)

1. Create new web service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm run dev:server`
5. Add environment variables
6. Deploy

### Database (MongoDB Atlas)

1. Already set up in development
2. Update connection string in production
3. Whitelist production server IPs
4. Enable authentication

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `CLOUDINARY_URL` | Cloudinary for image uploads | No |
| `EMAIL_HOST` | SMTP host for emails | No |
| `EMAIL_PORT` | SMTP port | No |
| `EMAIL_USER` | SMTP username | No |
| `EMAIL_PASS` | SMTP password | No |

## Design System

### Colors
- **Primary Accent**: `#a56aff` (Purple)
- **Background**: Dark gradient from `#061823` to black
- **Text**: Light foreground on dark background
- **Borders**: Purple accent with transparency

### Typography
- **Font Family**: Poppins
- **Weights**: 300, 400, 500, 600, 700

### Components
- All components use shadcn/ui with custom theming
- Consistent spacing and border radius
- Hover effects with scale and glow

## Future Enhancements

- [ ] Event bookmarking/wishlist
- [ ] Event reviews and ratings
- [ ] QR code check-in system
- [ ] Certificate generation
- [ ] Email reminders
- [ ] CSV export for registrants
- [ ] Social media sharing
- [ ] Event calendar view
- [ ] Advanced search filters
- [ ] User profile customization

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Email: info@nextevent.com

---

Built with ❤️ using Next.js and MongoDB
