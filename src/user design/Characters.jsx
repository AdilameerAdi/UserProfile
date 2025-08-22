import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // We'll create this context

export default function Characters() {
  const { theme } = useContext(ThemeContext);

  return (
    <h1
      className="text-2xl transition-colors duration-300"
      style={{
        color: theme.textColor, // dynamic text color
        fontFamily: theme.fontFamily, // dynamic font
      }}
    >
      We are on Characters Page
    </h1>
  );
}
