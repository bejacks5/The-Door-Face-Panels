# Backend (Firestore)


- Port: `5050`
- Firestore collection: `devices`

## Quick Team Setup

1. Install backend packages:

```bash
cd backend
npm install
```

2. Set up your Firebase key locally:
- Follow `Firebase Setup (First Time)` below
- Put the key at `backend/serviceAccountKey.json`

3. Start backend:

```bash
node server.js
```

4. Start frontend in a second terminal:

```bash
cd frontend
npm start
```

5. In the app:
- Open `Security` tab
- Use the `Firestore Test` box
- `Save Mock Device` writes to Firestore
- `Load Devices` reads from Firestore

## Firebase Setup (First Time)

Do this once on your machine:

1. Open Firebase Console and choose our project.
2. Go to `Project settings` (gear icon).
3. Open `Service accounts`.
4. Under Firebase Admin SDK, click `Generate new private key`.
5. Download the JSON file.
6. Move/copy it to `backend/serviceAccountKey.json`.

Optional check:

```bash
git check-ignore -v backend/serviceAccountKey.json
```

If this shows a `.gitignore` rule, the key will not be committed.

## API Endpoints

- `GET /health`
- `POST /devices`
- `GET /devices`
- `GET /devices/:id`

## Terminal Test (Optional)

With backend running:

```bash
curl -s http://localhost:5050/health
curl -s -X POST http://localhost:5050/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Front Door Panel","status":"online","location":"Front Door"}'
curl -s http://localhost:5050/devices
```

## Notes

- Everyone has their own local key file.
- If keys are from the same Firebase project, we all connect to the same Firestore database.
- Never commit `backend/serviceAccountKey.json`.
