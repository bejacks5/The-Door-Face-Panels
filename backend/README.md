# Backend API (Firestore)

This backend is an Express API connected to Firebase Firestore.

Default server port: `5050`  
Default collection: `devices`

## Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- A Firebase Admin service account key

## Install

```bash
cd backend
npm install
```

## Firebase Credentials

Use one of these options:

1. `backend/serviceAccountKey.json` (default path)
2. `FIREBASE_SERVICE_ACCOUNT_PATH` (absolute or relative file path)
3. `FIREBASE_SERVICE_ACCOUNT` (full JSON string in an env var)

Example with path:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json node server.js
```

## Team Setup (Firestore)

Service account key files are gitignored, so each teammate must configure credentials locally.

1. In Firebase Console, open your project and create/download a Firebase Admin service account key JSON.
2. Put the file at `backend/serviceAccountKey.json` (recommended for local dev), or set `FIREBASE_SERVICE_ACCOUNT_PATH` to wherever they store it.
3. Start backend from `backend/`.

All teammates can connect to the same Firestore project as long as they use credentials from that project.

## Run

```bash
cd backend
node server.js
```

Optional custom port:

```bash
PORT=5051 node server.js
```

## API Endpoints

- `GET /health`  
  Checks backend-to-Firestore connectivity.

- `POST /devices`  
  Creates a new device document.

- `GET /devices`  
  Lists all devices (newest first).

- `GET /devices/:id`  
  Gets a single device by document ID.

## Quick Terminal Test

Start server:

```bash
cd backend
node server.js
```

In another terminal:

```bash
curl -s http://localhost:5050/health
```

```bash
curl -s -X POST http://localhost:5050/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Front Door Panel","status":"online","location":"Front Door"}'
```

```bash
curl -s http://localhost:5050/devices
```

## Test With Frontend App

Run backend and frontend at the same time in separate terminals.

1. Start backend:

```bash
cd /Users/brycejackson/Desktop/The-Door-Face-Panels/backend
node server.js
```

2. (Optional) confirm backend health:

```bash
curl -s http://localhost:5050/health
```

3. Start frontend:

```bash
cd /Users/brycejackson/Desktop/The-Door-Face-Panels/frontend
npm start
```

4. In the app, open the `Security` tab and use the `Firestore Test` section:
- Enter a device name (or leave blank)
- Tap `Save Mock Device` to write a document to Firestore
- Tap `Load Devices` to read documents from Firestore

5. Verify in Firebase Console that documents are created in collection `devices`.

## Common Issues

- `Firebase service account key not found`  
  Add `backend/serviceAccountKey.json` or set `FIREBASE_SERVICE_ACCOUNT_PATH` before starting the server.

- Firestore permission/auth errors  
  Make sure the service account belongs to the same Firebase project and Firestore is enabled.
