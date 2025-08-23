import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [ocPackages, setOcPackages] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [prizes, setPrizes] = useState([]);

  const addCharacter = (name) => {
    if (!name) return;
    setCharacters((prev) => [...prev, { id: Date.now(), name }]);
  };

  const addOcPackage = ({ coins, price, offer }) => {
    if (coins == null || price == null) return;
    setOcPackages((prev) => [
      ...prev,
      {
        id: Date.now(),
        coins: Number(coins),
        price: Number(price),
        offer: Boolean(offer),
      },
    ]);
  };

  const addShopItem = ({ name, price, color, offer }) => {
    if (!name || price == null) return;
    setShopItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        price: Number(price),
        color: color || "bg-gray-500",
        offer: Boolean(offer),
      },
    ]);
  };

  const addPrize = ({ name, icon, color }) => {
    if (!name) return;
    setPrizes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        icon: icon || "🎁",
        color: color || "bg-gray-500",
      },
    ]);
  };

  return (
    <DataContext.Provider
      value={{ characters, ocPackages, shopItems, prizes, addCharacter, addOcPackage, addShopItem, addPrize }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}