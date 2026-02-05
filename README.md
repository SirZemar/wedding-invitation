# Wedding Invitation Website

A beautiful, multi-language wedding invitation website with RSVP functionality and admin panel.

## Features

- 🌍 Multi-language support (Portuguese, English, Ukrainian)
- 📅 Countdown timer to wedding day
- 🗺️ Interactive maps for ceremony and celebration venues
- 📲 RSVP form with multi-guest support
- 🎁 Gift registry with bank details
- 👔 Admin panel for managing RSVPs
- 📊 Real-time statistics dashboard
- 📥 CSV export of guest list
- 🚗 Transportation and accommodation information
- 📱 Fully responsive design

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express
- SQLite with better-sqlite3

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/wedding-invitation.git
cd wedding-invitation
```

2. Install dependencies:

**Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your settings
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Admin Panel: http://localhost:5173/admin

### Environment Variables

**Backend** (`server/.env`):
```
PORT=3001
NODE_ENV=development
ADMIN_PASSWORD=your_password
ADMIN_TOKEN_SECRET=your_secret_key
DB_PATH=./db/wedding.db
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`client/.env`):
```
VITE_API_URL=http://localhost:3001/api
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel (frontend) and Render (backend).

**Quick Deploy:**
1. Push to GitHub
2. Connect Vercel to your repo (frontend in `/client`)
3. Connect Render to your repo (backend in `/server`)
4. Configure environment variables
5. Done! 🎉

## Configuration

Update wedding details in `client/src/utils/calendar.js`:

```javascript
export const WEDDING_CONFIG = {
  brideName: 'Your Bride Name',
  groomName: 'Your Groom Name',
  weddingDateISO: '2024-09-14T16:00:00',
  ceremonyTime: '16:00',
  celebrationTime: '18:30',
  // ... more settings
}
```

## Admin Access

1. Navigate to `/admin`
2. Enter your admin password (set in backend .env)
3. View and manage RSVPs, export CSV, handle plus-one requests

## Project Structure

```
wedding-invitation/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Utilities
│   │   └── locales/     # Translations
│   └── ...
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── db/              # Database
│   └── middleware/      # Auth middleware
└── ...
```

## License

Private - For personal use only

## Support

For questions or issues, contact the developer.
