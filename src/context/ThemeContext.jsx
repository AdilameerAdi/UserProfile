import { createContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
  light: {
    background: "#f8fafc",
    text: "#1f2937",
    subText: "#4b5563",
    cardBg: "#ffffff",
    inputBg: "#ffffff",
    inputBorder: "#d1d5db",
    inputText: "#1f2937",
    primary: "#3b82f6",
    buttonText: "#ffffff",
    activeTabBg: "#3b82f6",
    inactiveTabBg: "#e5e7eb",
    activeTabBorder: "#2563eb",
    inactiveTabBorder: "#d1d5db",
    connectButton: "#10b981",
    disconnectButton: "#ef4444",
    tooltipBg: "#111827",
    tooltipText: "#ffffff",
    dropdownBg: "#1f2937",
    borderColor: "#d1d5db",
  },
  dark: {
    background: "#0f172a",
    text: "#f8fafc",
    subText: "#9ca3af",
    cardBg: "#1f2937",
    inputBg: "#111827",
    inputBorder: "#374151",
    inputText: "#f8fafc",
    primary: "#3b82f6",
    buttonText: "#ffffff",
    activeTabBg: "#3b82f6",
    inactiveTabBg: "#111827",
    activeTabBorder: "#2563eb",
    inactiveTabBorder: "#374151",
    connectButton: "#10b981",
    disconnectButton: "#ef4444",
    tooltipBg: "#111827",
    tooltipText: "#ffffff",
    dropdownBg: "#1f2937",
    borderColor: "#374151",
  },
  purple: {
    background: "#1e1b2f",
    text: "#e0d7f5",
    subText: "#c5b8f5",
    cardBg: "#2d2653",
    inputBg: "#3b2f6b",
    inputBorder: "#5c4d99",
    inputText: "#e0d7f5",
    primary: "#a78bfa",
    buttonText: "#ffffff",
    activeTabBg: "#a78bfa",
    inactiveTabBg: "#3b2f6b",
    activeTabBorder: "#8b5cf6",
    inactiveTabBorder: "#5c4d99",
    connectButton: "#22c55e",
    disconnectButton: "#ef4444",
    tooltipBg: "#2d2653",
    tooltipText: "#e0d7f5",
    dropdownBg: "#2d2653",
    borderColor: "#5c4d99",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes.dark);

  const switchTheme = (name) => {
    setTheme(themes[name]);
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
