"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProfileForm } from "@/components/ProfileForm";
import type { ProfileData } from "@/lib/templateConfig";

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

    try {
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
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e?.message ?? "export failed"}`);
    }
  };

  const share = async () => {
    if (!exporter) return;
    setStatus("Creating share link…");

    try {
      const blob = await exporter.exportPng(2);

      // dataURL for JSON payload
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

      const link = json.url as string;
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
            <Link className="badge" href="/">
              ← Home
            </Link>
            <span className="badge">{templateName}</span>
          </div>

          <h1 className="h1">Profile Editor</h1>
          <p className="p">Fill in your details, then download or generate a share link.</p>
        </div>

        <div className="actions">
          <button className="btn" onClick={download} type="button">
            Download PNG
          </button>
          <button className="btn primary" onClick={share} type="button">
            Share Link
          </button>
        </div>
      </header>

      {status && (
        <div className="card statusCard">
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
        <div className="canvasWrap card">
          <EditorCanvas templateSrc={templateSrc} value={data} onReady={setExporter} />
        </div>

        <div className="formWrap card">
          <ProfileForm value={data} onChange={setData} />
        </div>
      </section>

      <style jsx>{`
        :global(html, body) {
          max-width: 100%;
          overflow-x: hidden;
        }

        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 16px;
          box-sizing: border-box;
        }

        .top {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rowBadges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .p {
          margin: 8px 0 0;
          opacity: 0.8;
          font-size: 14px;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 640px) {
          .top {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .actions {
            grid-template-columns: auto auto;
            justify-content: end;
          }
        }

        .btn {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: inherit;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          min-height: 44px;
          width: 100%;
        }

        @media (min-width: 640px) {
          .btn {
            width: auto;
          }
        }

        .btn:hover {
          background: rgba(255, 255, 255, 0.09);
        }

        .btn.primary {
          border-color: rgba(120, 140, 255, 0.35);
          background: linear-gradient(
            90deg,
            rgba(80, 180, 255, 0.22),
            rgba(140, 110, 255, 0.22)
          );
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          text-decoration: none;
          color: inherit;
          font-weight: 700;
          font-size: 12px;
          line-height: 1;
        }

        .hr {
          height: 1px;
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          margin: 14px 0;
        }

        .card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 14, 22, 0.45);
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .statusCard {
          padding: 12px;
          margin-top: 12px;
        }

        .rowStatus {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .editorGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          align-items: start;
        }

        /* CRITICAL: allow grid children to shrink (prevents spill outside viewport) */
        .canvasWrap,
        .formWrap {
          min-width: 0;
        }

        .formWrap {
          padding: 12px;
        }

        /* Konva: ONLY force width to fit container. Do NOT touch height. */
        .canvasWrap :global(.konvajs-content) {
          width: 100% !important;
          max-width: 100% !important;
        }
        .canvasWrap :global(canvas) {
          display: block;
          width: 100% !important;
          max-width: 100% !important;
        }

        @media (min-width: 980px) {
          .editorGrid {
            grid-template-columns: minmax(320px, 420px) 1fr;
            gap: 14px;
          }
          .canvasWrap {
            order: 2;
          }
          .formWrap {
            order: 1;
          }
        }
      `}</style>
    </main>
  );
}
