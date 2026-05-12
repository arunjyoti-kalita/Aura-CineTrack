import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { SAMPLE_DATA } from "./src/sampleData.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "db.json");

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }));
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/data/:userId", (req, res) => {
    const { userId } = req.params;
    const db = readDB();
    
    // If user doesn't exist, initialize them with SAMPLE_DATA permanently
    if (!db.users[userId]) {
      db.users[userId] = { 
        entries: SAMPLE_DATA, 
        goals: [], 
        lists: [] 
      };
      writeDB(db);
    }
    
    res.json(db.users[userId]);
  });

  app.post("/api/data/:userId", (req, res) => {
    const { userId } = req.params;
    const { entries, goals, lists } = req.body;
    const db = readDB();
    db.users[userId] = { entries, goals, lists };
    writeDB(db);
    res.json({ status: "success" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
