# 🌿 Hackwarts Herbology Hub (SkillSphere)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.19-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.5-green?logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-React-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Welcome to **Hackwarts Herbology Hub**, a wizarding-themed community skill-sharing & micro-volunteering platform (SkillSphere). The platform connects individuals eager to teach or learn diverse skills through an automated matching engine, a virtual community-credit economy, scheduled session management, bilateral review systems, and real-time notifications.

---

## 🌟 Key Features

### 🔐 1. Authentication & User Profiles
- **Secure Authentication**: JWT-based authentication via HTTP-only cookies & headers with bcrypt password hashing.
- **Rich Profiles**: User bios, location tagging with 2DSphere GeoJSON coordinates, profile picture uploads via Cloudinary integration.
- **Skill Portfolios**: Categorized lists of skills a user can teach (`skillsCanTeach`) and skills they wish to learn (`skillsWantToLearn`).
- **Reputation Metrics**: Automated calculation of user `trustScore`, `averageRating`, completed sessions count, and total reviews.

### 🎯 2. Smart Skill Matching Engine
- **Algorithmic Match Feed**: Ranks potential study partners based on a weighted scoring model:
  - **Skill Complementarity**: Direct overlap between what user A teaches and user B wants to learn.
  - **Geographic Proximity**: Linear decay scoring up to 50km using Haversine distance math or exact city matches.
  - **Reputation & Ratings**: Prioritizes users with higher trust scores and average star ratings.

### 📚 3. Skill Catalog & Marketplace
- **Search & Filter**: Full-text search across titles, descriptions, and tags.
- **Categorization**: 10 distinct categories (Technology, Music, Art & Craft, Cooking, Sports & Fitness, Languages, Academics, Business, Wellness, and Other).
- **Skill Levels**: Beginner, Intermediate, and Advanced skill designations.

### 🤝 4. Request & Session Scheduling Flow
- **Request Lifecycle**: Learners send requests with proposed credit transfers and custom messages (`pending` → `accepted` / `rejected` / `cancelled`).
- **Session Scheduling**: Booked sessions support both online (video meeting links) and in-person formats, tracking start time, duration (15m to 8h), and status (`scheduled` → `completed` / `cancelled`).

### 🪙 5. Community Credit Economy & Ledger
- **Virtual Currency**: Starting bonus credits awarded on signup (Default: 10 credits).
- **Guaranteed Non-Negative Ledger**: Transactions guarded by atomic MongoDB transactions to ensure credits can never go negative.
- **Immutable Credit Log**: Complete financial audit trail (`CreditTransaction`) tracking credits earned from teaching, spent on learning, signup bonuses, refunds, and admin adjustments.

### ⭐ 6. Bilateral Reviews & Leaderboard
- **Mutual Rating System**: Post-session reviews (Learner ↔ Teacher) with 1–5 star ratings and feedback.
- **Community Leaderboard**: Highlights top teachers and active community members ranked by ratings, earned credits, and session completions.

### 🔔 7. In-App Notification Engine
- **Event-Driven Alerts**: Real-time notification records for request updates, session bookings, credit earnings/deductions, and review submissions.

---

## 🛠️ Tech Stack & Architecture

