# Backend API

The backend includes JWT authentication and task CRUD APIs.

## Environment

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

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

Task endpoints require `Authorization: Bearer <token>`.
