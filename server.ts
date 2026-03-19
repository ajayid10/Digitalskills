import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const SECRET = process.env.JWT_SECRET || "supersecuresecret";

  app.use(express.json());

  /* Persistence (demo storage) */
  let users: any[] = [];
  let progress: Record<string, string[]> = {};

  /* Signup */
  app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const hash = await bcrypt.hash(password, 10);
    users.push({
      name,
      email,
      password: hash,
      role: "student",
    });
    res.json({ message: "Account created" });
  });

  /* Login */
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ email, name: user.name }, SECRET);
    res.json({ token, name: user.name, email: user.email });
  });

  /* Save progress */
  app.post("/api/progress", (req, res) => {
    const { email, completedLessons } = req.body;
    if (!email || !Array.isArray(completedLessons)) {
      return res.status(400).json({ message: "Invalid data" });
    }
    progress[email] = completedLessons;
    res.json({ message: "Progress saved", progress: progress[email] });
  });

  /* Get progress */
  app.get("/api/progress/:email", (req, res) => {
    const { email } = req.params;
    res.json({ completedLessons: progress[email] || [] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
