import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { listTemplatesFromFilenames } from "@/lib/templates";
import styles from "./home.module.css";

export default function HomePage() {
  const dir = path.join(process.cwd(), "public", "templates");
  const files = fs.readdirSync(dir);
  const templates = listTemplatesFromFilenames(files);

  return (
    <main className="container">
      <header className={styles.header}>
        <div>
          <h1 className="h1">Choose a Template</h1>
          <p className="p">Pick a character, fill your details, then export or share.</p>
        </div>
      </header>

      <section className={styles.grid}>
        {templates.map((t) => (
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
      </section>
    </main>
  );
}
