"use client";

import { FONT_OPTIONS, Platform, ProfileData, ServerRegion, STYLE_PRESETS, TIER_OPTIONS } from "@/lib/templateConfig";

const REGION: ServerRegion[] = ["EU", "NA", "ASIA"];
const PLAT: Platform[] = ["STEAM", "XBOX", "PS", "SWITCH", "IOS", "ANDROID"];

export function ProfileForm({
  value,
  onChange
}: {
  value: ProfileData;
  onChange: (next: ProfileData) => void;
}) {
  const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => onChange({ ...value, [k]: v });

  const togglePlatform = (p: Platform) => {
    const has = value.active_platforms.includes(p);
    set("active_platforms", has ? value.active_platforms.filter((x) => x !== p) : [...value.active_platforms, p]);
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Profile Details</div>
        <span className="badge">Auto-fit enabled</span>
      </div>

      <div className="hr" />

      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
        {/* Player Name */}
        <div>
          <div className="label">Player Name</div>
          <input
            className="input"
            value={value.player_name}
            onChange={(e) => set("player_name", e.target.value)}
            placeholder="e.g. Reav"
          />
        </div>

        {/* Player Code */}
        <div>
          <div className="label">Player Code</div>
          <input
            className="input"
            value={value.player_code}
            onChange={(e) => set("player_code", e.target.value)}
            placeholder="e.g. UKFFQQBYLZG IHTK5"
          />
        </div>

        {/* Role ranks */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div className="label">Damage rank</div>
            <select className="select" value={value.damage_rank} onChange={(e) => set("damage_rank", e.target.value as any)}>
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Tank rank</div>
            <select className="select" value={value.tank_rank} onChange={(e) => set("tank_rank", e.target.value as any)}>
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Technical rank</div>
            <select
              className="select"
              value={value.technical_rank}
              onChange={(e) => set("technical_rank", e.target.value as any)}
            >
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Region + Font */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div className="label">Server Region</div>
            <select className="select" value={value.server_region} onChange={(e) => set("server_region", e.target.value as any)}>
              {REGION.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Font</div>
            <select className="select" value={value.font_family} onChange={(e) => set("font_family", e.target.value)}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text color presets */}
        <div>
          <div className="label">Text Color Style</div>

          <select className="select" value={value.text_style} onChange={(e) => set("text_style", e.target.value as any)}>
            {Object.entries(STYLE_PRESETS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          {/* Small clickable preview chips */}
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {Object.entries(STYLE_PRESETS).map(([k, v]) => {
              const active = value.text_style === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => set("text_style", k as any)}
                  className="btn"
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: active ? "2px solid #fff" : "1px solid #444",
                    background: "#111",
                    minWidth: 44
                  }}
                  title={v.label}
                >
                  <span
                    style={{
                      color: v.fill,
                      fontWeight: 900,
                      fontSize: 12,
                      textShadow: `0 0 0 ${v.inner}, 0 0 0 ${v.outer}`
                    }}
                  >
                    Aa
                  </span>
                </button>
              );
            })}
          </div>

          <div className="small" style={{ marginTop: 6 }}>
            High-contrast presets designed for readability on bright templates.
          </div>
        </div>

        {/* Platforms */}
        <div>
          <div className="label">Active Platform(s)</div>
          <div className="row" style={{ flexWrap: "wrap" }}>
            {PLAT.map((p) => {
              const active = value.active_platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  className={"btn" + (active ? " primary" : "")}
                  onClick={() => togglePlatform(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Looking for */}
        <div>
          <div className="label">Looking for These Players</div>
          <textarea
            className="textarea"
            value={value.looking_for}
            onChange={(e) => set("looking_for", e.target.value)}
            placeholder="e.g. EU ranked teammates, evenings CET"
          />
        </div>

        <div className="small">Set D / C / B / A / S / SS separately for each role.</div>
      </div>
    </div>
  );
}
