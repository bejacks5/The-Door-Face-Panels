const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const mfa = require("./mfaStore");

const app = express();
app.use(express.json());

// Load users from users.json
const users = JSON.parse(fs.readFileSync("./users.json", "utf8"));

/**
 * POST /login
 * { username, password, livenessVerified }
 */
app.post("/login", (req, res) => {
    const { username, password, livenessVerified } = req.body;

    if (!livenessVerified) {
        return res.status(400).json({ error: "Liveness verification required" });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const challengeId = uuidv4();
    mfa.saveChallenge(challengeId, username);

    return res.json({
        status: "MFA_REQUIRED",
        challengeId
    });
});


/**
 * POST /mfa/verify
 * { challengeId, code }
 */
app.post("/mfa/verify", (req, res) => {
    const { challengeId, code } = req.body;

    const username = mfa.verifyChallenge(challengeId, code);

    if (!username) {
        return res.status(400).json({ error: "MFA verification failed" });
    }

    const sessionToken = uuidv4();
    mfa.createSessionToken(sessionToken, username);

    return res.json({
        status: "AUTHENTICATED",
        sessionToken
    });
});


/**
 * POST /logout
 * { token }
 */
app.post("/logout", (req, res) => {
    const { token } = req.body;

    const valid = mfa.verifySessionToken(token);

    if (!valid) {
        return res.status(401).json({ error: "Invalid token" });
    }

    mfa.deleteSessionToken(token);

    return res.json({ status: "LOGGED_OUT" });
});


// Start server
app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
