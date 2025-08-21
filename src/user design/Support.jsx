import { FaDiscord } from "react-icons/fa"; // Install with: npm install react-icons

export default function Support() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      {/* Title Section (Aligned Left) */}
      <div className="w-full max-w-4xl text-left mb-6">
        <h1 className="text-4xl font-bold mb-2 text-white">Support</h1>
        <p className="text-lg text-gray-300 italic">
          Get support for the game and join our community!
        </p>
      </div>

      {/* Support Card (Centered) */}
      <div className="bg-gradient-to-br from-[#1A2333] via-[#1F2B3D] to-[#243247] border border-[#2E3A4D] rounded-xl p-10 shadow-lg w-full max-w-xl text-center">
        {/* Discord Icon */}
        <div className="flex flex-col items-center mb-6">
          <FaDiscord className="text-blue-500 text-6xl mb-4" />
          <h2 className="text-3xl font-extrabold text-white">Join Our Discord</h2>
          <p className="text-gray-400 mt-2">
            Get help, report issues, and chat with the community and developers.
          </p>
        </div>

        {/* Join Discord Button */}
        <a
          href="https://discord.gg/nosdionisy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          <FaDiscord className="w-6 h-6 mr-2" />
          Join Our Discord
        </a>

        {/* Help Text */}
        <p className="text-gray-400 text-sm mt-6">
          Our Discord community is the best place to get real-time help, tips, and updates about the game.
        </p>
      </div>
    </div>
  );
}
