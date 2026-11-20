# GossipFlow

A full-stack real-time chat and social messaging application featuring JWT access & refresh token authentication, automatic token renewal via Axios interceptors, friend requests, and conversation management.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix UI), Zustand, React Router v7, React Hook Form + Zod, Axios, Sonner |
| **Backend** | Node.js, Express 5 (ESM), MongoDB & Mongoose, JWT (`jsonwebtoken`), `bcrypt`, `cookie-parser` |

---

## Project Structure

```text
GossipFlow/
├── backend/
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── controllers/   # auth, user, and friend controllers
│       ├── middlewares/   # JWT protected route middleware
│       ├── models/        # User, Session, Friend, FriendRequest, Conversation, Message
│       ├── routes/        # /api/auth, /api/user, /api/friends
│       └── server.js      # Express entry point (port 5001)
└── frontend/
    └── src/
        ├── components/    # Auth forms, ProtectedRoute, shadcn/ui components
        ├── lib/           # Axios instance with auto refresh-token interceptor
        ├── pages/         # SignInPage, SignUpPage, ChatAppPage
        ├── services/      # API service layer
        ├── stores/        # Zustand auth store
        └── types/         # Shared TypeScript interfaces
```

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
```

---

## Local Development

**1. Start the backend**

```bash
cd backend
npm install
npm run dev
```

**2. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```
