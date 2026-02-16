import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // service role solo lato server

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

    if (
      typeof dataUrl !== "string" ||
      !dataUrl.startsWith("data:image/png;base64,")
    ) {
      return NextResponse.json({ error: "Invalid image payload" }, { status: 400 });
    }

    const base64 = dataUrl.split(",")[1];
    const bytes = Buffer.from(base64, "base64");

    // limite 3MB
    if (bytes.length > 3_000_000) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const filename = `${randomId()}.png`;
    const path = `shared/${filename}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(path, bytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 🔥 URL CDN invece di Supabase
    const cdnBase = (process.env.CDN_BASE_URL ?? "https://cdn.reav.space").replace(/\/+$/, "");
    const cdnUrl = `${cdnBase}/${path.replace(/^\/+/, "")}`;

    return NextResponse.json({ url: cdnUrl });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
