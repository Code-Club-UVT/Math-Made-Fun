import { createContext, useContext } from "react";

// The context object and its reader hook, kept apart from the provider
// component in components/LangProvider.jsx. Splitting them is what keeps Vite
// fast refresh working: a module that exports both a component and plain
// functions can't be hot-replaced, so editing it would full-reload the app.

export const LangContext = createContext(null);

export const LANGS = ["ro", "en"];
export const DEFAULT_LANG = "ro";

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
