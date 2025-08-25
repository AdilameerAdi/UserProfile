import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

export default function Characters() {
  const { theme } = useContext(ThemeContext);
  const { store, loading } = useData();

  const characters = store.characters;

  if (loading) {
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
            {char.image_url ? (
              <img
                src={char.image_url}
                alt={char.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-40 items-center justify-center text-4xl"
              style={{ 
                background: theme.inactiveTabBg, 
                color: theme.textColor,
                display: char.image_url ? 'none' : 'flex'
              }}
            >
              🧙‍♂️
            </div>
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

      {characters.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: theme.subTextColor }}>
            Total characters: {characters.length}
          </p>
        </div>
      )}
    </div>
  );
}