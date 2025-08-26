import { useState, useEffect, useContext, useCallback } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";
import eneba from "../img/eneba.png";
import rewarble from "../img/rewarble.png";

export default function Shop() {
  const { theme } = useContext(ThemeContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Added states for payment modal (same as PurchaseOC)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const ITEMS_PER_PAGE = 12;

  const loadItems = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("shop_items")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id", { ascending: true });

      if (error) {
        console.error("[Shop] Supabase error:", error);
      } else {
        const newItems = data || [];
        if (append) {
          setItems((prev) => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }
        setTotalItems(count || 0);
        setHasMore(newItems.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("[Shop] Error loading items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(1, false);
  }, [loadItems]);

  const loadNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadItems(nextPage, true);
    }
  };

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

  // Handle Buy button click - show payment modal
  const handlePurchaseClick = () => {
    if (!selectedItem) return;
    setShowPaymentModal(true);
  };

  // Confirm Purchase (simulate payment like PurchaseOC)
  const confirmPurchase = async () => {
    if (!selectedItem || !selectedPayment) return;
    const selectedIt = items.find((it) => it.id === selectedItem);
    if (!selectedIt) return;

    setPurchasing(true);
    setShowPaymentModal(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate payment
      alert(
        `Success! You purchased "${selectedIt.name}" for ${Number(
          selectedIt.price
        ).toLocaleString()} coins using ${selectedPayment.toUpperCase()}`
      );
      setSelectedItem(null);
      setSelectedPayment(null);
    } catch {
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading && items.length === 0) {
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
          <p>Loading shop items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>
      <h1 className="text-3xl font-bold mb-2">Shop</h1>
      <p className="mb-6" style={{ color: theme.subTextColor }}>Buy exclusive items using your coins!</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {items.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ color: theme.subTextColor }}>
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg font-medium mb-2">No items available yet</p>
            <p className="text-sm">Items will appear here when added by the admin</p>
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
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded mb-2 border" style={{ borderColor: theme.cardBorderColor }} />
              ) : (
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color} text-white mb-2 text-xl`}>
                  {typeof item.icon === "string" ? item.icon : <span>🛒</span>}
                </div>
              )}

              <h3 className="text-sm font-semibold mb-1">{item.name}</h3>

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

              {item.offer && (
                <div className="absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full" style={{ background: theme.offerBadgeBackground || "linear-gradient(to right, #EC4899, #EF4444)" }}>
                  SALE
                </div>
              )}

              {item.offer && timeLeft > 0 && (
                <p className="text-xs font-bold mt-1" style={{ color: theme.offerTimer || "#F87171" }}>
                  Ends in: {formatTime(timeLeft)}
                </p>
              )}

              {active && (
                <p className="text-xs font-semibold mt-1" style={{ color: theme.activeText }}>
                  Selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              Showing {items.length} of {totalItems} items
            </p>
          </div>
          {hasMore && (
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary || "#3B82F6",
                color: theme.activeText || "#FFFFFF",
                border: `1px solid ${theme.primary || "#3B82F6"}`,
              }}
            >
              {loading ? "Loading..." : "Load More Items"}
            </button>
          )}
          {!hasMore && items.length > 0 && (
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              All items loaded
            </p>
          )}
        </div>
      )}

      {/* Buy button triggers payment modal */}
      <button
        disabled={!selectedItem || purchasing}
        onClick={handlePurchaseClick}
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 mt-6`}
        style={{
          background: selectedItem && !purchasing ? theme.buttonColor : theme.disabledButton,
          color: theme.buttonTextColor,
          cursor: selectedItem && !purchasing ? "pointer" : "not-allowed",
        }}
      >
        {purchasing ? "Processing..." : selectedItem ? "Purchase Item" : "Select an Item"}
      </button>

      {/* Payment Modal (same design as PurchaseOC) */}
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
