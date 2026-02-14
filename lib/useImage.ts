"use client";

import { useEffect, useState } from "react";

export default function useImage(src: string): [HTMLImageElement | null, "loading" | "loaded" | "failed"] {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    if (!src) return;
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => {
      setImg(i);
      setStatus("loaded");
    };
    i.onerror = () => setStatus("failed");
    i.src = src;
    return () => {
      // nothing
    };
  }, [src]);

  return [img, status];
}
