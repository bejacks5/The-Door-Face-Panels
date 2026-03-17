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
app.use(express.json({ limit: "5mb" })); // 5 mb limit

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

// Facial Recognition: Helper function for cosine distance
function cosineDistance(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i]);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return 1 - (dotProduct / (mag1 * mag2));
}

// Facial Recognition: Helper function to generate an embedding
const { spawn } = require('child_process');
const python_command = process.platform === 'win32'
  ? path.join(__dirname, 'python-venv', 'Scripts', 'python.exe')   // windows
  : path.join(__dirname, 'python-venv', 'bin', 'python3');         // mac/linux

async function getEmbedding(base64Image) {
  // we will spawn a python process, specifically embedding.py to generate embeddings with the deepface library
  return new Promise((resolve, reject) => {
    const py = spawn('python', [path.join(__dirname, 'embedding.py')]);
    let result = '';

    py.stdout.on('data', (data) => result += data.toString());
    py.stderr.on('data', (err) => console.warn('Python stderr:', err.toString()));
    py.stdin.on('error', () => {}); // prevent crash when python exits early
    py.on('close', () => {
      try {
        const parsed = JSON.parse(result.trim());
        if(parsed.error) return reject(new Error(parsed.error));
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse python output: ${result}`));
      }
      // resolve(JSON.parse(result))
    });

    py.stdin.write(JSON.stringify({ image: base64Image }));
    py.stdin.end();
  });
}

// Facial Recognition: Generate an encoding and compare it to the backend
app.post("/face/authenticate", async (req, res) => {
  try {
    const { images } = req.body;

    if(!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Images is required." });
    }

    // collect all faces from firestore    
    const snapshot = await db.collection("faces").get();
    const faces = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (faces.length === 0) {
      return res.json({ authenticated: false, message: "No registered users."});
    }

    // get the embeddings
    const embeddings = [];
    for(const img of images) {
      try {
        const embedding = await getEmbedding(img);
        embeddings.push(embedding);
      } catch (err) {
        console.warn('Failed to get an embedding:', err.message);
      }
    }

    if (embeddings.length === 0) {
      return res.status(400).json({ error: "No valid faces found in the images."} );
    }

    // average the embeddings
    const newEmbedding = embeddings[0].map((_, i) => 
      embeddings.reduce((sum, e) => sum + e[i], 0) / embeddings.length
    );

    // compare distance of embeddings to the ones in the database
    const threshold = 0.6;
    let bestMatch = null;
    let minDistance = Infinity;

    for(const face of faces) {
      const distance = cosineDistance(newEmbedding, face.embedding);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = face;
      }
    }

    if(minDistance < threshold) {
      return res.json({ authenticated: true, name: bestMatch.name, threshold: threshold, distance: minDistance});
    } else {
      return res.json({ authenticated: false, message: "No match found, authentication failed.", threshold: threshold, distance: minDistance });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Facial Recognition: Introduce a new user
app.post("/face/register", async (req, res) => {
  try {
    const { name, images } = req.body;

    // make sure that we have a name and that there is more than 1 image
    // we want more than 1 image to average it so the encoding will be more accurate
    if(!name || !images || !Array.isArray(images)) {
      return res.status(500).json({ error: "Name and multiple images are required." });
    }

    // use faceapi to get the embeddings of each image
    const embeddings = [];
    for(const img of images) {
      try {
        const embedding = await getEmbedding(img);
        embeddings.push(embedding);
      } catch (err) {
        console.warn('Failed to get an embedding:', err.message);
      }
    }

    if (embeddings.length === 0) {
      return res.status(400).json({ error: "No valid faces found in the images."} );
    }

    // average the embeddings
    const avgEmbedding = embeddings[0].map((_, i) => 
      embeddings.reduce((sum, e) => sum + e[i], 0) / embeddings.length
    );

    const doc = await db.collection("faces").add({
      name,
      embedding: avgEmbedding,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      id: doc.id,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
