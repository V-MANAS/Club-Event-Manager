# Club Event Scheduler (MERN) - Minimal Scaffold

This repository contains a minimal full-stack MERN scaffold for a Club Event Scheduler:
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite)

Features included:
- JWT auth (register/login)
- Clubs, Events, Registrations, Feedback models
- Example aggregation endpoints and a mapReduce sample
- Cron reminder example (console output)

How to run (locally):
1. Start MongoDB (e.g., `mongod`).
2. Backend:
   - cd backend
   - npm install
   - edit .env if needed
   - npm run seed
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Open http://localhost:5173

This scaffold is intentionally minimal — extend controllers, add validation, file uploads, email notifications, better UI, and tests for a production-ready app.
