"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KImage, Text as KText, Rect, Group } from "react-konva";
import useImage from "@/lib/useImage";
import { layout, ProfileData, Role, STYLE_PRESETS, TextBox } from "@/lib/templateConfig";

type BoxState = TextBox & { id: string };

function platformsToText(p: ProfileData["active_platforms"]) {
  return p.join(", ");
}
function applyCase(s: string, uppercase?: boolean) {
  return uppercase ? s.toUpperCase() : s;
}

function autoFitText({
  text, width, height, fontFamily, maxFont, minFont, multiline, lineHeight
}: {
  text: string; width: number; height: number; fontFamily: string;
  maxFont: number; minFont: number; multiline: boolean; lineHeight: number;
}) {
  const t = (text ?? "").toString().trim();
  if (!t) return maxFont;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return minFont;

  for (let fs = maxFont; fs >= minFont; fs--) {
    ctx.font = `${fs}px ${fontFamily}`;

    if (!multiline) {
      if (ctx.measureText(t).width <= width) return fs;
      continue;
    }

    const words = t.split(/\s+/);
    const lines: string[] = [];
    let line = "";

    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > width) {
        if (line) lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);

    if (lines.length * fs * lineHeight <= height) return fs;
  }

  return minFont;
}

function getTierForRole(data: ProfileData, role: Role) {
  if (role === "Damage") return data.damage_rank;
  if (role === "Tank") return data.tank_rank;
  return data.technical_rank;
}

function StyledText({
  x, y, width, height, text, fontFamily, fontSize, align, lineHeight, wrap, fillColor, innerStroke, outerStroke
}: {
  x: number; y: number; width: number; height: number; text: string; fontFamily: string;
  fontSize: number; align: "left" | "center" | "right"; lineHeight: number; wrap: "none" | "word";
  fillColor: string; innerStroke: string; outerStroke: string;
}) {
  const outerW = Math.max(9, Math.round(fontSize * 0.28));
  const innerW = Math.max(6, Math.round(fontSize * 0.2));

  return (
    <Group listening={false}>
      <KText
        x={x} y={y} width={width} height={height}
        text={text}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontStyle="bold"
        fill={fillColor}
        stroke={outerStroke}
        strokeWidth={outerW}
        strokeLineJoin="round"
        strokeScaleEnabled={false}
        align={align}
        verticalAlign="middle"
        lineHeight={lineHeight}
        wrap={wrap}
        shadowColor="rgba(0,0,0,0.35)"
        shadowBlur={10}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />
      <KText
        x={x} y={y} width={width} height={height}
        text={text}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontStyle="bold"
        fill={fillColor}
        stroke={innerStroke}
        strokeWidth={innerW}
        strokeLineJoin="round"
        strokeScaleEnabled={false}
        align={align}
        verticalAlign="middle"
        lineHeight={lineHeight}
        wrap={wrap}
      />
      <KText
        x={x} y={y} width={width} height={height}
        text={text}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontStyle="bold"
        fill={fillColor}
        align={align}
        verticalAlign="middle"
        lineHeight={lineHeight}
        wrap={wrap}
      />
    </Group>
  );
}

