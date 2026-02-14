import { createClient } from "@supabase/supabase-js";

export function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, key);
}

export function supabasePublicImageUrl(objectKey: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  // objectKey example: "uuid.png" or "profiles/uuid.png"
  return `${url}/storage/v1/object/public/profile-images/${objectKey}`;
}
