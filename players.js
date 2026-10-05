import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Un joueur est considéré hors ligne si son heartbeat date de plus de 90 secondes.
  const cutoff = new Date(Date.now() - 90 * 1000).toISOString();

  await supabase
    .from("players")
    .update({ online: false })
    .eq("online", true)
    .lt("last_seen", cutoff);

  const { data, error } = await supabase
    .from("players")
    .select(
      "user_id, username, display_name, place_id, job_id, joined_at, last_seen, online"
    )
    .eq("online", true)
    .order("joined_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }

  return res.status(200).json(data);
}
