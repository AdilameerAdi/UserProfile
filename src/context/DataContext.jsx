import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "appDataStore_v1";

const defaultData = {
  characters: [], // { id, name, imageUrl }
  ocPackages: [], // { id, coins, price, offer, offerTimeLeft }
  shopItems: [], // { id, name, price, color, offer, offerTimeLeft, icon }
  wheelRewards: [], // { id, name, color, icon }
};

const DataContext = createContext();

export function DataProvider({ children }) {
  const [store, setStore] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultData;
    } catch (_) {
      return defaultData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      // ignore persistence errors
    }
  }, [store]);

  const addCharacter = (character) => {
    setStore((prev) => ({
      ...prev,
      characters: [
        ...prev.characters,
        { id: crypto.randomUUID(), name: character.name || "Unnamed", imageUrl: character.imageUrl || "" },
      ],
    }));
  };

  const addOcPackage = (pkg) => {
    setStore((prev) => ({
      ...prev,
      ocPackages: [
        ...prev.ocPackages,
        {
          id: crypto.randomUUID(),
          coins: Number(pkg.coins) || 0,
          price: Number(pkg.price) || 0,
          offer: Boolean(pkg.offer) || false,
          offerTimeLeft: Number(pkg.offerTimeLeft) || 0,
        },
      ],
    }));
  };

  const addShopItem = (item) => {
    setStore((prev) => ({
      ...prev,
      shopItems: [
        ...prev.shopItems,
        {
          id: crypto.randomUUID(),
          name: item.name || "Item",
          price: Number(item.price) || 0,
          color: item.color || "bg-gray-500",
          offer: Boolean(item.offer) || false,
          offerTimeLeft: Number(item.offerTimeLeft) || 0,
          icon: item.icon || "🛒",
        },
      ],
    }));
  };

  const addWheelReward = (reward) => {
    setStore((prev) => ({
      ...prev,
      wheelRewards: [
        ...prev.wheelRewards,
        {
          id: crypto.randomUUID(),
          name: reward.name || "Reward",
          color: reward.color || "bg-blue-500",
          icon: reward.icon || "🎁",
        },
      ],
    }));
  };

  // === NEW: Remove functions ===
  const removeCharacter = (id) => {
    setStore((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== id),
    }));
  };

  const removeOcPackage = (id) => {
    setStore((prev) => ({
      ...prev,
      ocPackages: prev.ocPackages.filter((p) => p.id !== id),
    }));
  };

  const removeShopItem = (id) => {
    setStore((prev) => ({
      ...prev,
      shopItems: prev.shopItems.filter((s) => s.id !== id),
    }));
  };

  const removeWheelReward = (id) => {
    setStore((prev) => ({
      ...prev,
      wheelRewards: prev.wheelRewards.filter((w) => w.id !== id),
    }));
  };

  const value = useMemo(
    () => ({
      store,
      addCharacter,
      addOcPackage,
      addShopItem,
      addWheelReward,
      removeCharacter,
      removeOcPackage,
      removeShopItem,
      removeWheelReward,
    }),
    [store]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
