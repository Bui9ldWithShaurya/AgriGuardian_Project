import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations } from "@/lib/i18n";

type AppCtx = {
  lang: string;
  setLang: (v: string) => void;
  toggleLang: () => void;
  crop: string;
  setCrop: (v: string) => void;
  t: (key: string) => string;
  phone: string;
  setPhone: (v: string) => void;
  alertsEnabled: boolean;
  setAlertsEnabled: (v: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("en");
  const [crop, setCrop] = useState("tomato");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [phone, setPhoneState] = useState("");
  const [alertsEnabled, setAlertsEnabledState] = useState(false);

  // Read browser storage after hydration to avoid SSR mismatches.
  useEffect(() => {
    setPhoneState(localStorage.getItem("sf_phone") || "");
    setAlertsEnabledState(localStorage.getItem("sf_alerts") === "1");
    const savedTheme = localStorage.getItem("sf_theme") === "dark" ? "dark" : "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setPhone = (v: string) => {
    setPhoneState(v);
    localStorage.setItem("sf_phone", v);
  };
  const setAlertsEnabled = (v: boolean) => {
    setAlertsEnabledState(v);
    localStorage.setItem("sf_alerts", v ? "1" : "0");
  };
  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("sf_theme", next);
      return next;
    });

  const t = (key: string) => translations[lang]?.[key] ?? key;
  const toggleLang = () => setLang((l) => (l === "en" ? "hi" : "en"));

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        crop,
        setCrop,
        t,
        phone,
        setPhone,
        alertsEnabled,
        setAlertsEnabled,
        settingsOpen,
        setSettingsOpen,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
