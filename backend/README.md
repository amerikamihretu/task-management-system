# Backend API

The backend now includes the initial authentication API.

## Environment

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task_management
CLIENT_URL=http://localhost:5173
JWT_SECRET=use-a-long-random-secret
```

## Run

```bash
cd backend
npm install
npm run dev
```

## Current endpoints

- `GET /api/health`
- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `GET /api/auth/me` with `Authorization: Bearer <token>`
