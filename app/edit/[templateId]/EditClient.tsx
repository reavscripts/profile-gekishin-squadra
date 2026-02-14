"use client";

import dynamic from "next/dynamic";
import type { ProfileData } from "@/lib/templateConfig";

// components/EditorCanvas exports a named component `EditorCanvas` (not default)
const EditorCanvas = dynamic(
  () => import("@/components/EditorCanvas").then((m) => m.EditorCanvas),
  { ssr: false }
);

function makeDefaultProfile(): ProfileData {
  return {
    player_name: "Player Name",
    player_code: "0000-0000",

    damage_rank: "S",
    tank_rank: "S",
    technical_rank: "S",

    server_region: "EU",
    active_platforms: ["STEAM"],

    looking_for: "Squad / Duo",

    font_family: "Inter",
    text_style: "ICE"
  };
}

export default function EditClient({ templateId }: { templateId: string }) {
  const value = makeDefaultProfile();

  // Local fallback: templates are served from /public/templates/<templateId>.png
  const templateSrc = `/templates/${encodeURIComponent(templateId)}.png`;
 

  return <EditorCanvas templateSrc={templateSrc} value={value} />;
}
