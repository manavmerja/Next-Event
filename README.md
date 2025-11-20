# Next Event - Event Aggregator Platform 🚀

> Part of the **GitHub Developer Program** | Full-Stack MERN Application

A modern, full-stack event management and discovery platform built with Next.js 15, TypeScript, MongoDB, and Express. It features a beautiful dark-themed UI, secure authentication, and robust admin tools.

🔗 **Live Demo:** [https://v0-event-aggregator-web-app.vercel.app](https://v0-event-aggregator-web-app.vercel.app)

## ✨ Key Features

### 🌟 User Features
* **Event Discovery:** Advanced search & filtering by category (Hackathons, Sports, etc.) and keywords.
* **Event Details:** View complete event info, location maps (Leaflet), and schedules.
* **Wishlist & Bookmarking:** Save events to your personal wishlist with a single click (Neon Cyan Glow effect ❤️).
* **Reviews & Ratings:** Rate events (1-5 stars) and leave feedback for organizers.
* **User Dashboard:** Track registered events and view participation history.
* **Secure Auth:** Login/Signup using JWT with secure, httpOnly cookies (SameSite=None support).

### 🛡️ Admin Features
* **Admin Dashboard:** Visual statistics for total users, events, and registrations.
* **Event Management:** Create, Edit, and Delete events with ease.
* **User Management:** View all users, change roles (Student ↔ Admin), and manage accounts.
* **Registration Tracking:** View detailed lists of who registered for which event.

### 🎨 UI/UX
* **Cyberpunk Theme:** Dark-first design with **Neon Cyan (#00F0FF)** and **Purple (#a56aff)** accents.
* **Smooth Animations:** Framer Motion used for page transitions and hover effects.
* **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.
* **Live GitHub Stats:** Real-time star/fork count widget in the footer using GitHub API.

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript, TailwindCSS v4, Framer Motion, Lucide React, shadcn/ui |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs, httpOnly Cookies |
| **DevOps** | Vercel (Frontend), Render (Backend), GitHub Actions (CI/CD) |

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* MongoDB Atlas Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/manavmerja/Next-Event.git](https://github.com/manavmerja/Next-Event.git)
    cd next-event
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory:
    ```env
    # MongoDB Connection
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/next-event

    # JWT Secret (Secure Random String)
    JWT_SECRET=your_super_secret_key_here

    # Backend API URL (For local dev)
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    
    # Environment
    NODE_ENV=development
    ```

4.  **Seed the Database (Optional)**
    Populate the DB with sample data (1 Admin, 1 Student, 6 Events).
    ```bash
    pnpm run seed
    ```

5.  **Run Development Servers**
    Start both Frontend (Next.js) and Backend (Express) concurrently.
    ```bash
    pnpm run dev
    ```
    * Frontend: `http://localhost:3000`
    * Backend: `http://localhost:3001`

## 📂 Project Structure

next-event/

├── app/                  # Next.js App Router (Frontend Pages)

│   ├── admin/            # Protected Admin Dashboard

│   ├── auth/             # Login/Signup Pages

│   ├── events/           # Explore & Detail Pages

│   └── dashboard/        # Student Dashboard

├── components/           # Reusable UI Components (Navbar, EventCard, Reviews)

├── lib/                  # API helpers & Auth Context

├── server/               # Express Backend Logic

│   ├── models/           # Mongoose Schemas (User, Event, Review, Registration)

│   ├── routes/           # API Endpoints

│   └── index.ts          # Server Entry Point

└── public/               # Static Assets


## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| POST | `/api/auth/login` | User Login (Cookie based) | Public |
| POST | `/api/auth/signup` | Register new user | Public |
| GET | `/api/auth/me` | Get current user session | Private |
| **Events** | | | |
| GET | `/api/events` | Get all events (with search/filter) | Public |
| POST | `/api/events` | Create new event | Admin |
| POST | `/api/events/:id/bookmark` | Toggle Wishlist | Private |
| **Reviews** | | | |
| POST | `/api/events/:id/reviews` | Add 5-star rating & review | Private |
| GET | `/api/events/:id/reviews` | Get reviews for an event | Public |

## 🤝 Contributing

Contributions are welcome! 
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**Manav Merja** - [GitHub Profile](https://github.com/manavmerja)

Project Link: [https://github.com/manavmerja/Next-Event](https://github.com/manavmerja/Next-Event)

---
*Built with ❤️ and lots of coffee ☕*