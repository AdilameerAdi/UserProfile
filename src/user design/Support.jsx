import { useContext } from "react";
import { FaDiscord } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import support from "../img/help.png";

export default function Support() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full px-6"
      style={{
        fontFamily: theme.fontFamily,
        backgroundImage: `url(${support})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Support Card (Centered) */}
      <div
        className="border rounded-xl p-10 shadow-lg w-full max-w-xl text-center backdrop-blur-md"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // dark transparent card for better contrast
          borderColor: theme.cardBorder,
        }}
      >
        {/* Discord Icon */}
        <div className="flex flex-col items-center mb-6">
          <FaDiscord className="text-blue-400 text-7xl mb-4" />
          <h2
            className="text-4xl font-extrabold text-white text-shadow-lg mb-2"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            Join Our Discord
          </h2>
          <p
            className="mt-2 text-lg text-white text-shadow-md"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
          >
            Get help, report issues, and chat with the community and developers.
          </p>
        </div>

        {/* Join Discord Button */}
        <a
          href="https://discord.gg/nosdionisy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-semibold px-6 py-4 rounded-lg shadow-md transition duration-300 text-lg"
          style={{
            backgroundColor: "purple",
            color: "#fff",
          }}
        >
          <FaDiscord className="w-6 h-6 mr-2" />
          Join Our Discord
        </a>

        {/* Help Text */}
        <p
          className="text-base mt-6 text-white text-shadow-sm"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
        >
          Our Discord community is the best place to get real-time help, tips, and updates about the game.
        </p>
      </div>
    </div>
  );
}
