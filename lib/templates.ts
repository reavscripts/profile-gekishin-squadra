export type Template = {
  id: string;
  name: string;
  src: string;
};

function prettifyName(file: string) {
  // DBGS__Profile_SuperVegito_EN.png -> Super Vegito
  return file
    .replace(/^DBGS__Profile_/, "")
    .replace(/_EN\.png$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function listTemplatesFromFilenames(files: string[]): Template[] {
  return files
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => {
      const id = f.replace(/\.png$/i, "");
      return {
        id,
        name: prettifyName(f),
        src: `/templates/${f}`
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
