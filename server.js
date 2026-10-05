const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

// Mets une longue clé secrète (variable d'environnement API_KEY sur l'hébergeur)
const API_KEY = process.env.API_KEY || "CHANGE_MOI";
const PORT = process.env.PORT || 3000;

// Un jeu Roblox peut avoir plusieurs serveurs : on stocke la liste de chacun (par JobId)
const servers = new Map(); // jobId -> { players: [...], lastSeen }
const TIMEOUT = 90 * 1000; // un serveur muet pendant 90 s est considéré fermé

function auth(req, res, next) {
  if (req.get("x-api-key") !== API_KEY) return res.status(401).json({ error: "unauthorized" });
  next();
}

// Appelé par le script Roblox
app.post("/api/sync", auth, (req, res) => {
  const { jobId, players } = req.body || {};
  if (!jobId || !Array.isArray(players)) return res.status(400).json({ error: "bad request" });

  const clean = players.slice(0, 200).map((p) => ({
    userId: Number(p.userId),
    username: String(p.username).slice(0, 50),
    displayName: String(p.displayName).slice(0, 50),
  }));
  servers.set(String(jobId), { players: clean, lastSeen: Date.now() });
  res.json({ ok: true });
});

// Appelé par le site web
app.get("/api/players", (req, res) => {
  const now = Date.now();
  const all = new Map();
  for (const [jobId, s] of servers) {
    if (now - s.lastSeen > TIMEOUT) { servers.delete(jobId); continue; }
    s.players.forEach((p) => all.set(p.userId, p));
  }
  res.json({ count: all.size, players: [...all.values()] });
});

app.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
