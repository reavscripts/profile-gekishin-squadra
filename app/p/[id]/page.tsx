import type { Metadata } from "next";
import Link from "next/link";
import { supabaseClient, supabasePublicImageUrl } from "@/lib/supabase";

async function getProfile(id: string) {
  const supabase = supabaseClient();
  const { data, error } = await supabase.from("profiles").select("id, template_id, image_path, created_at").eq("id", id).single();
  if (error) return null;
  return data as { id: string; template_id: string; image_path: string; created_at: string };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProfile(params.id);
  const title = p ? `Profile — ${p.template_id}` : "Profile";
  const desc = "Immagine profilo generata su profile.reav.space";
  const img = p ? supabasePublicImageUrl(p.image_path) : undefined;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "article",
      images: img ? [{ url: img }] : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: img ? [img] : []
    }
  };
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const p = await getProfile(params.id);

  if (!p) {
    return (
      <main className="container">
        <h1 className="h1">Link non valido</h1>
        <p className="p">Questo profilo non esiste (o è stato rimosso).</p>
        <div className="hr" />
        <Link className="btn" href="/">Torna alla home</Link>
      </main>
    );
  }

  const imgUrl = supabasePublicImageUrl(p.image_path);

  return (
    <main className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="row" style={{ gap: 10 }}>
          <Link className="badge" href="/">profile.reav.space</Link>
          <span className="badge">Template: {p.template_id}</span>
        </div>
        <a className="btn primary" href={imgUrl} download>
          Download PNG
        </a>
      </div>

      <div className="hr" />

      <div className="card" style={{ padding: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt="Profile"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }}
        />
      </div>

      <div className="hr" />
      <p className="small">Condividi questo link: <span className="kbd">{`/p/${p.id}`}</span></p>
    </main>
  );
}
