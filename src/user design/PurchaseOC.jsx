import { useState, useEffect, useContext, useCallback } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";
import { useAuth } from "../signup/AuthContext";
import eneba from "../img/eneba.png";
import rewarble from "../img/rewarble.png";

export default function PurchaseOC() {
  const { theme } = useContext(ThemeContext);
  const { addCoins } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [purchasing, setPurchasing] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  const PACKAGES_PER_PAGE = 10;

  // Load OC packages with pagination
  const loadPackages = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    
    try {
      const from = (page - 1) * PACKAGES_PER_PAGE;
      const to = from + PACKAGES_PER_PAGE - 1;
      
      // Get OC packages with pagination
      const { data, error, count } = await supabase
        .from('oc_packages')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });
      
      if (error) {
        console.error('[PurchaseOC] Supabase error:', error);
      } else {
        const newPackages = data || [];
        
        if (append) {
          setPackages(prev => [...prev, ...newPackages]);
        } else {
          setPackages(newPackages);
        }
        
        setTotalPackages(count || 0);
        setHasMore(newPackages.length === PACKAGES_PER_PAGE);
      }
    } catch (error) {
      console.error('[PurchaseOC] Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load first page on mount
  useEffect(() => {
    loadPackages(1, false);
  }, [loadPackages]);
  
  // Load next page
  const loadNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPackages(nextPage, true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftFor = (pkg) => {
    if (!pkg.offer || !pkg.offer_end_at) return 0;
    const end = new Date(pkg.offer_end_at).getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handlePurchaseClick = () => {
    if (!selectedPackage) return;
    setShowPaymentModal(true); // Show payment selection popup
  };

  const confirmPurchase = async () => {
    if (!selectedPackage || !selectedPayment) return;
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    setPurchasing(true);
    setShowPaymentModal(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment
      const result = await addCoins(selectedPkg.coins);

      if (result.ok) {
        alert(
          `Success! You purchased ${Number(selectedPkg.coins).toLocaleString()} coins for €${Number(selectedPkg.price).toFixed(
            2
          )} using ${selectedPayment.toUpperCase()}`
        );
        setSelectedPackage(null);
        setSelectedPayment(null);
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } catch {
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  // Only show loading if we have no packages AND loading is true
  if (loading && packages.length === 0) {
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
          <p>Loading OC packages...</p>
        </div>
      </div>
    );
  }

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

      {/* Packages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {packages.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ color: theme.subTextColor }}>
            <div className="text-6xl mb-4">🪙</div>
            <p className="text-lg font-medium mb-2">No packages available yet</p>
            <p className="text-sm">OC packages will appear here when added by the admin</p>
          </div>
        )}
        {packages.map((pkg) => {
          const active = selectedPackage === pkg.id;
          const timeLeft = timeLeftFor(pkg);

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className="relative cursor-pointer rounded-xl border transition-all duration-300 flex flex-col justify-between items-center text-center h-44 w-full p-4"
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
              <h3 className="text-lg font-semibold">
                {Number(pkg.coins).toLocaleString()} Coins
              </h3>
              <p style={{ color: theme.subTextColor || "#9CA3AF" }}>
                €{Number(pkg.price).toFixed(2)}
              </p>

              {pkg.offer && (
                <div
                  className="text-xs font-semibold px-2 py-1 rounded-full mt-2"
                  style={{
                    background:
                      theme.offerBadgeBackground ||
                      "linear-gradient(to right, #EC4899, #EF4444)",
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
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: theme.activeText || "#3B82F6" }}
                >
                  Selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {packages.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              Showing {packages.length} of {totalPackages} packages
            </p>
          </div>
          
          {hasMore && (
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary || '#3B82F6',
                color: theme.activeText || '#FFFFFF',
                border: `1px solid ${theme.primary || '#3B82F6'}`
              }}
            >
              {loading ? 'Loading...' : 'Load More Packages'}
            </button>
          )}
          
          {!hasMore && packages.length > 0 && (
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              All packages loaded
            </p>
          )}
        </div>
      )}

      {/* Purchase Button */}
      <button
        disabled={!selectedPackage || purchasing}
        onClick={handlePurchaseClick}
        className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 mt-6"
        style={{
          background:
            selectedPackage && !purchasing
              ? theme.buttonColor ||
                "linear-gradient(to right, #3B82F6, #6366F1)"
              : theme.disabledButton || "#374151",
          color: theme.buttonTextColor || "#FFFFFF",
          cursor:
            selectedPackage && !purchasing ? "pointer" : "not-allowed",
        }}
      >
        {purchasing ? "Processing..." : selectedPackage ? "Buy Now" : "Select a Package"}
      </button>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>

            <div className="flex flex-col gap-4">
              {[{ id: "eneba", img: eneba }, { id: "rewarble", img: rewarble }].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border rounded-lg p-2 cursor-pointer flex justify-center items-center ${
                    selectedPayment === method.id ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  <img src={method.img} alt={method.id} className="h-12" />
                </div>
              ))}
            </div>

            <button
              onClick={confirmPurchase}
              disabled={!selectedPayment}
              className={`mt-6 px-6 py-2 rounded-lg font-semibold w-full ${
                selectedPayment
                  ? "bg-blue-600 text-white cursor-pointer"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Confirm Purchase
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-3 text-sm text-red-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
