"use client";

import dynamic from "next/dynamic";
import type { ProfileData } from "@/lib/templateConfig";

// NOTE: components/EditorCanvas exports a named component `EditorCanvas` (not default)
const EditorCanvas = dynamic(
  () => import("@/components/EditorCanvas").then((m) => m.EditorCanvas),
  { ssr: false }
);

function makeDefaultProfile(templateId: string): ProfileData {
  // Valori safe (senza dipendere da API esterne). Puoi sostituirli con fetch/supabase quando vuoi.
  return {
    template_id: templateId,
    active_platforms: ["PC"],
    player_name: "Player Name",
    player_code: "0000-0000",
    damage_rank: "S",
    server_region: "EU",
    role: "DPS",
    // campi opzionali / extra (se presenti nel tuo tipo, verranno ignorati se non usati)
  } as ProfileData;
}

export default function EditClient({ templateId }: { templateId: string }) {
  const defaultProfile = makeDefaultProfile(templateId);

  return (
    <EditorCanvas
      templateId={templateId}
      defaultProfile={defaultProfile}
    />
  );
}
