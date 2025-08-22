import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Make sure ThemeContext exists

export default function Coupons() {
  const { theme } = useContext(ThemeContext);

  return (
    <h1
      className="text-2xl transition-colors duration-300"
      style={{
        color: theme.textColor, // dynamic text color
        fontFamily: theme.fontFamily, // dynamic font
      }}
    >
      We are on Coupons Page
    </h1>
  );
}
