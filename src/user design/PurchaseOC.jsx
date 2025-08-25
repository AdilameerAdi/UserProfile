import { useState, useEffect, useContext } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../signup/AuthContext";

export default function PurchaseOC() {
  const { theme } = useContext(ThemeContext);
  const { store } = useData();
  const { addCoins } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [purchasing, setPurchasing] = useState(false);

  const packages = store.ocPackages;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftFor = (pkg) => {
    if (!pkg.offer || !pkg.offerEndAt) return 0;
    const end = new Date(pkg.offerEndAt).getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handlePurchase = async () => {
    if (!selectedPackage || purchasing) return;

    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    setPurchasing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add coins to user account
      const result = await addCoins(selectedPkg.coins);
      
      if (result.ok) {
        alert(`Success! You purchased ${Number(selectedPkg.coins).toLocaleString()} coins for €${Number(selectedPkg.price).toFixed(2)}`);
        setSelectedPackage(null);
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } catch {
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
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
      <p className="mb-6" style={{ color: theme.subTextColor || "#9CA3AF" }}>
        Select a package to buy coins and unlock exciting features!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {packages.length === 0 && (
          <div className="col-span-full text-center text-sm" style={{ color: theme.subTextColor }}>
            No OC packages yet. Admin can add packages in Admin Panel.
          </div>
        )}
        {packages.map((pkg) => {
          const active = selectedPackage === pkg.id;
          const timeLeft = timeLeftFor(pkg);

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center h-44 w-full p-4`}
              style={{
                borderColor: active
                  ? theme.activeBorder || "#3B82F6"
                  : theme.cardBorderColor,
                background: active
                  ? theme.activeBg
                  : theme.cardBackground,
                color: theme.textColor,
              }}
            >
              <FaCoins
                className="text-4xl mb-2"
                style={{ color: theme.coinColor || "#FBBF24" }}
              />
              <h3 className="text-lg font-semibold">{Number(pkg.coins).toLocaleString()} Coins</h3>
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

              {pkg.offer && timeLeft > 0 && (
                <p
                  className="text-xs font-bold mt-1"
                  style={{ color: theme.offerTimer || "#F87171" }}
                >
                  Ends in: {formatTime(timeLeft)}
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
        disabled={!selectedPackage || purchasing}
        onClick={handlePurchase}
        className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300"
        style={{
          background: selectedPackage && !purchasing
            ? theme.buttonColor || "linear-gradient(to right, #3B82F6, #6366F1)"
            : theme.disabledButton || "#374151",
          color: theme.buttonTextColor || "#FFFFFF",
          cursor: selectedPackage && !purchasing ? "pointer" : "not-allowed",
        }}
      >
        {purchasing ? "Processing..." : selectedPackage ? "Buy Now" : "Select a Package"}
      </button>
    </div>
  );
}
