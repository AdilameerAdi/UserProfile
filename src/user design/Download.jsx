import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../img/logo.png";

export default function Download() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center px-6 transition-colors duration-300"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Title Section (Aligned Left) */}
      <div className="w-full max-w-4xl text-left mb-6">
        <h1
          className="text-4xl font-bold mb-2 transition-colors duration-300"
          style={{ color: theme.titleColor }}
        >
          Download
        </h1>
        <p
          className="text-lg italic transition-colors duration-300"
          style={{ color: theme.subTextColor }}
        >
          Download the game to start playing!
        </p>
      </div>

      {/* Download Card (Centered) */}
      <div
        className="border rounded-xl p-10 shadow-lg w-full text-center transition-colors duration-300"
        style={{
          background: theme.cardBackground, // dynamic card gradient or color
          borderColor: theme.cardBorderColor,
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Olympus Logo" className="w-24 mb-4" />
          <h2
            className="text-3xl font-extrabold transition-colors duration-300"
            style={{ color: theme.titleColor }}
          >
            Download the game
          </h2>
          <p
            className="mt-2 transition-colors duration-300"
            style={{ color: theme.subTextColor }}
          >
            Download the game to start playing!
          </p>
        </div>

        {/* Download Button */}
        <a
          href="https://nosdionisy.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          Download Latest Version
        </a>

        {/* Help Text */}
        <p
          className="text-sm mt-6 transition-colors duration-300"
          style={{ color: theme.subTextColor }}
        >
          Need help with installation? Visit our support page or join our Discord
          community for assistance.
        </p>
      </div>
    </div>
  );
}