### Backend
- **Runtime**: Node.js (>= 18.0.0, ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Utilities**: Helmet, CORS, Morgan, Cookie Parser, Express-Validator, Winston/Custom Logger, Cloudinary, Multer

### Frontend
- **Framework**: Vite + React
- **Styling**: Custom CSS with wizarding dark/gold theme typography (Cinzel, Poppins, JetBrains Mono)

---

## 📁 Repository Structure

```text
hackwarts-herbology-hub/
├── .gitignore
├── README.md
├── backend/
│   ├── .env                            # Environment variables configuration
│   ├── package-lock.json
│   ├── package.json                    # Backend dependencies & scripts
│   └── src/
│       ├── app.js                      # Express app setup, middleware & route definitions
│       ├── server.js                   # DB connection & server initialization
│       ├── config/                     # Database, Cloudinary, & Env configurations
│       │   ├── cloudinary.js           # Cloudinary service integration
│       │   ├── db.js                   # MongoDB connection configuration
│       │   └── env.js                  # Environment variable schema validation
│       ├── controllers/                # Request handlers
│       │   ├── auth.controller.js      # Auth & registration handlers
│       │   ├── credit.controller.js    # Credit balance & history handlers
│       │   ├── leaderboard.controller.js # Community rankings handler
│       │   ├── match.controller.js     # Smart match recommendations handler
│       │   ├── request.controller.js   # Skill request lifecycle handlers
│       │   ├── review.controller.js    # Post-session rating handlers
│       │   ├── schedule.controller.js   # Session booking handlers
│       │   ├── skill.controller.js     # Skill catalog handlers
│       │   └── user.controller.js      # User profile management handlers
│       ├── middleware/                 # Express middleware functions
│       │   ├── Errorhandler.js         # Global error handler middleware
│       │   ├── auth.js                 # JWT cookie & header authentication middleware
│       │   ├── upload.js               # Multer file upload middleware
│       │   └── validator.js            # Request input validation middleware
│       ├── models/                     # Mongoose schemas
│       │   ├── CreditTransaction.js    # Financial audit log model
│       │   ├── Notification.js         # In-app user alert model
│       │   ├── Schedule.js             # Booked session model
│       │   ├── Skill.js                # Skill listing catalog model
│       │   ├── SkillRequest.js         # Skill request lifecycle model
│       │   ├── User.js                 # User account & portfolio model
│       │   └── review.js               # Bilateral rating & feedback model
│       ├── routes/                     # REST API route declarations
│       │   ├── auth.routes.js          # /api/auth routes
│       │   ├── credit.routes.js        # /api/credits routes
│       │   ├── leaderboard.routes.js   # /api/leaderboard routes
│       │   ├── match.routes.js         # /api/matches routes
│       │   ├── request.routes.js       # /api/requests routes
│       │   ├── review.routes.js        # /api/reviews routes
│       │   ├── schedule.routes.js      # /api/schedules routes
│       │   ├── skill.routes.js         # /api/skills routes
│       │   └── user.routes.js          # /api/users routes
│       ├── services/                   # Business logic services
│       │   ├── credit.service.js       # Atomic credit transaction ledger service
│       │   ├── matching.service.js     # Weighted skill & geo matching algorithm
│       │   └── notification.service.js # Event-driven notification generator
│       └── utils/                      # Helper utilities
│           ├── ApiError.js             # Custom error response class
│           ├── ApiResponse.js          # Standardized API response formatter
│           ├── jwt.js                  # Token generation & verification helpers
│           └── logger.js               # Application logging utility
└── frontend/
    ├── index.html                      # HTML document entry point
    ├── leaf.svg                        # Site favicon asset
    ├── package-lock.json
    ├── package.json                    # Frontend dependencies & scripts
    ├── postcss.config.js               # PostCSS styling configuration
    ├── tailwind.config.js              # Tailwind CSS configuration
    ├── vite.config.js                  # Vite build tool configuration
    ├── public/                         # Static assets directory
    │   ├── favicon.svg                 # Application favicon
    │   └── leaf.svg                    # Herbology themed icon asset
    └── src/                            # Frontend source code
        ├── App.jsx                     # Application root component & router
        ├── main.jsx                    # React DOM entry point
        ├── components/                 # Modular UI components
        │   ├── animations/             # Visual effects & canvas animations
        │   │   ├── AnimatedHeading.jsx
        │   │   ├── CustomCursor.jsx
        │   │   ├── Fireflies.jsx
        │   │   ├── FloatingLeaves.jsx
        │   │   ├── MagicalBackground.jsx
        │   │   └── PageTransition.jsx
        │   ├── common/                 # Reusable atomic UI components
        │   │   ├── Badge.jsx
        │   │   ├── Button.jsx
        │   │   ├── EmptyState.jsx
        │   │   ├── Footer.jsx
        │   │   ├── GlassCard.jsx
        │   │   ├── Input.jsx
        │   │   ├── LoadingSpinner.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Navbar.jsx
        │   │   ├── SkeletonLoader.jsx
        │   │   └── Tooltip.jsx
        │   ├── layout/                 # View layout wrappers
        │   │   ├── AuthLayout.jsx
        │   │   ├── DashboardLayout.jsx
        │   │   └── MainLayout.jsx
        │   ├── modals/                 # Interactive modal overlays
        │   │   └── AddSkillModal.jsx
        │   └── sections/               # Composite feature section components
        │       ├── CallToAction.jsx
        │       ├── DashboardCard.jsx
        │       ├── FeatureCards.jsx
        │       ├── HeroSection.jsx
        │       ├── HowItWorks.jsx
        │       ├── MentorCard.jsx
        │       ├── RecommendationCard.jsx
        │       ├── SessionCard.jsx
        │       ├── SkillCard.jsx
        │       └── Testimonials.jsx
        ├── context/                    # React Context providers
        │   └── AuthContext.jsx         # Global authentication state
        ├── hooks/                      # Custom React hooks
        │   ├── useAuth.js              # Auth context consumer hook
        │   ├── useDebounce.js          # Value debouncing hook
        │   ├── useIntersection.js      # Element visibility observer hook
        │   ├── useScrollReveal.js      # Scroll animation trigger hook
        │   └── useWindowSize.js        # Window dimensions hook
        ├── pages/                      # Application pages
        │   ├── Dashboard.jsx           # Main user portal & overview
        │   ├── Discover.jsx            # Skill catalog & search page
        │   ├── Landing.jsx             # Hero landing page
        │   ├── Leaderboard.jsx         # Top users & community ranking page
        │   ├── Login.jsx               # Auth login & signup view
        │   ├── MatchFeed.jsx           # Algorithmic study partner recommendations
        │   ├── NotFound.jsx            # 404 page
        │   ├── Profile.jsx             # Profile management page
        │   └── SessionScheduler.jsx    # Session scheduling & management view
        ├── styles/                     # Style definitions
        │   ├── animations.css          # CSS animation definitions
        │   ├── globals.css             # Base CSS styles & utilities
        │   └── theme.css               # Wizarding theme color variables
        └── utils/                      # Frontend helper utilities
            ├── animations.js           # Framer motion variants & helpers
            ├── cn.js                   # Class name merger helper
            ├── constants.js            # App configuration constants
            ├── dummyData.js            # Fallback mock data
            └── validators.js           # Form input validators
```

---

## 🔌 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `POST` | `/api/auth/logout` | Logout user & clear session cookie | Yes |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |

### 👤 Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Get logged-in user profile details | Yes |
| `PUT` | `/api/users/profile` | Update profile (bio, location, skill tags) | Yes |
| `POST` | `/api/users/avatar` | Upload profile picture to Cloudinary | Yes |

### 🎯 Smart Matching (`/api/matches`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches` | Retrieve ranked match recommendations | Yes |

### 📜 Skills Marketplace (`/api/skills`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Search and filter skills by category/type | Optional |
| `POST` | `/api/skills` | Create a new skill listing (teach or learn) | Yes |
| `GET` | `/api/skills/:id` | Get details of a specific skill | Optional |
| `PUT` | `/api/skills/:id` | Update an existing skill listing | Yes |
| `DELETE` | `/api/skills/:id` | Soft delete/deactivate a skill listing | Yes |

### 📨 Skill Requests (`/api/requests`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Send a session request to a teacher | Yes |
| `GET` | `/api/requests` | List user's incoming & outgoing requests | Yes |
| `PATCH` | `/api/requests/:id/respond` | Accept or reject a pending request | Yes |
| `PATCH` | `/api/requests/:id/cancel` | Cancel a pending request | Yes |

### 📅 Session Schedules (`/api/schedules`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/schedules` | View scheduled, completed, or cancelled sessions | Yes |
| `GET` | `/api/schedules/:id` | Get specific schedule details | Yes |
| `PATCH` | `/api/schedules/:id/complete` | Mark session completed & settle credits | Yes |
| `PATCH` | `/api/schedules/:id/cancel` | Cancel a scheduled session | Yes |

### 🪙 Credits Ledger (`/api/credits`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/credits/balance` | Get user's current credit balance | Yes |
| `GET` | `/api/credits/history` | Get paginated credit transaction history | Yes |

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Submit a review for a completed session | Yes |
| `GET` | `/api/reviews/user/:userId` | Fetch reviews received by a user | Optional |

### 🏆 Leaderboard (`/api/leaderboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leaderboard` | Get top-ranked community members | Optional |

---

## ⚡ Getting Started & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) instance (Local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/naman1326/hackwarts-herbology-hub.git
cd hackwarts-herbology-hub
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory based on the template below:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillsphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN_DAYS=7
STARTING_CREDITS=10
CREDITS_PER_SESSION=5
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install Dependencies & Run Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`. You can check server health at `http://localhost:5000/api/health`.

### 4. Serve Frontend
```bash
cd ../frontend
# Serve static dist build or dev server
```

---

## 📜 License

This project is licensed under the **ISC License**.

