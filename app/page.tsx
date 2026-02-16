import fs from "node:fs";
import path from "node:path";
import { listTemplatesFromFilenames } from "@/lib/templates";
import styles from "./home.module.css";
import FooterPanel from "@/components/FooterPanel";
import TemplatesBrowser from "@/components/TemplatesBrowser";

export default function Page() {
  const dir = path.join(process.cwd(), "public", "templates");
  const files = fs.readdirSync(dir);
  const templates = listTemplatesFromFilenames(files);

  return (
    <div className={styles.wallpaper}>
      <main className={`container ${styles.content}`}>
        {/* ===== HERO ===== */}
        <header className={styles.header}>
          <div className={styles.heroTop}>
            <div className={styles.logoWrap}>
              <img
                src="/images/effects_play.svg"
                alt=""
                aria-hidden="true"
                className={styles.logoFx}
              />

              <img
                src="/images/logo.png"
                alt="Dragon Ball Gekishin Squadra"
                className={styles.logo}
              />

              <div className={styles.logoGlow} />
            </div>

            <h1 className={styles.title}>Choose Your Fighter</h1>
            <p className={styles.subtitle}>
              Select a character, customize your profile, and export your squad card.
            </p>
          </div>
        </header>

        {/* ===== SEARCH + GRID PIÙ LARGA SU DESKTOP ===== */}
        <div className={styles.gridWide}>
          <TemplatesBrowser templates={templates} />
        </div>

        {/* ===== FOOTER INTEGRATO NEL CONTAINER ===== */}
        <FooterPanel />
      </main>
    </div>
  );
}
