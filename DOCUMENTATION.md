# Wedding Invitation Website - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Client-Server Communication](#client-server-communication)
6. [Security Implementation](#security-implementation)
7. [Database Design](#database-design)
8. [API Documentation](#api-documentation)
9. [Authentication & Authorization](#authentication--authorization)
10. [Environment Configuration](#environment-configuration)
11. [Deployment](#deployment)
12. [Development Workflow](#development-workflow)
13. [Features](#features)

---

## Project Overview

A full-stack wedding invitation website with RSVP functionality, multi-language support (Portuguese, English, Ukrainian), and an admin dashboard for managing guest responses.

**Key Features:**
- Interactive single-page application (SPA)
- Multi-language support with browser detection
- RSVP form with multi-guest support
- Admin dashboard with statistics and CSV export
- Payment information (Bank transfer & MBWAY)
- Responsive design for all devices
- Real-time countdown to wedding day

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React SPA (Vite)                           │   │
│  │  • Components (UI)                                    │   │
│  │  • Context (State Management)                         │   │
│  │  • Hooks (Business Logic)                            │   │
│  │  • i18n (Multi-language)                             │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ HTTPS/REST API                         │
└─────────────────────┼────────────────────────────────────────┘
                      │
┌─────────────────────┼────────────────────────────────────────┐
│                     ↓          SERVER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js REST API                           │   │
│  │  • Routes (API Endpoints)                            │   │
│  │  • Middleware (Auth, CORS)                           │   │
│  │  • PostgreSQL Pool (DB Connection)                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ SQL Queries                            │
│  ┌──────────────────┴───────────────────────────────────┐   │
│  │       Supabase PostgreSQL Database                    │   │
│  │  • submissions table                                  │   │
│  │  • guests table                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

DEPLOYMENT:
Client: Vercel (CDN, Serverless)
Server: Render (Container)
Database: Supabase (Managed PostgreSQL)
```

### Request Flow

```
User Browser
    ↓
[1] Request to Vercel CDN
    ↓
[2] React App Loads
    ↓
[3] User Interaction (e.g., Submit RSVP)
    ↓
[4] API Call (fetch) → https://wedding-api.onrender.com/api/rsvp
    ↓
[5] CORS Check (Server validates origin)
    ↓
[6] Request Handler (Express Route)
    ↓
[7] Database Query (PostgreSQL via Supabase)
    ↓
[8] Response (JSON)
    ↓
[9] Update UI (React State)
```

---

## Technology Stack

### Frontend (Client)

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.x |
| **Vite** | Build Tool & Dev Server | 5.x |
| **Tailwind CSS** | Styling Framework | 3.x |
| **React Router** | Client-side Routing | 6.x |
| **Native Fetch API** | HTTP Requests | Built-in |

### Backend (Server)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express.js** | Web Framework | 4.x |
| **PostgreSQL** | Database | 14+ |
| **pg (node-postgres)** | PostgreSQL Driver | 8.x |
| **cors** | Cross-Origin Resource Sharing | 2.x |
| **dotenv** | Environment Variables | 16.x |

### Infrastructure

| Service | Purpose | Tier |
|---------|---------|------|
| **Vercel** | Frontend Hosting | Free |
| **Render** | Backend Hosting | Free |
| **Supabase** | Database Hosting | Free |

---

## Project Structure

```
wedding_invitation/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Reusable components
│   │   │   │   ├── AddToCalendar.jsx
│   │   │   │   ├── Countdown.jsx
│   │   │   │   ├── FloatingRSVP.jsx
│   │   │   │   ├── LanguageSwitcher.jsx
│   │   │   │   └── MapEmbed.jsx
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── sections/            # Page sections
│   │   │   │   ├── hero/
│   │   │   │   ├── church/
│   │   │   │   ├── venue/
│   │   │   │   ├── transportation/
│   │   │   │   ├── accommodation/
│   │   │   │   ├── gifts/
│   │   │   │   └── OutroSection.jsx
│   │   │   ├── rsvp/                # RSVP functionality
│   │   │   │   ├── RSVPModal.jsx
│   │   │   │   └── RSVPForm.jsx
│   │   │   └── admin/               # Admin panel
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminStats.jsx
│   │   │       ├── SubmissionsList.jsx
│   │   │       ├── SubmissionCard.jsx
│   │   │       ├── GuestList.jsx
│   │   │       └── NotesEditor.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Main wedding page
│   │   │   └── Admin.jsx            # Admin dashboard
│   │   ├── context/
│   │   │   └── LanguageContext.jsx  # i18n state management
│   │   ├── hooks/
│   │   │   ├── useLanguage.js       # i18n hook
│   │   │   ├── useAdminData.js      # Admin data fetching
│   │   │   └── useSubmissionActions.js  # Admin actions
│   │   ├── utils/
│   │   │   ├── api.js               # API client functions
│   │   │   └── calendar.js          # Calendar utilities & config
│   │   ├── locales/
│   │   │   ├── pt.json              # Portuguese
│   │   │   ├── en.json              # English
│   │   │   └── uk.json              # Ukrainian
│   │   ├── assets/                  # Images & static files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                          # Express Backend
│   ├── routes/
│   │   ├── rsvp.js                  # RSVP CRUD endpoints
│   │   └── admin.js                 # Admin auth & data
│   ├── db/
│   │   └── init.js                  # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication
│   ├── server.js                    # Express entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── DEPLOYMENT.md                    # Deployment guide
├── DOCUMENTATION.md                 # This file
└── README.md                        # Project overview
```

---

## Client-Server Communication

### Overview

The client and server communicate via RESTful HTTP requests. The client (React SPA) makes requests to the server API, which processes them and returns JSON responses.

### Communication Flow

#### 1. RSVP Submission Flow

```javascript
// CLIENT (src/utils/api.js)
export async function submitRSVP(data) {
  const response = await fetch(`${API_BASE}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to submit RSVP')
  }

  return response.json()
}

// Usage in component:
const handleSubmit = async (formData) => {
  try {
    await submitRSVP(formData)
    // Show success message
  } catch (error) {
    // Show error message
  }
}
```

```javascript
// SERVER (routes/rsvp.js)
router.post('/', async (req, res) => {
  const client = await pool.connect()

  try {
    const { guests, notes, language } = req.body

    // Validate input
    if (!guests || !language) {
      return res.status(400).json({ error: 'Invalid data' })
    }

    // Transaction
    await client.query('BEGIN')

    // Insert submission
    const result = await client.query(
      'INSERT INTO submissions (language, notes) VALUES ($1, $2) RETURNING id',
      [language, notes]
    )

    // Insert guests
    for (const guest of guests) {
      await client.query(
        'INSERT INTO guests (...) VALUES (...)',
        [...]
      )
    }

    await client.query('COMMIT')

    res.status(201).json({ success: true })
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Server error' })
  } finally {
    client.release()
  }
})
```

#### 2. Admin Authentication Flow

```javascript
// CLIENT (src/utils/api.js)
export async function adminLogin(password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })

  const data = await response.json()

  // Store token in localStorage
  localStorage.setItem('admin-token', data.token)

  return data
}

// Authenticated request
export async function getRSVPSubmissions() {
  const token = localStorage.getItem('admin-token')

  const response = await fetch(`${API_BASE}/rsvp`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.json()
}
```

```javascript
// SERVER (middleware/auth.js)
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify token (simple comparison in this case)
    // In production, use proper JWT verification
    if (token === process.env.ADMIN_TOKEN_SECRET) {
      next()
    } else {
      res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

### CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow the frontend to communicate with the backend:

```javascript
// SERVER (server.js)
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.FRONTEND_URL
      .split(',')
      .map(url => url.trim())

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
```

**Why CORS is necessary:**
- Frontend is hosted on Vercel: `https://wedding-invitation.vercel.app`
- Backend is hosted on Render: `https://wedding-api.onrender.com`
- Different domains = Cross-Origin Request
- CORS policy allows the frontend to make requests to the backend

---

## Security Implementation

### 1. Authentication & Authorization

#### Admin Authentication

**Mechanism:** Token-based authentication

**Flow:**
1. Admin enters password in login form
2. Client sends password to `/api/admin/login`
3. Server validates password against `ADMIN_PASSWORD` env variable
4. Server generates token (currently using the secret itself - see production notes)
5. Client stores token in `localStorage`
6. Client includes token in `Authorization` header for subsequent requests
7. Server validates token via `authMiddleware` before allowing access

**Code:**
```javascript
// Login endpoint
router.post('/login', (req, res) => {
  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = generateToken(password)
  res.json({ success: true, token })
})

// Middleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token === process.env.ADMIN_TOKEN_SECRET) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
```

**Production Recommendations:**
- Use proper JWT (JSON Web Tokens) with expiration
- Implement refresh tokens for long sessions
- Add rate limiting on login endpoint
- Use bcrypt to hash passwords
- Implement session management

### 2. CORS (Cross-Origin Resource Sharing)

**Purpose:** Prevent unauthorized domains from accessing the API

**Implementation:**
- Whitelist only the production frontend URL
- Support multiple origins (Vercel subdomain + custom domain)
- Reject requests from unknown origins

**Security Benefits:**
- Prevents CSRF (Cross-Site Request Forgery) attacks
- Ensures only your frontend can access the API
- Protects against malicious third-party websites

### 3. Input Validation

**Client-side:**
```javascript
// Validate before sending to server
if (!guest.name || guest.name.trim() === '') {
  return 'Guest name is required'
}

if (typeof guest.attending !== 'boolean') {
  return 'Attending status is required'
}
```

**Server-side:**
```javascript
// Always validate on server (client validation can be bypassed)
if (!guests || !Array.isArray(guests) || guests.length === 0) {
  return res.status(400).json({ error: 'Invalid data' })
}

for (const guest of guests) {
  if (!guest.name || typeof guest.attending !== 'boolean') {
    return res.status(400).json({ error: 'Invalid guest data' })
  }
}
```

**Security Benefits:**
- Prevents SQL injection (using parameterized queries)
- Prevents malformed data from entering database
- Provides clear error messages for debugging

### 4. Database Security

**PostgreSQL Parameterized Queries:**
```javascript
// SECURE - Uses parameterized queries ($1, $2)
await pool.query(
  'INSERT INTO submissions (language, notes) VALUES ($1, $2)',
  [language, notes]
)

// VULNERABLE - Never do this (SQL injection risk)
await pool.query(
  `INSERT INTO submissions (language, notes) VALUES ('${language}', '${notes}')`
)
```

**Why Parameterized Queries:**
- Prevents SQL injection attacks
- Database driver automatically escapes dangerous characters
- User input is treated as data, not executable code

**Database Connection Security:**
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
})
```

- SSL encryption for database connections in production
- Connection string stored in environment variables (never in code)
- Supabase provides secure, managed PostgreSQL with built-in security

### 5. Environment Variables

**Sensitive data is never committed to repository:**

```env
# Never commit this file
ADMIN_PASSWORD=your_secure_password
ADMIN_TOKEN_SECRET=your_secret_key
DATABASE_URL=postgresql://user:pass@host:5432/db
FRONTEND_URL=https://your-frontend.vercel.app
```

**Security Benefits:**
- Secrets are not exposed in source code
- Different secrets for development and production
- Easy to rotate credentials without code changes

### 6. HTTPS/SSL

**Both client and server use HTTPS:**
- Vercel: Automatic SSL certificates
- Render: Automatic SSL certificates
- Supabase: SSL-encrypted connections

**Security Benefits:**
- All data is encrypted in transit
- Prevents man-in-the-middle attacks
- Protects user privacy

### 7. Data Privacy

**No Sensitive Data Collected:**
- No passwords from guests
- No payment information (only display bank details)
- Only names, attendance status, and optional notes

**Admin Access:**
- Only accessible with password
- Token expires when browser is closed (localStorage)
- Can export data as CSV for offline storage

---

## Database Design

### Schema

```sql
-- Submissions table (one per RSVP submission)
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  language TEXT NOT NULL,
  notes TEXT
);

-- Guests table (linked to submissions)
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  is_plus_one_request BOOLEAN DEFAULT FALSE,
  plus_one_status TEXT DEFAULT NULL
);

-- Indexes for performance
CREATE INDEX idx_guests_submission_id ON guests(submission_id);
CREATE INDEX idx_guests_attending ON guests(attending);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
```

### Entity Relationship

```
┌─────────────────────────┐
│     submissions         │
├─────────────────────────┤
│ id (PK)                 │
│ created_at              │
│ language                │
│ notes                   │
└────────────┬────────────┘
             │ 1
             │
             │ has many
             │
             │ N
┌────────────┴────────────┐
│        guests           │
├─────────────────────────┤
│ id (PK)                 │
│ submission_id (FK)      │
│ name                    │
│ attending               │
│ is_plus_one_request     │
│ plus_one_status         │
└─────────────────────────┘
```

### Data Flow Example

**RSVP Submission:**
```json
{
  "language": "pt",
  "notes": "Vegetarian meal requested",
  "guests": [
    {
      "name": "João Silva",
      "attending": true,
      "isPlusOneRequest": false
    },
    {
      "name": "Maria Santos",
      "attending": true,
      "isPlusOneRequest": true
    }
  ]
}
```

**Database Records Created:**

Submissions table:
```
id | created_at           | language | notes
1  | 2026-01-15 14:30:00  | pt       | Vegetarian meal requested
```

Guests table:
```
id | submission_id | name          | attending | is_plus_one_request | plus_one_status
1  | 1            | João Silva    | true      | false              | null
2  | 1            | Maria Santos  | true      | true               | null
```

### Cascade Delete

When a submission is deleted, all associated guests are automatically deleted due to the `ON DELETE CASCADE` foreign key constraint.

```sql
DELETE FROM submissions WHERE id = 1;
-- Automatically deletes both guests with submission_id = 1
```

---

## API Documentation

### Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://wedding-invitation-api-6e9d.onrender.com/api`

### Public Endpoints

#### POST /rsvp
Submit a new RSVP.

**Request:**
```json
{
  "language": "pt",
  "notes": "Dietary restrictions: vegetarian",
  "guests": [
    {
      "name": "John Doe",
      "attending": true,
      "isPlusOneRequest": false
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "submissionId": 123,
  "message": "RSVP submitted successfully"
}
```

**Errors:**
- `400 Bad Request` - Invalid data
- `500 Internal Server Error` - Server error

---

### Admin Endpoints (Requires Authentication)

#### POST /admin/login
Admin authentication.

**Request:**
```json
{
  "password": "your_admin_password"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "admin_token_here"
}
```

**Errors:**
- `401 Unauthorized` - Invalid password

---

#### GET /rsvp
Get all RSVP submissions (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "created_at": "2026-01-15T14:30:00Z",
    "language": "pt",
    "notes": "Vegetarian",
    "guests": [
      {
        "id": 1,
        "name": "John Doe",
        "attending": true,
        "isPlusOneRequest": false,
        "plusOneStatus": null
      }
    ]
  }
]
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token

---

#### GET /admin/stats
Get dashboard statistics (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "totalSubmissions": 50,
  "totalGuests": 120,
  "attendingGuests": 95,
  "approvedPlusOnes": 10,
  "notAttendingGuests": 25,
  "plusOneRequests": 15,
  "byLanguage": [
    { "language": "pt", "count": 30 },
    { "language": "en", "count": 15 },
    { "language": "uk", "count": 5 }
  ],
  "recentSubmissions": [...]
}
```

---

#### PATCH /rsvp/:id
Update submission notes (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Notes updated"
}
```

---

#### PATCH /rsvp/:submissionId/guest/:guestId
Update guest plus-one status (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "plusOneStatus": "approved"
}
```

**Valid values:** `"approved"`, `"rejected"`, `null`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Plus one status updated"
}
```

---

#### DELETE /rsvp/:id
Delete an RSVP submission (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Submission deleted"
}
```

---

#### GET /admin/export
Export all submissions as CSV (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename=rsvp-export.csv

Submission ID,Date,Language,Notes,Guest Name,Attending,Plus One Request,Plus One Status
1,2026-01-15,pt,"Vegetarian","John Doe",Yes,No,-
```

---

### Health Check

#### GET /api/health
Check if server is running.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T14:30:00.000Z"
}
```

---

## Authentication & Authorization

### Overview

The application uses a simple token-based authentication system for admin access.

### Authentication Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Enter password
     ↓
┌────────────────────────┐
│  POST /admin/login     │
│  { password: "..." }   │
└──────────┬─────────────┘
           │
           │ 2. Validate password
           ↓
┌─────────────────────────────┐
│  Server                     │
│  if (password === ENV_VAR)  │
│    generate token           │
└──────────┬──────────────────┘
           │
           │ 3. Return token
           ↓
┌──────────────────────────┐
│  Client                  │
│  Store token in          │
│  localStorage            │
└──────────┬───────────────┘
           │
           │ 4. Include token in requests
           ↓
┌────────────────────────────────┐
│  GET /rsvp                     │
│  Authorization: Bearer {token} │
└──────────┬─────────────────────┘
           │
           │ 5. Validate token
           ↓
┌──────────────────────────┐
│  authMiddleware          │
│  Verify token matches    │
│  ADMIN_TOKEN_SECRET      │
└──────────┬───────────────┘
           │
           │ 6. Grant access or deny
           ↓
┌──────────────────────────┐
│  Return data or 401      │
└──────────────────────────┘
```

### Security Considerations

**Current Implementation:**
- ✅ Password is checked against environment variable
- ✅ Token is required for admin endpoints
- ✅ Token is stored in localStorage (client-side)
- ⚠️  Token doesn't expire (simple implementation)
- ⚠️  No rate limiting on login attempts

**Production Recommendations:**
1. Use JWT (JSON Web Tokens) with expiration
2. Implement refresh tokens
3. Add rate limiting (e.g., max 5 login attempts per 15 minutes)
4. Use HttpOnly cookies instead of localStorage (prevents XSS)
5. Implement session management
6. Add two-factor authentication (2FA) for sensitive operations

---

## Environment Configuration

### Client (.env)

```env
# API URL - points to backend server
VITE_API_URL=http://localhost:3001/api  # Development
# VITE_API_URL=https://wedding-api.onrender.com/api  # Production
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client.

### Server (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development  # or 'production'

# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here
ADMIN_TOKEN_SECRET=your_secret_key_here

# Database (PostgreSQL via Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database

# Frontend URL (for CORS) - supports multiple domains
FRONTEND_URL=http://localhost:5173,https://your-app.vercel.app
```

### Production Configuration

**Vercel (Client):**
- Go to Project Settings → Environment Variables
- Add: `VITE_API_URL=https://wedding-api.onrender.com/api`

**Render (Server):**
- Go to Environment tab
- Add all variables from `.env.example`
- Ensure `DATABASE_URL` includes URL-encoded password if it contains special characters

**Supabase (Database):**
- Get connection string from Project Settings → Database
- Use "Session" mode for connection pooling
- Copy to Render's `DATABASE_URL` variable

---

## Deployment

### Architecture

```
GitHub Repository
       │
       ├─→ Vercel (watches /client)
       │   • Auto-deploys on push to main
       │   • Builds: npm run build
       │   • Serves: Static files from /dist
       │
       └─→ Render (watches /server)
           • Auto-deploys on push to main
           • Builds: npm install
           • Starts: npm start
           • Connects to: Supabase Database
```

### Deployment Process

#### 1. Push to GitHub
```bash
git add .
git commit -m "Your changes"
git push origin main
```

#### 2. Automatic Deployments

**Vercel:**
- Detects changes in `/client`
- Installs dependencies
- Runs `npm run build`
- Deploys to CDN
- Time: ~2-3 minutes
- URL: `https://wedding-invitation-six-kohl.vercel.app`

**Render:**
- Detects changes in `/server`
- Installs dependencies
- Runs `npm start`
- Deploys to container
- Time: ~3-4 minutes
- URL: `https://wedding-invitation-api-6e9d.onrender.com`

#### 3. Database (Supabase)
- No deployment needed
- Always running
- Managed by Supabase

### Monitoring Deployments

**Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. View "Deployments" tab
4. Check build logs if deployment fails

**Render:**
1. Go to https://dashboard.render.com
2. Select your service
3. View "Logs" tab
4. Monitor for errors or warnings

### Rollback Strategy

**Vercel:**
- Go to Deployments tab
- Click on a previous successful deployment
- Click "Promote to Production"

**Render:**
- Go to Events tab
- Click "Redeploy" on a previous successful deployment

**Database:**
- No automatic rollback
- Perform manual SQL migrations if needed
- Always backup before schema changes

---

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/SirZemar/wedding-invitation.git
cd wedding-invitation

# Install dependencies
cd client && npm install
cd ../server && npm install

# Configure environment variables
cd server
cp .env.example .env
# Edit .env with your values

cd ../client
cp .env.example .env
# Edit .env with your values
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

### Making Changes

#### Frontend Changes

1. Edit files in `client/src/`
2. Vite hot-reloads automatically
3. Changes appear instantly in browser

#### Backend Changes

1. Edit files in `server/`
2. Save file
3. Restart server (Ctrl+C, then `npm start`)
4. Or use `npm run dev` with `--watch` flag

#### Database Changes

1. Connect to Supabase
2. Run SQL migrations in Supabase SQL Editor
3. Update `server/db/init.js` if needed

### Testing

**Manual Testing Checklist:**
- [ ] RSVP form submission (all languages)
- [ ] Admin login
- [ ] Admin dashboard loads
- [ ] Plus-one approval/rejection
- [ ] Notes editing
- [ ] CSV export
- [ ] Mobile responsiveness
- [ ] Navigation menu
- [ ] Language switching
- [ ] Calendar downloads

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add feature: description"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Merge to main after review

# Pull latest changes
git checkout main
git pull origin main
```

---

## Features

### 1. Multi-Language Support

**Languages:** Portuguese, English, Ukrainian

**Implementation:**
- Custom Context API (no external library)
- Browser language detection
- Persistent language selection (localStorage)
- All UI text translated

**Files:**
- `client/src/context/LanguageContext.jsx`
- `client/src/hooks/useLanguage.js`
- `client/src/locales/*.json`

### 2. RSVP System

**Features:**
- Multi-guest support (add multiple people in one submission)
- Plus-one requests
- Dietary restrictions/notes field
- Multi-language submissions

**Admin Features:**
- Approve/reject plus-one requests
- Edit notes
- Delete submissions
- CSV export

### 3. Calendar Integration

**Google Calendar:**
- Direct link to add event
- Pre-filled with wedding details

**Apple Calendar / Outlook:**
- Download .ics file
- Supports both ceremony and celebration

**Implementation:**
- `client/src/utils/calendar.js`
- Generates ICS format
- Dropdown selector for calendar type

### 4. Payment Information

**Bank Transfer:**
- Account holder name
- IBAN
- Bank name
- Copy IBAN button

**MBWAY:**
- Phone number
- Copy number button
- Logo display

### 5. Admin Dashboard

**Statistics:**
- Total submissions
- Total guests
- Attending count
- Not attending count
- Plus-one requests
- Language breakdown

**Management:**
- View all submissions
- Edit notes inline
- Approve/reject plus-ones
- Delete submissions
- Export CSV

### 6. Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Features:**
- Mobile navigation menu
- Responsive images
- Touch-friendly buttons
- Optimized layouts

### 7. Countdown Timer

**Features:**
- Real-time countdown to wedding
- Days, hours, minutes, seconds
- Updates every second
- Responsive design

---

## Security Best Practices Summary

✅ **Implemented:**
1. HTTPS/SSL on all services
2. CORS protection
3. Parameterized SQL queries (prevent SQL injection)
4. Input validation (client and server)
5. Environment variables for secrets
6. Token-based authentication
7. Password-protected admin access

⚠️ **Recommendations for Production:**
1. Use JWT with expiration
2. Implement rate limiting
3. Add request logging
4. Use bcrypt for password hashing
5. Implement CSRF protection
6. Add security headers (Helmet.js)
7. Regular security audits
8. Database backups
9. Monitoring and alerts
10. Content Security Policy (CSP)

---

## Troubleshooting

### Common Issues

**1. CORS Error**
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Update `FRONTEND_URL` in Render to match your Vercel URL exactly

**2. Database Connection Error**
```
ENETUNREACH or connection timeout
```
**Solution:**
- Use Supabase connection pooler URL (not direct URL)
- Ensure `DATABASE_URL` has URL-encoded password

**3. Admin Login Fails**
```
401 Unauthorized
```
**Solution:**
- Check `ADMIN_PASSWORD` in Render matches what you're entering
- Verify `ADMIN_TOKEN_SECRET` is set

**4. 404 on Refresh (Vercel)**
```
Page not found when refreshing non-root route
```
**Solution:** Ensure `vercel.json` exists with rewrite rules

**5. Images Not Loading**
```
404 on image files
```
**Solution:** Check image paths use `@/assets/` import, not public folder

---

## Support & Maintenance

### Regular Tasks

**Weekly:**
- Check admin dashboard for new RSVPs
- Export CSV backup

**Monthly:**
- Review Render/Vercel usage (free tier limits)
- Check for security updates in dependencies

**Before Wedding:**
- Final RSVP export
- Backup database
- Test all features

**After Wedding:**
- Keep site live for photo sharing (optional)
- Archive RSVP data
- Shut down services if no longer needed

---

## Conclusion

This wedding invitation website is a full-stack application demonstrating modern web development practices with a focus on security, user experience, and maintainability. The client-server architecture provides a clean separation of concerns, while the chosen technology stack ensures good performance and ease of deployment.

For questions or issues, refer to:
- `README.md` - Quick start guide
- `DEPLOYMENT.md` - Detailed deployment instructions
- This document - Complete technical documentation

---

**Built with ❤️ for Alla & Eduardo's Wedding**

*Last Updated: February 2026*
