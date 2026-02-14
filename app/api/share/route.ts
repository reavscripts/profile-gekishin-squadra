import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // importante: service role solo su node runtime

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // MAI nel client
);

function randomId() {
  return crypto.randomUUID();
}

export async function POST(req: Request) {
  try {
    const { dataUrl } = await req.json();

    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Invalid image payload" }, { status: 400 });
    }

    const base64 = dataUrl.split(",")[1];
    const bytes = Buffer.from(base64, "base64");

    // protezioni base
    if (bytes.length > 3_000_000) { // 3MB
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const filename = `${randomId()}.png`;
    const path = `shared/${filename}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(path, bytes, { contentType: "image/png", upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // URL pubblico (bucket deve essere public) oppure signed url (bucket private)
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
