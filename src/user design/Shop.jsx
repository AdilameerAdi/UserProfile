import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import { useData } from "../context/DataContext";

export default function Shop() {
  const { store } = useData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [offerTimers, setOfferTimers] = useState({});

  const items = store.shopItems;

  useEffect(() => {
    const initial = {};
    items.forEach((it) => {
      if (it.offer && it.offerTimeLeft > 0) initial[it.id] = it.offerTimeLeft;
    });
    setOfferTimers(initial);
  }, [items]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOfferTimers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          next[id] = Math.max(0, next[id] - 1);
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className="p-6 text-gray-100">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2">Shop</h1>
      <p className="text-gray-400 mb-6">Buy exclusive items using your coins!</p>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {items.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-400">
            No shop items yet. Admin can add items in Admin Panel.
          </div>
        )}
        {items.map((item) => {
          const active = selectedItem === item.id;
          const timeLeft = offerTimers[item.id] ?? 0;
          const discountedPrice = item.offer ? Math.floor(Number(item.price) * 0.8) : Number(item.price);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center
                w-36 h-44 p-3
                ${
                  active
                    ? "border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                    : "border-gray-700 hover:border-green-400"
                }`}
            >
              {/* Icon inside colored circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color} text-white mb-2 text-xl overflow-hidden`}
              >
                {item.iconUrl ? <img src={item.iconUrl} className="w-full h-full object-cover" /> : (typeof item.icon === "string" && item.icon ? item.icon : <span>🛒</span>)}
              </div>

              {/* Item Name */}
              <h3 className="text-sm font-semibold mb-1">{item.name}</h3>

              {/* Price Section */}
              <div className="flex flex-col items-center">
                {item.offer ? (
                  <>
                    <p className="flex items-center gap-1 text-gray-400 line-through text-base font-semibold">
                      <FaCoins /> {Number(item.price)}
                    </p>
                    <p className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                      <FaCoins /> {discountedPrice}
                    </p>
                  </>
                ) : (
                  <p className="flex items-center gap-1 text-yellow-400 font-bold">
                    <FaCoins /> {Number(item.price)}
                  </p>
                )}
              </div>

              {/* Offer Badge */}
              {item.offer && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  SALE
                </div>
              )}

              {/* Countdown */}
              {item.offer && timeLeft > 0 && (
                <p className="text-red-400 text-xs font-bold mt-1">
                  Ends in: {formatTime(timeLeft)}
                </p>
              )}

              {/* Selected Indicator */}
              {active && (
                <p className="text-green-400 text-xs font-semibold mt-1">
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
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300
          ${
            selectedItem
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
              : "bg-gray-700 cursor-not-allowed"
          }`}
      >
        {selectedItem ? "Purchase Item" : "Select an Item"}
      </button>
    </div>
  );
}
