import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Logs() {
  const { theme } = useContext(ThemeContext);

  return (
    <h1
      className="text-2xl transition-colors duration-300"
      style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      We are on Logs Page
    </h1>
  );
}
