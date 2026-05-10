const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const DATA_FILE = path.join(__dirname, "data", "interns.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function readInterns() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeInterns(interns) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(interns, null, 2));
}

function publicIntern(intern) {
  if (!intern) return null;
  const { loginPassword, ...safeIntern } = intern;
  return safeIntern;
}

function createToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "8h" });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function findInternByUsername(username) {
  const normalized = String(username || "").trim().toLowerCase();
  return readInterns().find((intern) => {
    return (
      String(intern.internId || "").toLowerCase() === normalized ||
      String(intern.email || "").toLowerCase() === normalized
    );
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUsername = String(username || "").trim();

  if (normalizedUsername.toLowerCase() === "admin" && password === "admin123") {
    const user = { role: "admin", id: "admin", username: "admin" };
    return res.json({ token: createToken(user), user });
  }

  const intern = findInternByUsername(normalizedUsername);
  if (intern && password === intern.loginPassword) {
    const user = {
      role: "intern",
      id: intern.internId,
      username: intern.internId,
      internId: intern.internId,
      certificateId: intern.certificateId
    };
    return res.json({ token: createToken(user), user, intern: publicIntern(intern) });
  }

  return res.status(401).json({ message: "Invalid username or password." });
});

app.post("/api/verify", (req, res) => {
  const { certificateId, email, dob } = req.body || {};
  const intern = readInterns().find((record) => {
    return (
      String(record.certificateId || "").toLowerCase() === String(certificateId || "").trim().toLowerCase() &&
      String(record.email || "").toLowerCase() === String(email || "").trim().toLowerCase() &&
      String(record.dob || "") === String(dob || "").trim()
    );
  });

  if (!intern) {
    return res.status(401).json({ message: "Verification failed. Please check the submitted details." });
  }

  const user = {
    role: "intern",
    id: intern.internId,
    username: intern.internId,
    internId: intern.internId,
    certificateId: intern.certificateId
  };

  return res.json({ token: createToken(user), user, intern: publicIntern(intern) });
});

app.get("/api/interns", authenticate, (req, res) => {
  const interns = readInterns().map(publicIntern);
  if (req.user.role === "admin") {
    return res.json(interns);
  }

  return res.json(interns.filter((intern) => intern.internId === req.user.internId));
});

app.post("/api/interns", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create interns." });
  }

  const interns = readInterns();
  const incoming = req.body || {};
  const internId = String(incoming.internId || "").trim();

  if (!internId) {
    return res.status(400).json({ message: "Intern ID is required." });
  }

  if (interns.some((intern) => String(intern.internId).toLowerCase() === internId.toLowerCase())) {
    return res.status(409).json({ message: "Intern ID already exists." });
  }

  const newIntern = { ...incoming, internId, loginPassword: incoming.loginPassword || "student123" };
  interns.push(newIntern);
  writeInterns(interns);
  return res.status(201).json(publicIntern(newIntern));
});

app.put("/api/interns/:internId", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can update interns." });
  }

  const interns = readInterns();
  const index = interns.findIndex((intern) => String(intern.internId) === String(req.params.internId));

  if (index === -1) {
    return res.status(404).json({ message: "Intern not found." });
  }

  const updatedIntern = {
    ...interns[index],
    ...req.body,
    internId: interns[index].internId,
    loginPassword: req.body.loginPassword || interns[index].loginPassword || "student123"
  };

  interns[index] = updatedIntern;
  writeInterns(interns);
  return res.json(publicIntern(updatedIntern));
});

app.get("/api/dashboard", authenticate, (req, res) => {
  const interns = readInterns();
  const intern =
    req.user.role === "admin"
      ? interns[0]
      : interns.find((record) => record.internId === req.user.internId);

  if (!intern) {
    return res.status(404).json({ message: "Intern not found." });
  }

  return res.json(publicIntern(intern));
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}/api`);
});
