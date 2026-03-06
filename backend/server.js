const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

function loadFirebaseCredentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON.");
    }
  }

  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const defaultPath = path.join(__dirname, "serviceAccountKey.json");
  const credentialPath = configuredPath
    ? path.resolve(configuredPath)
    : defaultPath;

  if (!fs.existsSync(credentialPath)) {
    throw new Error(
      "Firebase service account key not found. Set FIREBASE_SERVICE_ACCOUNT_PATH or add backend/serviceAccountKey.json."
    );
  }

  return require(credentialPath);
}

const credentials = loadFirebaseCredentials();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const db = admin.firestore();
const app = express();
const port = Number(process.env.PORT) || 5050;

app.use(cors());
app.use(express.json());

async function createDevice(req, res) {
  try {
    const device = req.body;

    if (!device || typeof device !== "object" || Array.isArray(device)) {
      return res
        .status(400)
        .json({ error: "Request body must be a JSON object." });
    }

    const payload = {
      ...device,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("devices").add(payload);
    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.get("/health", async (_req, res) => {
  try {
    await db.listCollections();
    res.status(200).json({ ok: true, message: "Firestore connected" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/devices", async (req, res) => {
  return createDevice(req, res);
});

app.get("/devices", async (_req, res) => {
  try {
    const snapshot = await db
      .collection("devices")
      .orderBy("createdAt", "desc")
      .get();

    const devices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(devices);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/devices/:id", async (req, res) => {
  try {
    const doc = await db.collection("devices").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Device not found." });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
