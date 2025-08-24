import { useContext } from "react";
import { FaDiscord } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function Support() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center px-6"
      style={{
        fontFamily: theme.fontFamily, // dynamic font
      }}
    >
      {/* Title Section (Aligned Left) */}
      <div className="w-full max-w-4xl text-left mb-6">
        <h1
          className="text-4xl font-bold mb-2 transition-colors duration-300"
          style={{ color: theme.titleColor }}
        >
          Support
        </h1>
        <p
          className="text-lg italic transition-colors duration-300"
          style={{ color: theme.textColor }}
        >
          Get support for the game and join our community!
        </p>
      </div>

      {/* Support Card (Centered) */}
      <div
        className="border rounded-xl p-10 shadow-lg w-full max-w-xl text-center transition-colors duration-300"
        style={{
          background: theme.cardBg,      // dynamic background gradient
          borderColor: theme.cardBorder, // dynamic border color
        }}
      >
        {/* Discord Icon */}
        <div className="flex flex-col items-center mb-6">
          <FaDiscord className="text-blue-500 text-6xl mb-4" />
          <h2
            className="text-3xl font-extrabold transition-colors duration-300"
            style={{ color: theme.titleColor }}
          >
            Join Our Discord
          </h2>
          <p
            className="mt-2 transition-colors duration-300"
            style={{ color: theme.textColor }}
          >
            Get help, report issues, and chat with the community and developers.
          </p>
        </div>

        {/* Join Discord Button */}
        <a
          href="https://discord.gg/nosdionisy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          style={{
            backgroundColor: "purple",
            color: theme.buttonText,
          }}
        >
          <FaDiscord className="w-6 h-6 mr-2" />
          Join Our Discord
        </a>

        {/* Help Text */}
        <p
          className="text-sm mt-6 transition-colors duration-300"
          style={{ color: theme.textColor }}
        >
          Our Discord community is the best place to get real-time help, tips, and updates about the game.
        </p>
      </div>
    </div>
  );
}
