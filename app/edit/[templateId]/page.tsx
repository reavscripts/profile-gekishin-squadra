import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import EditorClient from "./ui";

function prettifyName(id: string) {
  return id
    .replace(/^DBGS__Profile_/, "")
    .replace(/_EN$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Page({ params }: { params: { templateId: string } }) {
  const templateId = decodeURIComponent(params.templateId);

  const dir = path.join(process.cwd(), "public", "templates");
  const filename = `${templateId}.png`;
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) notFound();

  return (
    <EditorClient
      templateId={templateId}
      templateName={prettifyName(templateId)}
      templateSrc={`/templates/${filename}`}
    />
  );
}
