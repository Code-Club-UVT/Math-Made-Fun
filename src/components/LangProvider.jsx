import { useCallback, useEffect, useMemo, useState } from "react";
import { LangContext, LANGS, DEFAULT_LANG } from "../langContext.js";

// UI language, shared by every page. Romanian is the primary voice — the
// audience is Romanian gimnaziu/liceu students — so it is the default and the
// fallback whenever a stored value is missing or unrecognised.
//
// State lives here rather than in each page because the toggle has to survive
// navigation: picking English on the landing page and then opening a
// simulation must not drop you back into Romanian. The routes are flat
// siblings by design (see CLAUDE.md), so a provider at the router root is
// what carries the choice across them.

const STORAGE_KEY = "mmf-lang";

// localStorage throws in private-mode Safari and when storage is disabled;
// a language toggle is not worth taking the page down for.
function readStoredLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(saved) ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export default function LangProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Preference just won't persist across reloads — the session still works.
    }
    // Keeps the document in sync for screen readers, and for the hyphenation
    // and quotation rules browsers apply per language.
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(
    () => setLang((current) => (current === "ro" ? "en" : "ro")),
    []
  );

  // Memoised so the provider doesn't hand every consumer a new object each
  // time an ancestor re-renders.
  const value = useMemo(() => ({ lang, toggleLang }), [lang, toggleLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
