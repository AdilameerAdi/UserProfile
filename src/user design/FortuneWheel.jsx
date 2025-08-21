import { useState } from "react";
import { FaCoins } from "react-icons/fa";

export default function FortuneWheel() {
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);

  const prizes = [
    { id: 1, name: "50 Coins", icon: <FaCoins />, color: "bg-yellow-500" },
    { id: 2, name: "100 Coins", icon: <FaCoins />, color: "bg-orange-500" },
    { id: 3, name: "200 Coins", icon: <FaCoins />, color: "bg-red-500" },
    { id: 4, name: "1 Free Spin", icon: "🔄", color: "bg-green-500" },
    { id: 5, name: "Small Gem Pack", icon: "💎", color: "bg-blue-500" },
    { id: 6, name: "Epic Chest", icon: "🎁", color: "bg-purple-500" },
    { id: 7, name: "Mega Pack", icon: "💰", color: "bg-pink-500" },
    { id: 8, name: "Lucky Charm", icon: "🍀", color: "bg-teal-500" },
    { id: 9, name: "Super Boost", icon: "⚡", color: "bg-indigo-500" },
    { id: 10, name: "Mystery Box", icon: "❓", color: "bg-gray-500" },
  ];

  const spinWheel = () => {
    if (spinsLeft <= 0) {
      alert("No spins left! Please purchase more spins.");
      return;
    }

    setSpinning(true);
    setSpinsLeft(spinsLeft - 1);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const degreesPerPrize = 360 / prizes.length;

    const extraRotation = 6 * 360; // extra spins before stop
    const finalRotation =
  rotation + extraRotation + randomIndex * degreesPerPrize;
 setRotation(finalRotation);
   setTimeout(() => {
  setSpinning(false);

  // Compute winning slice based on final wheel angle & pointer at 12 o'clock
  const pointerAngle = 270; // top-center
  const norm = ((finalRotation % 360) + 360) % 360; // 0..359
  const rel = ((pointerAngle - norm) % 360 + 360) % 360; // angle under pointer
  const winningIndex = Math.floor(rel / degreesPerPrize) % prizes.length;

  setSelectedPrize(prizes[winningIndex]);

  if (prizes[winningIndex].name === "1 Free Spin") {
    setSpinsLeft((prev) => prev + 1);
  }
}, 5000);
  }

  return (
    <div className="p-6 flex flex-col items-center text-gray-100">
      <h1 className="text-3xl font-bold mb-2">Fortune Wheel</h1>
      <p className="text-gray-400 mb-6">Spin the wheel to win amazing prizes!</p>

      {/* Remaining Spins */}
      <div className="mb-4 text-lg font-semibold">
        Remaining Spins: <span className="text-yellow-400">{spinsLeft}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Wheel Container */}
        <div className="relative w-[32rem] h-[32rem]">
          {/* Spinning Wheel */}
          <div
            className="absolute w-full h-full rounded-full border-8 border-gray-700 transition-transform duration-[5s] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={prize.id}
                  className={`absolute w-full h-full flex items-center justify-center font-bold text-white ${prize.color} rounded-full`}
                  style={{
                    clipPath: `polygon(50% 50%, 
                      ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% 
                      ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, 
                      ${50 + 50 * Math.cos(((angle + 360 / prizes.length) * Math.PI) / 180)}% 
                      ${50 + 50 * Math.sin(((angle + 360 / prizes.length) * Math.PI) / 180)}%)`,
                  }}
                >
                  <div
                    className="absolute text-center"
                    style={{
                      transform: `rotate(${angle + 360 / prizes.length / 2}deg) translate(9rem) rotate(90deg)`,
                    }}
                  >
                    <div className="text-xl">{prize.icon}</div>
                    <div className="text-xs">{prize.name}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pointer (pointing inside wheel) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500"></div>
          </div>
        </div>

        {/* Prize List */}
        <div className="bg-gray-800 p-5 rounded-xl w-64 shadow-lg">
          <h2 className="text-xl font-bold mb-3">Possible Prizes</h2>
          <ul className="space-y-2">
            {prizes.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span>{p.icon}</span> {p.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`mt-8 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300
          ${
            spinning
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
          }`}
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>

      {/* Result */}
      {selectedPrize && !spinning && (
        <div className="mt-6 text-2xl font-semibold text-green-400">
          🎉 You won: {selectedPrize.name} 🎉
        </div>
      )}
    </div>
  );
}
