"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProfileForm } from "@/components/ProfileForm";
import type { ProfileData } from "@/lib/templateConfig";
import { supabaseClient } from "@/lib/supabase";

const EditorCanvas = dynamic(
  () => import("@/components/EditorCanvas").then((m) => m.EditorCanvas),
  { ssr: false }
);

function slugDate() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, "-");
}

export default function EditorClient({
  templateId,
  templateName,
  templateSrc
}: {
  templateId: string;
  templateName: string;
  templateSrc: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [data, setData] = useState<ProfileData>({
    player_name: "",
    player_code: "",
    damage_rank: "D",
    tank_rank: "D",
    technical_rank: "D",
    server_region: "EU",
    active_platforms: ["STEAM"],
    looking_for: "",
    font_family: "system-ui",
    text_style: "ICE"
  });

  const [exporter, setExporter] =
    useState<{ exportPng: (pixelRatio?: number) => Promise<Blob> } | null>(null);

  const download = async () => {
    if (!exporter) return;
    setStatus("Exporting PNG…");
    const blob = await exporter.exportPng(2);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateId}-${slugDate()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    setStatus(null);
  };

  const share = async () => {
    if (!exporter) return;
    setStatus("Creating share link…");

    try {
	  const blob = await exporter.exportPng(2);

	  // convertiamo in dataURL perché l’API route riceve JSON
	  const arrayBuffer = await blob.arrayBuffer();
	  const base64 = btoa(
		new Uint8Array(arrayBuffer).reduce((acc, b) => acc + String.fromCharCode(b), "")
	  );
	  const dataUrl = `data:image/png;base64,${base64}`;

	  const res = await fetch("/api/share", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ dataUrl, templateId })
	  });

	  const json = await res.json();
	  if (!res.ok) throw new Error(json.error || "Share failed");

	  const link = json.url;

	  await navigator.clipboard.writeText(link);

	  setCopied(link);
	  setStatus("Link copied ✅");
	  setTimeout(() => setStatus(null), 2000);
	} catch (e: any) {
	  console.error(e);
	  setStatus(`Error: ${e?.message ?? "could not create link"}`);
	}
  };


  return (
    <main className="container">
      <header className="top">
        <div className="titleBlock">
          <div className="rowBadges">
            <Link className="badge" href="/">← Home</Link>
            <span className="badge">{templateName}</span>
          </div>

          <h1 className="h1">Profile Editor</h1>
          <p className="p">Fill in your details, then download or generate a share link.</p>
        </div>

        <div className="actions">
          <button className="btn" onClick={download} type="button">Download PNG</button>
          <button className="btn primary" onClick={share} type="button">Share Link</button>
        </div>
      </header>

      {status && (
        <div className="card" style={{ padding: 12, marginTop: 12 }}>
          <div className="rowStatus">
            <div>{status}</div>
            {copied && (
              <a className="badge" href={copied} target="_blank" rel="noreferrer">
                Open
              </a>
            )}
          </div>
        </div>
      )}

      <div className="hr" />

      <section className="editorGrid">
        {/* canvas first on mobile */}
        <div className="canvasWrap">
          <EditorCanvas templateSrc={templateSrc} value={data} onReady={setExporter} />
        </div>

        <div className="formWrap">
          <ProfileForm value={data} onChange={setData} />
        </div>
      </section>

      <style jsx>{`
        .top { display: flex; flex-direction: column; gap: 12px; }
        .rowBadges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
        .actions { display: grid; showing: block; grid-template-columns: 1fr; gap: 10px; }

        @media (min-width: 640px) {
          .top { flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 16px; }
          .actions { grid-template-columns: auto auto; }
        }

        .rowStatus { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }

        .editorGrid { display: grid; grid-template-columns: 1fr; gap: 12px; align-items: start; }
        @media (min-width: 980px) {
          .editorGrid { grid-template-columns: minmax(320px, 420px) 1fr; gap: 14px; }
          .canvasWrap { order: 2; }
          .formWrap { order: 1; }
        }
      `}</style>
    </main>
  );
}