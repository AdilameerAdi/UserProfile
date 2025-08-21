import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";

export default function PurchaseOC() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [offers, setOffers] = useState([
    { id: 2, timeLeft: 300 }, // 5 min
    { id: 4, timeLeft: 900 }, // 15 min
    { id: 6, timeLeft: 600 }, // 10 min
    { id: 8, timeLeft: 1200 }, // 20 min
  ]);

  // Countdown for offer timers
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

  const packages = [
    { id: 1, coins: 500, price: 4.99, offer: false },
    { id: 2, coins: 1200, price: 9.99, offer: true },
    { id: 3, coins: 2500, price: 18.99, offer: false },
    { id: 4, coins: 5000, price: 34.99, offer: true },
    { id: 5, coins: 8000, price: 54.99, offer: false },
    { id: 6, coins: 10000, price: 64.99, offer: true },
    { id: 7, coins: 15000, price: 94.99, offer: false },
    { id: 8, coins: 20000, price: 124.99, offer: true },
    { id: 9, coins: 30000, price: 174.99, offer: false },
    { id: 10, coins: 40000, price: 224.99, offer: false },
    { id: 11, coins: 50000, price: 274.99, offer: false },
    { id: 12, coins: 100000, price: 499.99, offer: true },
  ];

  // Convert seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className="p-6 text-gray-100">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-2">Purchase OC</h1>
      <p className="text-gray-400 mb-6">
        Select a package to buy coins and unlock exciting features!
      </p>

      {/* Packages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
  {packages.map((pkg) => {
    const active = selectedPackage === pkg.id;
    const offerData = offers.find((o) => o.id === pkg.id);
    return (
      <div
        key={pkg.id}
        onClick={() => setSelectedPackage(pkg.id)}
        className={`relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center
          h-44 w-full p-4
          ${
            active
              ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
              : "border-gray-700 hover:border-blue-400"
          }`}
      >
        {/* Coin Icon */}
        <FaCoins className="text-yellow-400 text-4xl mb-2" />

        <h3 className="text-lg font-semibold">{pkg.coins.toLocaleString()} Coins</h3>
        <p className="text-gray-400">€{pkg.price.toFixed(2)}</p>

        {/* Offer Badge */}
        {pkg.offer && (
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-2">
            Limited Offer!
          </div>
        )}

        {/* Countdown Timer */}
        {pkg.offer && offerData?.timeLeft > 0 && (
          <p className="text-red-400 text-xs font-bold mt-1">
            Ends in: {formatTime(offerData.timeLeft)}
          </p>
        )}

        {/* Active Indicator */}
        {active && (
          <p className="text-blue-400 text-sm font-semibold mt-1">Selected</p>
        )}
      </div>
    );
  })}
</div>

      {/* Buy Button */}
      <button
        disabled={!selectedPackage}
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
          selectedPackage
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            : "bg-gray-700 cursor-not-allowed"
        }`}
      >
        {selectedPackage ? "Proceed to Payment" : "Select a Package"}
      </button>
    </div>
  );
}
