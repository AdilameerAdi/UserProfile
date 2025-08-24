import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

export default function Characters() {
  const { theme } = useContext(ThemeContext);
  const { store } = useData();

  const characters = store.characters;

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4"
      style={{ fontFamily: theme.fontFamily, color: theme.textColor }}
    >
      <h1 className="text-3xl font-bold mb-6">Characters</h1>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {characters.length === 0 && (
          <div className="col-span-full text-center text-sm" style={{ color: theme.subTextColor }}>
            No characters yet. Admin can add characters in Admin Panel.
          </div>
        )}
        {characters.map((char) => (
          <div
            key={char.id}
            className="flex flex-col items-center rounded-lg overflow-hidden shadow-md transition transform hover:scale-105 border"
            style={{
              backgroundColor: theme.cardBg || theme.bgColor,
              borderColor: theme.cardBorderColor,
            }}
          >
            {char.imageUrl ? (
              <img
                src={char.imageUrl}
                alt={char.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center text-4xl" style={{ background: theme.inactiveTabBg, color: theme.textColor }}>
                🧙
              </div>
            )}
            <div
              className="w-full text-center py-3 text-sm font-semibold border-t"
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
    </div>
  );
}
