# CAREERSTIDEZ 🌍

> A global career and study abroad platform built with the MERN stack.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6-green)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## Features

### 🔐 Authentication
- JWT-based with refresh tokens
- Role-based access: Admin, Job Seeker, Student, Recruiter
- Secure bcrypt password hashing

### 💼 Job Portal
- Browse & search jobs (by country, industry, type, salary)
- Apply with resume PDF upload (Cloudinary)
- Save jobs to favorites
- AI-powered job recommendations (skill matching)
- Recruiters: Post, edit, delete jobs; view applicants
- Application status tracking

### 🎓 Study Abroad
- Browse universities by country, ranking, type
- Filter programs by degree (UG/PG/PhD/Diploma)
- Scholarship discovery
- Save programs

### 📊 Dashboard & Analytics
- Admin: stats, charts (Recharts), user management
- User: applications tracker, saved items, profile

### 🎨 UI/UX
- Responsive Tailwind CSS design
- Dark/Light theme toggle
- Clean, modern interface

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Charts | Recharts |
| Forms | React Hook Form + Yup |
| State | Context API |
| API Docs | Swagger (OpenAPI 3.0) |

## Project Structure

```
careerstidez/
├── backend/
│   ├── config/           # DB & JWT config
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth, validation, upload, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── services/         # Email & recommendation services
│   ├── utils/            # Cloudinary, email, helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth & Theme context
│       ├── hooks/        # Custom hooks
│       ├── layouts/      # Page layouts
│       ├── pages/        # Route pages
│       └── services/     # API service layer (Axios)
└── README.md
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- SMTP credentials (for emails)

### 1. Clone & Install

```bash
git clone https://github.com/codewith-lionel/carrerstidez.git
cd carrerstidez
npm run install:all
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env with your values
npm run dev
```

The backend runs on `http://localhost:5000` and frontend on `http://localhost:5173`.

API Documentation: `http://localhost:5000/api/docs`

## API Routes

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh-token | Refresh token |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | List jobs (with filters) |
| POST | /api/jobs | Create job (recruiter) |
| GET | /api/jobs/:id | Get job details |
| PUT | /api/jobs/:id | Update job (recruiter) |
| DELETE | /api/jobs/:id | Delete job (recruiter) |
| GET | /api/jobs/recommended | AI recommendations |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications/jobs/:jobId | Apply to job |
| GET | /api/applications/my | My applications |
| PUT | /api/applications/:id/status | Update status (recruiter) |
| PUT | /api/applications/:id/withdraw | Withdraw |

### Study Abroad
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/universities | List universities |
| POST | /api/universities | Add university (admin) |
| GET | /api/programs | List programs |
| POST | /api/programs | Add program (admin) |
| GET | /api/scholarships | List scholarships |
| POST | /api/scholarships | Add scholarship (admin) |

### Saved
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved/jobs | Get saved jobs |
| POST | /api/saved/jobs/:jobId | Save job |
| DELETE | /api/saved/jobs/:jobId | Unsave job |
| GET | /api/saved/programs | Get saved programs |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/users | List users |
| PATCH | /api/admin/users/:id/toggle-status | Toggle user status |

## Database Models

- **User** - Auth, profile, skills, resume
- **Job** - Listings with company, location, salary, skills
- **Application** - Job applications with status tracking
- **University** - Global universities with ranking, fees
- **Program** - Academic programs (UG/PG/PhD)
- **Scholarship** - Funding opportunities
- **SavedJob** - User's saved job listings
- **SavedProgram** - User's saved academic programs

## Authentication Flow

```
User → POST /auth/login → { accessToken (15m), refreshToken (7d) }
Request → Bearer accessToken → Protected resource
accessToken expires → POST /auth/refresh-token → new tokens
Logout → DELETE refreshToken from DB
```

## Deployment

### Backend (Render)
1. Create a new Web Service on [render.com](https://render.com)
2. Set environment variables from `.env.example`
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)
1. Import project on [vercel.com](https://vercel.com)
2. Framework preset: Vite
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user
3. Get connection string → set as `MONGODB_URI`
4. Whitelist `0.0.0.0/0` for Render IPs

## Security Features

- Helmet.js HTTP security headers
- CORS with whitelist
- Rate limiting (100 req/15min)
- JWT with short-lived access tokens
- bcrypt password hashing (salt rounds: 12)
- Input validation (express-validator)
- Role-based authorization middleware
- Environment variable secrets

## Future AI Enhancements

- ML-based job recommendations (collaborative filtering)
- NLP resume parsing and skill extraction
- Salary prediction model
- Smart application ranking for recruiters
- University match score based on student profile
- Chatbot for career guidance

## License

MIT © 2024 CAREERSTIDEZ
