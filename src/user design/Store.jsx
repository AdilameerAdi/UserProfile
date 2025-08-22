import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import your theme context

export default function Store() {
  const { theme } = useContext(ThemeContext);

  return (
    <h1
      className="text-2xl transition-colors duration-300"
      style={{
        color: theme.textColor,     // dynamic text color from theme
        fontFamily: theme.fontFamily, // dynamic font from theme
      }}
    >
      We are on Store Page
    </h1>
  );
}
