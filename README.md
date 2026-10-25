# PersonLens

**AI Personality & Voice Clarity Analyzer**

PersonLens is a full-stack MERN application that helps users discover their MBTI personality type, view detailed reports, track their growth over time, and (in a future update) analyze their voice clarity. It includes a user dashboard and an admin panel with real analytics.

---

## Features

- User registration and login (JWT authentication)
- MBTI-style personality test (30 questions) with automatic type calculation
- Detailed personality report (strengths, weaknesses, communication style, improvement areas)
- Information for all 16 MBTI types
- Reports and analysis history
- Voice Analyzer UI (ready to connect a real voice-analysis algorithm later)
- Profile and settings pages
- Admin panel: users, reports, and real analytics charts
- Empty states everywhere (the app works even with no data)

---

## Technology Used

**Frontend**
- React
- React Router
- Axios
- Recharts (charts)
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## Project Structure

```
PersonLens/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── context/
├── backend/           # Express API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── data/
│   ├── server.js
│   └── seed.js
└── README.md
```

---

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit the values
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### MongoDB Setup

Install MongoDB locally, or use a free MongoDB Atlas cluster, and put the connection string in the backend `.env` file as `MONGO_URL`.

---

## Environment Variables

Backend (`backend/.env`):

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=personlens
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@personlens.com
ADMIN_PASSWORD=admin123
```

Frontend (`frontend/.env`):

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## How to Run

1. Start MongoDB.
2. Start the backend: `cd backend && npm start`
3. (Optional) Create the admin account: `cd backend && npm run seed`
4. Start the frontend: `cd frontend && npm start`
5. Open `http://localhost:3000` in your browser.

---

## Admin Setup

Run the seed script once to create the admin account using the values from your `.env` file:

```bash
cd backend
npm run seed
```

Then log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you configured. Admin users are redirected to the admin panel.

---

## Future Voice Analyzer Integration

The Voice Analyzer page currently provides the full recording UI (record, timer, waveform, analyze) and saves a record to the database, but it does not compute real scores yet. A `VoiceAnalysis` model is already prepared with fields such as `clarity`, `confidence`, `speakingSpeed`, `fillerWords`, `pauses` and `communicationScore`. To add real analysis, update the `POST /api/voice/analyze` controller (`backend/controllers/voiceController.js`) to run your algorithm and fill in these values.
