import { useState, useContext, useEffect, useCallback } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";

export default function FortuneWheel() {
  const { theme } = useContext(ThemeContext);

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

  // Load wheel rewards with pagination
  const loadPrizes = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    
    try {
      const from = (page - 1) * PRIZES_PER_PAGE;
      const to = from + PRIZES_PER_PAGE - 1;
      
      // Get wheel rewards with pagination
      const { data, error, count } = await supabase
        .from('wheel_rewards')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });
      
      if (error) {
        console.error('[FortuneWheel] Supabase error:', error);
      } else {
        const newPrizes = data || [];
        
        if (append) {
          setPrizes(prev => [...prev, ...newPrizes]);
        } else {
          setPrizes(newPrizes);
        }
        
        setTotalPrizes(count || 0);
        setHasMore(newPrizes.length === PRIZES_PER_PAGE);
      }
    } catch (error) {
      console.error('[FortuneWheel] Error loading prizes:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load first page on mount
  useEffect(() => {
    loadPrizes(1, false);
  }, [loadPrizes]);
  
  // Load next page
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
    setSpinsLeft(spinsLeft - 1);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const degreesPerPrize = 360 / prizes.length;

    const extraRotation = 6 * 360; // extra spins before stop
    const finalRotation = rotation + extraRotation + randomIndex * degreesPerPrize;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);

      const pointerAngle = 270; // top-center
      const norm = ((finalRotation % 360) + 360) % 360;
      const rel = ((pointerAngle - norm) % 360 + 360) % 360;
      const winningIndex = Math.floor(rel / degreesPerPrize) % prizes.length;

      setSelectedPrize(prizes[winningIndex]);

      if (prizes[winningIndex].name === "1 Free Spin") {
        setSpinsLeft((prev) => prev + 1);
      }
    }, 5000);
  };

  // Only show loading if we have no prizes AND loading is true
  if (loading && prizes.length === 0) {
    return (
      <div
        className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center h-64"
        style={{ fontFamily: theme.fontFamily, color: theme.textColor }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: theme.primary }}
          ></div>
          <p>Loading wheel rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 flex flex-col items-center transition-colors duration-300"
      style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      <h1 className="text-3xl font-bold mb-2" style={{ color: theme.titleColor }}>
        Fortune Wheel
      </h1>
      <p className="mb-6" style={{ color: theme.subTextColor }}>
        Spin the wheel to win amazing prizes!
      </p>

      {prizes.length === 0 && (
        <div className="text-center py-12" style={{ color: theme.subTextColor }}>
          <div className="text-6xl mb-4">🎡</div>
          <p className="text-lg font-medium mb-2">No rewards available yet</p>
          <p className="text-sm">Wheel rewards will appear here when added by the admin</p>
        </div>
      )}

      {/* Remaining Spins */}
      <div className="mb-4 text-lg font-semibold">
        Remaining Spins: {" "}
        <span style={{ color: theme.highlightColor }}>{spinsLeft}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Wheel Container */}
        <div className="relative w-[32rem] h-[32rem]">
          <div
            className="absolute w-full h-full rounded-full border-8 transition-transform duration-[5s] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              borderColor: theme.cardBorderColor,
              backgroundColor: theme.cardBackground,
            }}
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

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px]"
              style={{
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: theme.pointerColor,
              }}
            ></div>
          </div>
        </div>

        {/* Prize List */}
        <div
          className="p-5 rounded-xl shadow-lg w-64"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: theme.titleColor }}>
            Possible Prizes
          </h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto" style={{ color: theme.textColor }}>
            {prizes.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span>{p.icon}</span> {p.name}
              </li>
            ))}
          </ul>
          
          {/* Pagination for Prize List */}
          {hasMore && (
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              style={{
                backgroundColor: theme.primary || '#3B82F6',
                color: theme.activeText || '#FFFFFF',
                border: `1px solid ${theme.primary || '#3B82F6'}`
              }}
            >
              {loading ? 'Loading...' : 'Load More Prizes'}
            </button>
          )}
          
          {totalPrizes > 0 && (
            <p className="text-xs mt-2 text-center" style={{ color: theme.subTextColor }}>
              Showing {prizes.length} of {totalPrizes} prizes
            </p>
          )}
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`mt-8 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300`}
        style={{
          background: spinning
            ? theme.disabledButton
            : theme.buttonColor,
          color: theme.buttonTextColor,
          cursor: spinning ? "not-allowed" : "pointer",
        }}
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>

      {/* Result */}
      {selectedPrize && !spinning && (
        <div className="mt-6 text-2xl font-semibold" style={{ color: theme.highlightColor }}>
          🎉 You won: {selectedPrize.name} 🎉
        </div>
      )}
    </div>
  );
}