export function EditorCanvas({
  templateSrc,
  value,
  onReady
}: {
  templateSrc: string;
  value: ProfileData;
  onReady?: (api: { exportPng: (pixelRatio?: number) => Promise<Blob> }) => void;
}) {
  const stageRef = useRef<any>(null);
  const [bg] = useImage(templateSrc);

  const [boxes] = useState<BoxState[]>(
    () => layout.boxes.map((b, i) => ({ ...b, id: `${b.key}-${i}` }))
  );

  const canvasW = layout.canvas.width;   // 900
  const canvasH = layout.canvas.height;  // 1200

  // responsive measure
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerW, setContainerW] = useState<number>(canvasW);
  const [containerH, setContainerH] = useState<number>(canvasH);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      // Use bounding rect for reliable values under flex layouts / zoom / device emulation
      const rect = el.getBoundingClientRect();
      const w = Math.max(0, Math.floor(rect.width));
      const h = Math.max(0, Math.floor(rect.height));
      setContainerW(w || canvasW);
      setContainerH(h || canvasH);
    };

    // Initial measure
    measure();

    // ResizeObserver (primary)
    const ro = new ResizeObserver(() => {
      // rAF avoids "0px" intermediate states during layout
      requestAnimationFrame(measure);
    });
    ro.observe(el);

    // Fallback for cases where RO doesn't fire (some mobile/DevTools edge cases)
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [canvasW, canvasH]);


  const scale = Math.min(1, containerW / canvasW, containerH / canvasH);
  const stageW = Math.round(canvasW * scale);
  const stageH = Math.round(canvasH * scale);

  const computedTexts = useMemo(() => {
    return {
      player_name: value.player_name,
      player_code: value.player_code,
      server_region: value.server_region,
      looking_for: value.looking_for,
      active_platforms_text: platformsToText(value.active_platforms)
    } as Record<string, string>;
  }, [value]);

  const preset = STYLE_PRESETS[value.text_style] ?? STYLE_PRESETS.ICE;

  useEffect(() => {
    if (!onReady) return;
    onReady({
      exportPng: async (pixelRatio = 2) => {
        const stage = stageRef.current;
        if (!stage) throw new Error("Stage not ready");
        const dataUrl = stage.toDataURL({ pixelRatio });
        const res = await fetch(dataUrl);
        return await res.blob();
      }
    });
  }, [onReady]);

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 900 }}>Preview</div>
        <span className="badge">{canvasW}×{canvasH}</span>
      </div>

      <div
		  ref={containerRef}
		  style={{
			width: "100%",
			maxWidth: "100%",
			height: "calc(100vh - 180px)",
			maxHeight: "calc(100vh - 180px)",
			overflow: "hidden",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		  }}
		>
        <Stage ref={stageRef} width={stageW} height={stageH} style={{ display: "block" }}>
          <Layer>
            <Group scaleX={scale} scaleY={scale}>
            {bg && <KImage image={bg} x={0} y={0} width={canvasW} height={canvasH} listening={false} />}

            <Group listening={false}>
              {layout.roleSlots.map((s) => {
                const tier = getTierForRole(value, s.role);

                const badgeW = Math.min(86, s.w - 10);
                const badgeH = 46;
                const bx = s.x + (s.w - badgeW) / 2;
                const by = s.y + s.h - badgeH - 20;

                return (
                  <Group key={s.role}>
                    <Rect x={bx} y={by} width={badgeW} height={badgeH} fill="rgba(0,0,0,0.78)" cornerRadius={14} />
                    <KText
                      x={bx} y={by + 7} width={badgeW} height={badgeH}
                      text={tier}
                      align="center"
                      verticalAlign="middle"
                      fontFamily={value.font_family}
                      fontSize={34}
                      fontStyle="bold"
                      fill="white"
                    />
                  </Group>
                );
              })}
            </Group>

            {boxes.map((b) => {
              const raw = computedTexts[b.key] ?? "";
              const text = applyCase(raw, b.uppercase);
              const pad = b.pad ?? 10;

              const innerW = Math.max(10, b.w - pad * 2);
              const innerH = Math.max(10, b.h - pad * 2);

              const fontSize = autoFitText({
                text,
                width: innerW,
                height: innerH,
                fontFamily: value.font_family,
                maxFont: b.maxFont,
                minFont: b.minFont,
                multiline: !!b.multiline,
                lineHeight: b.lineHeight ?? 1.15
              });

              return (
                <StyledText
                  key={b.id}
                  x={b.x + pad}
                  y={b.y + pad}
                  width={innerW}
                  height={innerH}
                  text={text}
                  fontFamily={value.font_family}
                  fontSize={fontSize}
                  align={b.align}
                  lineHeight={b.lineHeight ?? 1.15}
                  wrap={b.multiline ? "word" : "none"}
                  fillColor={preset.fill}
                  innerStroke={preset.inner}
                  outerStroke={preset.outer}
                />
              );
            })}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
