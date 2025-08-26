import { useContext, useEffect, useState, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { supabase } from "../supabaseClient";

// Simple Character Image Component
function CharacterImage({ src, alt, theme }) {
  return (
    <div className="w-full h-40 relative overflow-hidden">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className="w-full h-full flex items-center justify-center text-4xl absolute inset-0"
        style={{ 
          backgroundColor: theme.inactiveTabBg, 
          color: theme.textColor,
          display: src ? 'none' : 'flex'
        }}
      >
        🧙‍♂️
      </div>
    </div>
  );
}

export default function Characters() {
  const { theme } = useContext(ThemeContext);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const CHARACTERS_PER_PAGE = 5;
  
  
  // Load characters with pagination
  const loadCharacters = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    
    try {
      const from = (page - 1) * CHARACTERS_PER_PAGE;
      const to = from + CHARACTERS_PER_PAGE - 1;
      
      // Get characters with pagination
      const { data, error, count } = await supabase
        .from('characters')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });
      
      
      if (error) {
        console.error('[Characters] Supabase error:', error);
      } else {
        const newCharacters = data || [];
        
        if (append) {
          setCharacters(prev => [...prev, ...newCharacters]);
        } else {
          setCharacters(newCharacters);
        }
        
        setTotalCharacters(count || 0);
        setHasMore(newCharacters.length === CHARACTERS_PER_PAGE);
        
      }
    } catch (error) {
      console.error('[Characters] Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load first page on mount
  useEffect(() => {
    loadCharacters(1, false);
  }, [loadCharacters]);
  
  // Load next page
  const loadNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadCharacters(nextPage, true);
    }
  };

  // Only show loading if we have no characters AND loading is true
  // This prevents loading flash for cached data
  if (loading && characters.length === 0) {
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
          <p>Loading characters...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div
      className="w-full max-w-6xl mx-auto p-4"
      style={{ fontFamily: theme.fontFamily, color: theme.textColor }}
    >
      <h1 className="text-3xl font-bold mb-6">Characters</h1>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {characters.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ color: theme.subTextColor }}>
            <div className="text-6xl mb-4">🧙‍♂️</div>
            <p className="text-lg font-medium mb-2">No characters available yet</p>
            <p className="text-sm">Characters will appear here when added by the admin</p>
          </div>
        )}
        {characters.map((char) => (
          <div
            key={char.id}
            className="flex flex-col items-center rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg border cursor-pointer"
            style={{
              backgroundColor: theme.cardBg || theme.bgColor,
              borderColor: theme.cardBorderColor,
            }}
          >
            {/* Use optimized image component */}
            <CharacterImage 
              src={char.image_url} 
              alt={char.name} 
              theme={theme} 
            />
            <div
              className="w-full text-center py-3 px-2 text-sm font-semibold border-t"
              style={{
                color: theme.textColor,
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorderColor,
              }}
            >
              {char.name}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {characters.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              Showing {characters.length} of {totalCharacters} characters
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
              {loading ? 'Loading...' : 'Load More Characters'}
            </button>
          )}
          
          {!hasMore && characters.length > 0 && (
            <p className="text-sm" style={{ color: theme.subTextColor }}>
              All characters loaded
            </p>
          )}
        </div>
      )}
    </div>
  );
}