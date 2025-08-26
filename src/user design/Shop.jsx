import { useState, useEffect, useContext } from "react";
import { FaCoins } from "react-icons/fa";
import { useData } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Shop() {
  const { store, loadDataForTab } = useData();
  const { theme } = useContext(ThemeContext);
  
  // Load shop items when component mounts
  useEffect(() => {
    loadDataForTab('shopItems');
  }, []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [now, setNow] = useState(Date.now());

  const items = store.shopItems;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftFor = (it) => {
    if (!it.offer || !it.offer_end_at) return 0;
    const end = new Date(it.offer_end_at).getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className="p-6" style={{ color: theme.textColor }}>
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2">Shop</h1>
      <p className="mb-6" style={{ color: theme.subTextColor }}>Buy exclusive items using your coins!</p>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {items.length === 0 && (
          <div className="col-span-full text-center text-sm" style={{ color: theme.subTextColor }}>
            No shop items yet. Admin can add items in Admin Panel.
          </div>
        )}
        {items.map((item) => {
          const active = selectedItem === item.id;
          const timeLeft = timeLeftFor(item);
          const discountedPrice = item.offer ? Math.floor(Number(item.price) * 0.8) : Number(item.price);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center w-36 h-48 p-3`}
              style={{
                borderColor: active ? theme.activeBorder : theme.cardBorderColor,
                background: active ? theme.activeBg : theme.cardBackground,
                color: theme.textColor,
              }}
            >
              {/* Image or Icon */}
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded mb-2 border" style={{ borderColor: theme.cardBorderColor }} />
              ) : (
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color} text-white mb-2 text-xl`}>
                  {typeof item.icon === "string" ? item.icon : <span>🛒</span>}
                </div>
              )}

              {/* Item Name */}
              <h3 className="text-sm font-semibold mb-1">{item.name}</h3>

              {/* Price Section */}
              <div className="flex flex-col items-center">
                {item.offer ? (
                  <>
                    <p className="flex items-center gap-1 line-through text-base font-semibold" style={{ color: theme.subTextColor }}>
                      <FaCoins /> {Number(item.price)}
                    </p>
                    <p className="flex items-center gap-1 font-bold text-lg" style={{ color: theme.highlightColor }}>
                      <FaCoins /> {discountedPrice}
                    </p>
                  </>
                ) : (
                  <p className="flex items-center gap-1 font-bold" style={{ color: theme.highlightColor }}>
                    <FaCoins /> {Number(item.price)}
                  </p>
                )}
              </div>

              {/* Offer Badge */}
              {item.offer && (
                <div className="absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full" style={{ background: theme.offerBadgeBackground || "linear-gradient(to right, #EC4899, #EF4444)" }}>
                  SALE
                </div>
              )}

              {/* Countdown */}
              {item.offer && timeLeft > 0 && (
                <p className="text-xs font-bold mt-1" style={{ color: theme.offerTimer || "#F87171" }}>
                  Ends in: {formatTime(timeLeft)}
                </p>
              )}

              {/* Selected Indicator */}
              {active && (
                <p className="text-xs font-semibold mt-1" style={{ color: theme.activeText }}>
                  Selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Buy Button */}
      <button
        disabled={!selectedItem}
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${!selectedItem ? "cursor-not-allowed" : ""}`}
        style={{
          background: selectedItem ? theme.buttonColor : theme.disabledButton,
          color: theme.buttonTextColor,
        }}
      >
        {selectedItem ? "Purchase Item" : "Select an Item"}
      </button>
    </div>
  );
}
