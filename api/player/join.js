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

  const { userId, username, displayName, placeId, jobId } = req.body || {};

  if (
    !Number.isInteger(userId) ||
    !username ||
    !displayName ||
    !Number.isInteger(placeId) ||
    !jobId
  ) {
    return res.status(400).json({ error: "Missing or invalid data" });
  }

  const now = new Date().toISOString();

  const { error } = await supabase.from("players").upsert(
    {
      user_id: userId,
      username,
      display_name: displayName,
      place_id: placeId,
      job_id: jobId,
      joined_at: now,
      last_seen: now,
      online: true
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }

  return res.status(200).json({ success: true });
}
