import { useState, useEffect, useContext } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

export default function PurchaseOC() {
  const { theme } = useContext(ThemeContext);
  const { ocPackages } = useData();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [offers, setOffers] = useState([]);

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

  const packages = ocPackages;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div
      className="p-6 transition-colors duration-300"
      style={{
        color: theme.textColor || "#E5E7EB",
        fontFamily: theme.fontFamily,
      }}
    >
      <h1 className="text-3xl font-bold mb-2">Purchase OC</h1>
      <p className="text-gray-400 mb-6" style={{ color: theme.subTextColor || "#9CA3AF" }}>
        Select a package to buy coins and unlock exciting features!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {packages.map((pkg) => {
          const active = selectedPackage === pkg.id;
          const offerData = offers.find((o) => o.id === pkg.id);

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center h-44 w-full p-4`}
              style={{
                borderColor: active
                  ? theme.activeBorder || "#3B82F6"
                  : theme.inactiveBorder || "#374151",
                background: active
                  ? theme.activeBackground || "rgba(59, 130, 246, 0.1)"
                  : theme.inactiveBackground || "transparent",
              }}
            >
              <FaCoins
                className="text-4xl mb-2"
                style={{ color: theme.coinColor || "#FBBF24" }}
              />
              <h3 className="text-lg font-semibold">{pkg.coins.toLocaleString()} Coins</h3>
              <p style={{ color: theme.subTextColor || "#9CA3AF" }}>€{Number(pkg.price).toFixed(2)}</p>

              {pkg.offer && (
                <div
                  className="text-xs font-semibold px-2 py-1 rounded-full mt-2"
                  style={{
                    background: theme.offerBadgeBackground || "linear-gradient(to right, #EC4899, #EF4444)",
                    color: theme.offerBadgeText || "#FFFFFF",
                  }}
                >
                  Limited Offer!
                </div>
              )}

              {pkg.offer && offerData?.timeLeft > 0 && (
                <p
                  className="text-xs font-bold mt-1"
                  style={{ color: theme.offerTimer || "#F87171" }}
                >
                  Ends in: {formatTime(offerData.timeLeft)}
                </p>
              )}

              {active && (
                <p className="text-sm font-semibold mt-1" style={{ color: theme.activeText || "#3B82F6" }}>
                  Selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        disabled={!selectedPackage}
        className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300"
        style={{
          background: selectedPackage
            ? theme.buttonBackground || "linear-gradient(to right, #3B82F6, #6366F1)"
            : theme.disabledButtonBackground || "#374151",
          color: selectedPackage
            ? theme.buttonText || "#FFFFFF"
            : theme.disabledButtonText || "#9CA3AF",
          cursor: selectedPackage ? "pointer" : "not-allowed",
        }}
      >
        {selectedPackage ? "Proceed to Payment" : "Select a Package"}
      </button>
    </div>
  );
}
