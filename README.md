<div align="center">

  <h1>🚀 Next Event</h1>

  <h3>The Ultimate Event Aggregator & Discovery Platform</h3>

  <p>
    A modern, full-stack event management system built for the community. <br />
    Features a cyberpunk aesthetic, robust admin tools, and seamless event discovery.
  </p>

  <p>
    <a href="https://v0-event-aggregator-web-app.vercel.app"><strong>View Live Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/manavmerja/Next-Event/issues">Report Bug</a>
    ·
    <a href="https://github.com/manavmerja/Next-Event/pulls">Request Feature</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/license/manavmerja/Next-Event?style=for-the-badge&color=blue" alt="License" />
    <img src="https://img.shields.io/github/last-commit/manavmerja/Next-Event?style=for-the-badge" alt="Last Commit" />
    <img src="https://img.shields.io/github/stars/manavmerja/Next-Event?style=for-the-badge&color=yellow" alt="Stars" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  </p>
</div>

<br />

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About the Project

**Next Event** is part of the **GitHub Developer Program**. It is a comprehensive Full-Stack MERN application designed to bridge the gap between event organizers and attendees.

Built with performance and aesthetics in mind, it leverages the power of **Next.js 15** for a lightning-fast frontend and **Express/MongoDB** for a scalable backend. The design language follows a "Dark-First" Cyberpunk theme, utilizing neon accents to create an immersive user experience.

---

## ✨ Key Features

### 🚀 **User Experience**
* **Intelligent Discovery:** Advanced filtering by category (Hackathons, Workshops, Sports) and real-time keyword search.
* **Rich Event Data:** Integrated Leaflet maps for location, detailed schedules, and organizer profiles.
* **Interactive Wishlist:** Bookmark events instantly with a custom Neon Cyan Glow effect ❤️.
* **Community Review System:** 5-star rating system with text feedback capabilities.
* **Personalized Dashboard:** Track registered events and view participation history in one place.
* **Secure Authentication:** JWT-based stateless authentication using secure, `httpOnly` cookies with `SameSite` support.

### 🛡️ **Administrative Control**
* **Visual Analytics:** Dashboard displaying registered user count, total events, and active registrations.
* **CRUD Management:** Complete control to Create, Edit, and Delete events.
* **User Role Management:** Promote Students to Admins or manage account access.
* **Registration Tracking:** Detailed logs of attendees for every specific event.

### 🎨 **UI/UX Design**
* **Cyberpunk Aesthetic:** A deep dark theme accented with **Neon Cyan (#00F0FF)** and **Purple (#a56aff)**.
* **Fluid Motion:** Powered by **Framer Motion** for seamless page transitions and micro-interactions.
* **Responsive:** Grid systems optimized for Mobile, Tablet, and Desktop viewports.
* **Live GitHub Stats:** Integrated widget fetching real-time repository data.

---

## 🛠 Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind_v4-teal?logo=tailwind-css) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-purple?logo=framer) ![Shadcn](https://img.shields.io/badge/ShadCN-black?logo=shadcnui) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js) ![Express](https://img.shields.io/badge/Express.js-gray?logo=express) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-green?logo=mongodb) ![Mongoose](https://img.shields.io/badge/Mongoose-red?logo=mongoose) |
| **Security** | ![JWT](https://img.shields.io/badge/JWT-token-pink?logo=jsonwebtokens) ![Bcrypt](https://img.shields.io/badge/Bcrypt-hash-orange) |
| **DevOps** | ![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel) ![Render](https://img.shields.io/badge/Render-cloud?logo=render) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-blue?logo=githubactions) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **pnpm**
* A **MongoDB Atlas** account (or local MongoDB instance)

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

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    # Database
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/next-event

    # Security
    JWT_SECRET=your_super_secret_complex_key

    # API Configuration
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    
    # Environment
    NODE_ENV=development
    ```

4.  **Seed the Database (Optional)**
    Populate your database with dummy data (1 Admin, 1 Student, 6 Events).
    ```bash
    pnpm run seed
    ```

5.  **Run the Application**
    Start both the Next.js frontend and Express backend concurrently.
    ```bash
    pnpm run dev
    ```
    - **Frontend:** `http://localhost:3000`
    - **Backend:** `http://localhost:3001`

---

## 📂 Project Structure

```bash
next-event/
├── app/                  # Next.js App Router (Frontend)
│   ├── admin/            # 🔐 Protected Admin Routes
│   ├── auth/             # 🔐 Login & Signup
│   ├── events/           # 🌍 Public Event Pages
│   └── dashboard/        # 👤 User Dashboard
├── components/           # 🧩 Reusable UI Components
├── lib/                  # 🛠️ Utilities & Auth Context
├── server/               # ⚙️ Express Backend
│   ├── models/           # 🗄️ Mongoose Schemas
│   ├── routes/           # 🛣️ API Routes
│   └── index.ts          # 🏁 Server Entry Point
└── public/               # 🖼️ Static Assets
📡 API EndpointsMethodEndpointDescriptionAccessAuthPOST/api/auth/loginAuthenticate user & set cookiePublicPOST/api/auth/signupRegister a new accountPublicGET/api/auth/meRetrieve current session infoPrivateEventsGET/api/eventsFetch all events (supports filtering)PublicPOST/api/eventsCreate a new eventAdminPOST/api/events/:id/bookmarkToggle event wishlist statusPrivateReviewsPOST/api/events/:id/reviewsSubmit a rating/reviewPrivateGET/api/events/:id/reviewsFetch event reviewsPublic🤝 ContributingContributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.Fork the ProjectCreate your Feature Branch (git checkout -b feature/AmazingFeature)Commit your Changes (git commit -m 'Add some AmazingFeature')Push to the Branch (git push origin feature/AmazingFeature)Open a Pull Request📜 LicenseDistributed under the MIT License. See LICENSE for more information.📞 ContactManav MerjaProject Link: https://github.com/manavmerja/Next-Event<div align="center"><br /><i>Built with ❤️, TypeScript, and lots of coffee ☕</i></div>