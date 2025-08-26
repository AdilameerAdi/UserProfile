import { useState, useEffect, useContext, useCallback } from "react";
import { FaCoins } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";

export default function Shop() {
  const { theme } = useContext(ThemeContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const ITEMS_PER_PAGE = 12;

  // Load shop items with pagination
  const loadItems = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      // Get shop items with pagination
      const { data, error, count } = await supabase
        .from('shop_items')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });
      
      if (error) {
        console.error('[Shop] Supabase error:', error);
      } else {
        const newItems = data || [];
        
        if (append) {
          setItems(prev => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }
        
        setTotalItems(count || 0);
        setHasMore(newItems.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('[Shop] Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load first page on mount
  useEffect(() => {
    loadItems(1, false);
  }, [loadItems]);
  
  // Load next page
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

  // Only show loading if we have no items AND loading is true
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
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2">Shop</h1>
      <p className="mb-6" style={{ color: theme.subTextColor }}>Buy exclusive items using your coins!</p>

      {/* Shop Items Grid */}
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

      {/* Pagination Controls */}
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
                backgroundColor: theme.primary || '#3B82F6',
                color: theme.activeText || '#FFFFFF',
                border: `1px solid ${theme.primary || '#3B82F6'}`
              }}
            >
              {loading ? 'Loading...' : 'Load More Items'}
            </button>
          )}
          
          {!hasMore && items.length > 0 && (
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              All items loaded
            </p>
          )}
        </div>
      )}

      {/* Buy Button */}
      <button
        disabled={!selectedItem}
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${!selectedItem ? "cursor-not-allowed" : ""} mt-6`}
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
