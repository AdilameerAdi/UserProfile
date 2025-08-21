import logo from "../img/logo.png";

export default function Download() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      {/* Title Section (Aligned Left) */}
      <div className="w-full max-w-4xl text-left mb-6">
        <h1 className="text-4xl font-bold mb-2 text-white">Download</h1>
        <p className="text-lg text-gray-300 italic">
          Download the game to start playing!
        </p>
      </div>

      {/* Download Card (Centered) */}
      <div className="bg-gradient-to-br from-[#0F1923] via-[#111E2A] to-[#162334] border border-[#1F2A38] rounded-xl p-10 shadow-lg w-full  text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Olympus Logo"
            className="w-24 mb-4" // Slightly bigger than before
          />
          <h2 className="text-3xl font-extrabold text-white">Download the game</h2>
          <p className="text-gray-400 mt-2">
            Download the game to start playing!
          </p>
        </div>

        {/* Download Button */}
       <a
  href="https://nosdionisy.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
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
        <p className="text-gray-400 text-sm mt-6">
          Need help with installation? Visit our support page or join our Discord
          community for assistance.
        </p>
      </div>
    </div>
  );
}
