import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import {
  GiSwordman,
  GiShield,
  GiHealthNormal,
  GiArmorVest,
  GiTreasureMap,
  GiHorseHead,
  GiCat,
  GiCrystalBars,
} from "react-icons/gi";
import { useData } from "../context/DataContext";

export default function Shop() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [offers, setOffers] = useState([
    { id: 2, timeLeft: 600 }, // 10 min
    { id: 4, timeLeft: 300 }, // 5 min
    { id: 7, timeLeft: 900 }, // 15 min
  ]);
  const { shopItems } = useData();

  // Countdown logic for offers
  useEffect(() => {
    const interval = setInterval(() => {
      setOffers((prev) =>
        prev.map((offer) => ({
          ...offer,
          timeLeft: offer.timeLeft > 0 ? offer.timeLeft - 1 : 0,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Map of simple icon names to components, fallback to a default
  const iconMap = {
    sword: <GiSwordman size={28} />,
    shield: <GiShield size={28} />,
    health: <GiHealthNormal size={28} />,
    armor: <GiArmorVest size={28} />,
    treasure: <GiTreasureMap size={28} />,
    mount: <GiHorseHead size={28} />,
    pet: <GiCat size={28} />,
    gem: <GiCrystalBars size={28} />,
  };
  const items = shopItems.map((it) => ({
    ...it,
    icon: iconMap[it.icon] || <GiCrystalBars size={28} />,
  }));

  // Format countdown MM:SS
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
        {items.map((item) => {
          const active = selectedItem === item.id;
          const offerData = offers.find((o) => o.id === item.id);
          const discountedPrice = item.offer
            ? Math.floor(item.price * 0.8)
            : item.price; // 20% discount

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
                className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color} text-white mb-2`}
              >
                {item.icon}
              </div>

              {/* Item Name */}
              <h3 className="text-sm font-semibold mb-1">{item.name}</h3>

              {/* Price Section */}
              <div className="flex flex-col items-center">
                {item.offer ? (
                  <>
                    <p className="flex items-center gap-1 text-gray-400 line-through text-base font-semibold">
                      <FaCoins /> {item.price}
                    </p>
                    <p className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                      <FaCoins /> {discountedPrice}
                    </p>
                  </>
                ) : (
                  <p className="flex items-center gap-1 text-yellow-400 font-bold">
                    <FaCoins /> {item.price}
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
              {item.offer && offerData?.timeLeft > 0 && (
                <p className="text-red-400 text-xs font-bold mt-1">
                  Ends in: {formatTime(offerData.timeLeft)}
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
