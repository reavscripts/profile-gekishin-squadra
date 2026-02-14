export type ServerRegion = "EU" | "NA" | "ASIA";
export type Platform = "STEAM" | "XBOX" | "PS" | "SWITCH" | "IOS" | "ANDROID";
export type Role = "Damage" | "Tank" | "Technical";
export type Tier = "D" | "C" | "B" | "A" | "S" | "SS";

export type TextStylePreset = "ICE" | "ROYAL" | "NEON" | "SUNSET";

export const STYLE_PRESETS: Record<TextStylePreset, { label: string; fill: string; inner: string; outer: string }> = {
  ICE: { label: "Ice (white/cyan/blue)", fill: "#FFFFFF", inner: "#0B2A7A", outer: "#56E6FF" },
  ROYAL: { label: "Royal (white/gold/navy)", fill: "#FFFFFF", inner: "#0A1C4F", outer: "#FFD34D" },
  NEON: { label: "Neon (white/purple/cyan)", fill: "#FFFFFF", inner: "#5B21B6", outer: "#22D3EE" },
  SUNSET: { label: "Sunset (white/red/yellow)", fill: "#FFFFFF", inner: "#B91C1C", outer: "#FBBF24" }
};

export type ProfileData = {
  player_name: string;
  player_code: string;

  // Rank per ruolo
  damage_rank: Tier;
  tank_rank: Tier;
  technical_rank: Tier;

  server_region: ServerRegion;
  active_platforms: Platform[];
  looking_for: string;

  font_family: string;
  text_style: TextStylePreset;
};

export type TextBox = {
  key: keyof Pick<ProfileData, "player_name" | "player_code" | "server_region" | "looking_for"> | "active_platforms_text";
  x: number;
  y: number;
  w: number;
  h: number;
  maxFont: number;
  minFont: number;
  align: "left" | "center" | "right";
  lineHeight?: number;
  uppercase?: boolean;
  multiline?: boolean;

  // padding interno per non coprire i bordi
  pad?: number;
};

export type RoleSlot = { role: Role; x: number; y: number; w: number; h: number };

export type TemplateLayout = {
  canvas: { width: number; height: number };
  boxes: TextBox[];
  roleSlots: RoleSlot[];
};

/**
 * Coordinate reali (dal tuo JSON)
 * Canvas: 900x1200
 */
export const layout: TemplateLayout = {
  canvas: { width: 900, height: 1200 },
  boxes: [
    {
      key: "player_name",
      x: 219.86865480572615,
      y: 215.1392428331958,
      w: 627.2626903885464,
      h: 89.721514333608,
      maxFont: 52,
      minFont: 18,
      align: "left",
      pad: 10
    },
    {
      key: "player_code",
      x: 218.8771084001268,
      y: 352.2680260994521,
      w: 625.2457831997456,
      h: 94.46394780109533,
      maxFont: 52,
      minFont: 18,
      align: "left",
      pad: 10
    },
    {
      key: "server_region",
      x: 619.4838663919148,
      y: 720.8960399282249,
      w: 156.0322672161692,
      h: 75.20792014355034,
      maxFont: 44,
      minFont: 18,
      align: "left",
      pad: 10
    },
    {
      key: "active_platforms_text",
      x: 437.525104869339,
      y: 888.8219161782856,
      w: 414.9497902613203,
      h: 69.35616764342919,
      maxFont: 34,
      minFont: 14,
      align: "left",
      pad: 10
    },
    {
      key: "looking_for",
      x: 433.23040921273,
      y: 1047.326165184059,
      w: 416.5391815745397,
      h: 74.34766963188297,
      maxFont: 30,
      minFont: 12,
      align: "left",
      multiline: true,
      lineHeight: 1.2,
      pad: 10
    }
  ],
  roleSlots: [
    { role: "Damage", x: 150, y: 530, w: 120, h: 90 },
    { role: "Tank", x: 430, y: 530, w: 120, h: 90 },
    { role: "Technical", x: 710, y: 530, w: 120, h: 90 }
  ]
};

export const FONT_OPTIONS = [
  { label: "System (clean)", value: "system-ui" },
  { label: "Arial (safe)", value: "Arial" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Impact (bold)", value: "Impact" },
  { label: "Verdana", value: "Verdana" }
];

export const ROLE_ORDER: Role[] = ["Damage", "Tank", "Technical"];
export const TIER_OPTIONS: Tier[] = ["D", "C", "B", "A", "S", "SS"];
