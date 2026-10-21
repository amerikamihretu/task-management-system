# Minimal backend

This backend currently provides a health endpoint and a MongoDB connection foundation.

## Run

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The health endpoint is available at `GET /api/health`.
