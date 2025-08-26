import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import level from "../img/LEVEL.png"
export default function FortuneWheel() {
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrizes, setTotalPrizes] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PRIZES_PER_PAGE = 20;

  const loadPrizes = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    try {
      const from = (page - 1) * PRIZES_PER_PAGE;
      const to = from + PRIZES_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("wheel_rewards")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        const newPrizes = data || [];
        if (append) {
          setPrizes((prev) => [...prev, ...newPrizes]);
        } else {
          setPrizes(newPrizes);
        }
        setTotalPrizes(count || 0);
        setHasMore(newPrizes.length === PRIZES_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading prizes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrizes(1, false);
  }, [loadPrizes]);

  const loadNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPrizes(nextPage, true);
    }
  };

  const spinWheel = () => {
    if (spinsLeft <= 0) {
      alert("No spins left! Please purchase more spins.");
      return;
    }
    if (prizes.length === 0) {
      alert("No rewards configured. Ask admin to add rewards.");
      return;
    }
    setSpinning(true);
    setSpinsLeft((prev) => prev - 1);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const degreesPerPrize = 360 / prizes.length;
    const extraRotation = 6 * 360; // 6 extra spins
    const finalRotation = rotation + extraRotation + randomIndex * degreesPerPrize;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      const pointerAngle = 270; // pointer at top
      const norm = ((finalRotation % 360) + 360) % 360;
      const rel = ((pointerAngle - norm) % 360 + 360) % 360;
      const winningIndex = Math.floor(rel / degreesPerPrize) % prizes.length;
      setSelectedPrize(prizes[winningIndex]);

      if (prizes[winningIndex].name === "1 Free Spin") {
        setSpinsLeft((prev) => prev + 1);
      }
    }, 5000);
  };

  if (loading && prizes.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "#3B82F6" }}></div>
          <p>Loading wheel rewards...</p>
        </div>
      </div>
    );
  }

  return (
   <div
    className="min-h-screen w-full flex flex-col items-center p-6"
    style={{
      backgroundImage: `url(${level})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
      <h1 className="text-3xl font-bold mb-2 text-white">Fortune Wheel</h1>
      <p className="mb-6 text-white">Spin the wheel to win amazing prizes!</p>

      {prizes.length === 0 && (
        <div className="text-center py-12 text-gray-700">
          <div className="text-6xl mb-4">🎡</div>
          <p className="text-lg font-medium mb-2">No rewards available yet</p>
          <p className="text-sm">Wheel rewards will appear here when added by the admin</p>
        </div>
      )}

      <div className="mb-4 text-lg font-semibold">
        Remaining Spins: <span className="text-red-500">{spinsLeft}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Wheel */}
        <div className="relative w-[32rem] h-[32rem]">
          {/* Wheel background */}
          <div className="absolute w-full h-full rounded-full bg-white"></div>

          {/* Rotating wheel */}
         {/* Rotating wheel */}
{/* Rotating wheel */}
<div
  className="absolute w-full h-full rounded-full overflow-hidden"
  style={{
    transform: `rotate(${rotation}deg)`,
    transition: spinning ? "transform 5s ease-out" : "none",
  }}
>
  {(() => {
    const colors = ["#FBBF24", "#3B82F6"];
let sliceColors = [];

for (let i = 0; i < prizes.length; i++) {
  sliceColors.push(colors[i % colors.length]);
}

    return prizes.map((prize, index) => {
      const total = prizes.length;
      const angle = 360 / total;
      const sliceColor = sliceColors[index];

      return (
        <div
          key={prize.id}
          className="absolute w-full h-full origin-center"
          style={{ transform: `rotate(${index * angle}deg)` }}
        >
          {/* Slice background with separation border */}
          <div
            className="absolute w-1/2 h-full top-0 left-1/2 origin-left rounded-tr-full rounded-br-full"
            style={{
              backgroundColor: sliceColor,
              borderLeft: "2px solid #ffffff",
              borderRight: "2px solid #ffffff",
            }}
          ></div>

          {/* Text inside slice */}
          <div
            className="absolute top-1/2 left-1/2 text-center"
            style={{
              transform: `rotate(${angle / 2}deg) translateX(120px) rotate(-${angle / 2}deg)`,
              transformOrigin: "center center",
              fontSize: "0.9rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              color: "#000",
            }}
          >
            {prize.name}
          </div>
        </div>
      );
    });
  })()}
</div>


          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-400 -translate-x-1/2 -translate-y-1/2 z-10"></div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px]"
              style={{
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "red",
              }}
            ></div>
          </div>
        </div>

        {/* Prize List */}
        <div className="p-5 rounded-xl shadow-lg w-64 bg-white">
          <h2 className="text-xl font-bold mb-3 text-black">Possible Prizes</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-gray-800">
            {prizes.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span>{p.icon}</span> {p.name}
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              style={{
                backgroundColor: "#3B82F6",
                color: "#FFFFFF",
                border: "1px solid #3B82F6",
              }}
            >
              {loading ? "Loading..." : "Load More Prizes"}
            </button>
          )}
          {totalPrizes > 0 && (
            <p className="text-xs mt-2 text-center text-gray-500">
              Showing {prizes.length} of {totalPrizes} prizes
            </p>
          )}
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="mt-8 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300"
        style={{
          background: spinning ? "#9CA3AF" : "#10B981",
          color: "#fff",
          cursor: spinning ? "not-allowed" : "pointer",
        }}
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>

      {selectedPrize && !spinning && (
        <div className="mt-6 text-2xl font-semibold text-green-600">
          🎉 You won: {selectedPrize.name} 🎉
        </div>
      )}
    </div>
  );
}
