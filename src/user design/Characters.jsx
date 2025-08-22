import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import photo1 from "./profile photo/1.png";
import photo2 from "./profile photo/2.png";
import photo3 from "./profile photo/3.png";
import photo4 from "./profile photo/4.png";
import photo5 from "./profile photo/5.png";
import photo6 from "./profile photo/6.png";
import photo8 from "./profile photo/8.png";
import photo9 from "./profile photo/9.png";
import photo10 from "./profile photo/10.png";
import photo11 from "./profile photo/11.png";
import photo12 from "./profile photo/12.png";
import photo13 from "./profile photo/13.png";
import photo14 from "./profile photo/14.png";
import photo15 from "./profile photo/15.png";
import photo16 from "./profile photo/16.png";

export default function Characters() {
  const { theme } = useContext(ThemeContext);

  const characterImages = [
    photo1, photo2, photo3, photo4, photo5, photo6, photo8, photo9,
    photo10, photo11, photo12, photo13, photo14, photo15, photo16
  ];

  // Random names list
  const names = [
    "Aelric", "Selene", "Kaelen", "Lyra", "Darius", "Eira", "Tavian", "Isolde",
    "Corvin", "Nerissa", "Lucian", "Seraphine", "Draven", "Veyra", "Caelan"
  ];

  // Combine images and names
  const characters = characterImages.map((img, index) => ({
    image: img,
    name: names[index] || `Character ${index + 1}`
  }));

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4"
      style={{ fontFamily: theme.fontFamily, color: theme.textColor }}
    >
      <h1 className="text-3xl font-bold mb-6">Characters</h1>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {characters.map((char, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-lg overflow-hidden shadow-md transition transform hover:scale-105"
            style={{
              backgroundColor: theme.cardBg || theme.bgColor,
              border: `1px solid ${theme.borderColor}`,
            }}
          >
            <img
              src={char.image}
              alt={char.name}
              className="w-full h-40 object-cover"
            />
            <div
              className="w-full text-center py-3 text-sm font-semibold"
              style={{
                color: theme.textColor,
                backgroundColor: theme.cardFooterBg || theme.bgColor,
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
