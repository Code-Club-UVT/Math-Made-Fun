import { Link } from "react-router-dom";
import { useLang } from "../langContext.js";
import { CONTENT } from "../content.js";
import styles from "./SiteHeader.module.css";

// The site identity strip, shared by all three pages.
//
// Deliberately a plain component rather than a React Router layout route:
// /sims and /sims/:id are flat siblings by design (CLAUDE.md), and nesting
// them under an <Outlet/> purely to share a header would re-introduce exactly
// the indirection that decision avoids. Each page renders this inside its own
// max-width shell.
//
// `links` is the page-specific nav slot. The landing page fills it with its
// section links; the sim pages leave it empty, since their own breadcrumb
// already expresses where they sit. The language toggle is always present —
// it is the one control that has to be reachable from every page.
export default function SiteHeader({ links = [] }) {
  const { lang, toggleLang } = useLang();
  const t = CONTENT[lang].nav;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">
          ∑
        </span>
        MathMadeFun
      </Link>

      <nav className={styles.nav}>
        {links.map((link) =>
          // In-page anchors stay plain <a>; route changes go through <Link>.
          link.href ? (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ) : (
            <Link key={link.to} to={link.to} className={styles.navLink}>
              {link.label}
            </Link>
          )
        )}

        {/* No aria-label: it would override the visible "EN"/"RO" text with a
            sentence that doesn't contain it, which breaks voice control
            ("click EN") and trips WCAG 2.5.3 Label in Name. The title carries
            the longer explanation as a description instead. */}
        <button
          type="button"
          onClick={toggleLang}
          title={t.langTitle}
          className={styles.langBtn}
        >
          {t.langLabel}
        </button>
      </nav>
    </header>
  );
}
