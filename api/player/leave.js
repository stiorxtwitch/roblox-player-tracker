import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.ROBLOX_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId, jobId } = req.body || {};

  if (!Number.isInteger(userId) || !jobId) {
    return res.status(400).json({ error: "Missing or invalid data" });
  }

  const { error } = await supabase
    .from("players")
    .update({
      online: false,
      last_seen: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }

  return res.status(200).json({ success: true });
}
