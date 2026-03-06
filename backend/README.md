# Backend API (Firestore)

Team backend for Firestore read/write testing.

- Default port: `5050`
- Firestore collection: `devices`

## Team Quickstart

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Add Firebase credentials locally (not in git):
- Option A (recommended): place key at `backend/serviceAccountKey.json`
- Option B: set `FIREBASE_SERVICE_ACCOUNT_PATH` to a key file path
- Option C: set `FIREBASE_SERVICE_ACCOUNT` to the full JSON string

3. Start backend:

```bash
cd backend
node server.js
```

4. Start frontend in a second terminal:

```bash
cd frontend
npm start
```

5. In the app:
- Open `Security` tab
- Use `Firestore Test`
- `Save Mock Device` writes to Firestore
- `Load Devices` reads from Firestore

## Firestore Credential Notes

- Key files are gitignored by design.
- Each teammate must set up credentials locally after pulling `main`.
- Everyone can use the same Firebase project as long as their key has access to that project.

## API Endpoints

- `GET /health` checks backend-to-Firestore connectivity.
- `POST /devices` creates a device document.
- `GET /devices` lists device documents (newest first).
- `GET /devices/:id` gets one device document by id.

## Terminal API Test

With backend running:

```bash
curl -s http://localhost:5050/health
curl -s -X POST http://localhost:5050/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Front Door Panel","status":"online","location":"Front Door"}'
curl -s http://localhost:5050/devices
```

## Troubleshooting

- `Firebase service account key not found`:
  add `backend/serviceAccountKey.json` or set `FIREBASE_SERVICE_ACCOUNT_PATH`.
- Firestore auth/permission errors:
  ensure the service account belongs to the correct Firebase project and has Firestore access.
