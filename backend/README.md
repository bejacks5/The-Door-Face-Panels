# Overview

This backend implements a simple login → MFA → session flow using Node.js + Express. It provides three endpoints: `/login`, `/mfa/verify`, and `/logout`.

# How it Works

## /login

**Accepts:** `username`, `password`, `livenessVerified` (boolean)

Checks if the username and password match a user in `users.json`. Rejects login if `livenessVerified` is false or missing. If valid, generates a unique MFA challenge ID and stores it temporarily in memory.

**Responds with:**
```json
{
  "status": "MFA_REQUIRED",
  "challengeId": "UUID"
}
```

## /mfa/verify

**Accepts:** `challengeId`, `code`

Checks if the `challengeId` exists and the code matches the fixed MFA code (123456). If valid, generates a session token (UUID) and stores it in memory.

**Responds with:**
```json
{
  "status": "AUTHENTICATED",
  "sessionToken": "UUID"
}
```

Ensures only valid MFA challenges can create session tokens.

## /logout

**Accepts:** `token`

Removes the session token from memory.

**Responds with:**
```json
{
  "status": "LOGGED_OUT"
}
```

Ensures session tokens cannot be reused after logout.

# Data Storage

- **User credentials:** stored in `users.json` (simple JSON file with usernames and passwords)
- **MFA challenges and session tokens:** stored in memory in `mfaStore.js`
- These are temporary and reset when the server restarts

# Setup

Clone the repo:
```bash
git clone https://github.com/bejacks5/The-Door-Face-Panels.git
cd The-Door-Face-Panels/backend
```

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm start
```

Server runs at: `http://localhost:3000`

# Endpoints and Usage (Postman)

## 1. POST /login

**URL:** `http://localhost:3000/login`

**Body (JSON):**
```json
{
  "username": "testuser",
  "password": "password123",
  "livenessVerified": true
}
```

**Response:**
```json
{
  "status": "MFA_REQUIRED",
  "challengeId": "UUID"
}
```

## 2. POST /mfa/verify

**URL:** `http://localhost:3000/mfa/verify`

**Body (JSON):**
```json
{
  "challengeId": "challenge-id-from-login",
  "code": "123456"
}
```

**Response:**
```json
{
  "status": "AUTHENTICATED",
  "sessionToken": "UUID"
}
```

## 3. POST /logout

**URL:** `http://localhost:3000/logout`

**Body (JSON):**
```json
{
  "token": "session-token-from-verify"
}
```

**Response:**
```json
{
  "status": "LOGGED_OUT"
}
```

# Postman Instructions

1. Open Postman and create a new POST request
2. Copy the URL and body JSON for each endpoint
3. Send requests and check responses
