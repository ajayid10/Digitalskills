import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const SECRET = process.env.JWT_SECRET || "supersecuresecret";

  // RDS Connection Pool (MySQL)
  let pool: any = null;
  let useRDS = false;

  if (process.env.DB_USER && process.env.DB_HOST) {
    const useSSL = process.env.DB_SSL !== "false";
    const sslConfig = useSSL ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "global-bundle.pem"))
    } : undefined;

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000 // Increased timeout for SSL
    });
    useRDS = true;
  }

  // Initialize Database Tables
  const initDb = async () => {
    if (!useRDS) {
      console.log("RDS not configured, using in-memory storage.");
      return;
    }
    try {
      // Test connection
      console.log(`Attempting to connect to RDS at ${process.env.DB_HOST}:${process.env.DB_PORT || "3306"}...`);
      const conn = await pool.getConnection();
      console.log("Successfully connected to RDS.");
      conn.release();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name TEXT NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT
        )
      `);
      // ... rest of tables ...
      await pool.query(`
        CREATE TABLE IF NOT EXISTS progress (
          email VARCHAR(255) PRIMARY KEY,
          completed_lessons JSON
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS typing_scores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          wpm INTEGER NOT NULL,
          accuracy INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS generated_videos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          lesson_id TEXT NOT NULL,
          video_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("RDS Tables initialized successfully.");
    } catch (err: any) {
      console.error("RDS Initialization Error:", err);
      if (err.code === 'ETIMEDOUT') {
        console.error("Troubleshooting Tip: This ETIMEDOUT error usually means the database is unreachable.");
        console.error("1. Ensure your RDS instance is 'Publicly Accessible' in the AWS Console.");
        console.error("2. Check your AWS Security Group to allow inbound traffic on port 3306 from 0.0.0.0/0 (or the app's IP).");
        console.error(`3. Verify that DB_HOST (${process.env.DB_HOST}) and DB_PORT (${process.env.DB_PORT || "3306"}) are correct.`);
      }
      console.log("Falling back to in-memory storage due to connection failure.");
      useRDS = false;
    }
  };
  initDb();

  app.use(express.json());

  /* Health Check */
  app.get("/api/health", async (req, res) => {
    const debug: any = {
      timestamp: new Date().toISOString(),
      env: {
        hasHost: !!process.env.DB_HOST,
        hasUser: !!process.env.DB_USER,
        hasPass: !!process.env.DB_PASSWORD,
        hasName: !!process.env.DB_NAME,
        port: process.env.DB_PORT || "3306",
        ssl: process.env.DB_SSL !== "false"
      }
    };

    if (!useRDS) {
      return res.json({ status: "ok", mode: "in-memory", debug });
    }

    try {
      const start = Date.now();
      const [rows]: any = await pool.query("SELECT 1 as ok");
      res.json({ 
        status: "ok", 
        mode: "rds", 
        latency: `${Date.now() - start}ms`,
        db: rows[0].ok === 1,
        debug
      });
    } catch (err: any) {
      console.error("Health Check Failed:", err);
      res.status(500).json({ 
        status: "error", 
        mode: "rds", 
        message: err.message,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
        debug,
        tip: err.code === 'ETIMEDOUT' 
          ? "The connection timed out. This is almost always an AWS Security Group issue. Ensure port 3306 is open to 0.0.0.0/0 in the RDS Security Group." 
          : "Check your database credentials and SSL configuration."
      });
    }
  });

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
    
    if (useRDS) {
      try {
        await pool.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hash]
        );
        return res.json({ message: "Account created" });
      } catch (err: any) {
        console.error("Signup DB Error:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Email already exists" });
        return res.status(500).json({ message: `Database error: ${err.message || 'Unknown error'}` });
      }
    }

    users.push({ name, email, password: hash, role: "student" });
    res.json({ message: "Account created (In-memory)" });
  });

  /* Login */
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    let user;

    try {
      if (useRDS) {
        const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        user = rows[0];
      } else {
        user = users.find((u) => u.email === email);
      }

      if (!user) return res.status(401).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ email, name: user.name }, SECRET);
      res.json({ token, name: user.name, email: user.email });
    } catch (err: any) {
      console.error("Login DB Error:", err);
      res.status(500).json({ message: `Database error: ${err.message}` });
    }
  });

  /* Save progress */
  app.post("/api/progress", async (req, res) => {
    const { email, completedLessons } = req.body;
    if (!email || !Array.isArray(completedLessons)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      if (useRDS) {
        await pool.query(
          "INSERT INTO progress (email, completed_lessons) VALUES (?, ?) ON DUPLICATE KEY UPDATE completed_lessons = ?",
          [email, JSON.stringify(completedLessons), JSON.stringify(completedLessons)]
        );
      } else {
        progress[email] = completedLessons;
      }
      res.json({ message: "Progress saved" });
    } catch (err: any) {
      console.error("Progress Save Error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  /* Get progress */
  app.get("/api/progress/:email", async (req, res) => {
    const { email } = req.params;
    
    try {
      if (useRDS) {
        const [rows]: any = await pool.query("SELECT completed_lessons FROM progress WHERE email = ?", [email]);
        let lessons = rows[0]?.completed_lessons || [];
        if (typeof lessons === 'string') lessons = JSON.parse(lessons);
        return res.json({ completedLessons: lessons });
      }
      res.json({ completedLessons: progress[email] || [] });
    } catch (err: any) {
      console.error("Progress Get Error:", err);
      res.json({ completedLessons: [] });
    }
  });

  /* Save Generated Video */
  app.post("/api/save-video", async (req, res) => {
    const { email, lessonId, videoUrl } = req.body;
    if (!email || !lessonId || !videoUrl) return res.status(400).json({ message: "Missing data" });

    try {
      if (useRDS) {
        await pool.query(
          "INSERT INTO generated_videos (email, lesson_id, video_url) VALUES (?, ?, ?)",
          [email, lessonId, videoUrl]
        );
        return res.json({ message: "Video saved to RDS" });
      }
      res.json({ message: "Video saved (In-memory)" });
    } catch (err: any) {
      console.error("Video Save Error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  /* Get Saved Videos */
  app.get("/api/videos/:email", async (req, res) => {
    const { email } = req.params;
    try {
      if (useRDS) {
        const [rows]: any = await pool.query("SELECT * FROM generated_videos WHERE email = ? ORDER BY created_at DESC", [email]);
        return res.json({ videos: rows });
      }
      res.json({ videos: [] });
    } catch (err: any) {
      console.error("Videos Get Error:", err);
      res.json({ videos: [] });
    }
  });

  /* Save Typing Score */
  app.post("/api/typing-score", async (req, res) => {
    const { email, wpm, accuracy } = req.body;
    if (!email || wpm === undefined || accuracy === undefined) {
      return res.status(400).json({ message: "Missing data" });
    }

    try {
      if (useRDS) {
        await pool.query(
          "INSERT INTO typing_scores (email, wpm, accuracy) VALUES (?, ?, ?)",
          [email, wpm, accuracy]
        );
        return res.json({ message: "Score saved to RDS" });
      }
      res.json({ message: "Score saved (In-memory)" });
    } catch (err: any) {
      console.error("Typing Score Save Error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  /* Get Typing Scores */
  app.get("/api/typing-scores/:email", async (req, res) => {
    const { email } = req.params;
    try {
      if (useRDS) {
        const [rows]: any = await pool.query("SELECT * FROM typing_scores WHERE email = ? ORDER BY wpm DESC LIMIT 5", [email]);
        return res.json({ scores: rows });
      }
      res.json({ scores: [] });
    } catch (err: any) {
      console.error("Typing Scores Get Error:", err);
      res.json({ scores: [] });
    }
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
