"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/app/home.module.css";

type TemplateItem = {
  id: string;
  name: string;
  src: string;
};

export default function TemplatesBrowser({ templates }: { templates: TemplateItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return templates;

    return templates.filter((t) => {
      const hay = `${t.name} ${t.id}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, templates]);

  return (
    <>
      {/* Search bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search characters…"
            className={styles.searchInput}
            aria-label="Search templates"
          />
          {q ? (
            <button className={styles.searchClear} onClick={() => setQ("")} aria-label="Clear search">
              ✕
            </button>
          ) : null}
        </div>

        <div className={styles.searchMeta}>
          {filtered.length} / {templates.length}
        </div>
      </div>

      {/* Grid */}
      <section className={styles.grid}>
        {filtered.map((t) => (
          <Link key={t.id} className={`card ${styles.card}`} href={`/edit/${encodeURIComponent(t.id)}`}>
            <div className={styles.cardTop}>
              <div className={styles.name}>{t.name}</div>
              <div className="badge">EDIT</div>
            </div>

            <div className={styles.thumbWrap}>
              <img className={styles.thumb} src={t.src} alt={t.name} loading="lazy" />
            </div>
          </Link>
        ))}

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            No results for <span className={styles.emptyQuery}>&quot;{q}&quot;</span>
          </div>
        ) : null}
      </section>
    </>
  );
}
