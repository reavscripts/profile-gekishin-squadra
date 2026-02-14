"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ProfileData } from "@/lib/templateConfig";

const EditorCanvas = dynamic(() => import("@/components/EditorCanvas").then((m) => m.default), {
  ssr: false
});


function makeDefaultProfile(templateId: string): ProfileData {
  // Valori safe (senza dipendere da API esterne). Puoi sostituirli con fetch/supabase quando vuoi.
  return {
    player_name: "PLAYER",
    player_code: "0000-0000",
    server_region: "EU",
    looking_for: "Ranked / Team",
    active_platforms: ["PC"],
    damage_rank: "S",
    tank_rank: "A",
    technical_rank: "B",
    font_family: "Arial",
    text_style: "ICE",
  } as any;
}

export default function EditClient({ templateId }: { templateId: string }) {
  const [debug, setDebug] = useState(false);

  const value = useMemo(() => makeDefaultProfile(templateId), [templateId]);

  // Se i tuoi template stanno altrove, cambia qui:
  // Esempio: `/templates/${templateId}.png` oppure una URL completa
  const templateSrc = useMemo(() => `/templates/${templateId}.png`, [templateId]);

  const onConfigCopy = useCallback((json: string) => {
    navigator.clipboard?.writeText(json).catch(() => {});
    console.log("Config copied:", json);
  }, []);

  const onReady = useCallback((api: { exportPng: (pixelRatio?: number) => Promise<Blob> }) => {
    // Esempio: puoi salvare api in state per un bottone "Export"
    (window as any).__editorApi = api;
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 900 }}>Editing: {templateId}</div>
        <button
          type="button"
          onClick={() => setDebug((v) => !v)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Debug: {debug ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={async () => {
            const api = (window as any).__editorApi;
            if (!api?.exportPng) return alert("Editor not ready");
            const blob = await api.exportPng(2);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${templateId}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Export PNG
        </button>
      </div>

      <EditorCanvas templateSrc={templateSrc} value={value} debug={debug} onConfigCopy={onConfigCopy} onReady={onReady} />
      <p style={{ opacity: 0.7, marginTop: 10, fontSize: 12 }}>
        Nota: templateSrc è impostato su <code>/templates/{templateId}.png</code>. Se i PNG stanno in un altro percorso/URL,
        dimmelo e lo adeguo.
      </p>
    </div>
  );
}
