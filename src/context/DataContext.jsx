import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "appDataStore_v1";

const defaultData = {
  characters: [], // { id, name, imageUrl }
  ocPackages: [], // { id, coins, price, offer, offerEndAt }
  shopItems: [], // { id, name, price, color, offer, offerEndAt, icon, imageUrl }
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

  const updateCharacter = (id, updates) => {
    setStore((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
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
          offerEndAt: pkg.offerEndAt || null,
        },
      ],
    }));
  };

  const updateOcPackage = (id, updates) => {
    setStore((prev) => ({
      ...prev,
      ocPackages: prev.ocPackages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
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
          offerEndAt: item.offerEndAt || null,
          icon: item.icon || "🛒",
          imageUrl: item.imageUrl || "",
        },
      ],
    }));
  };

  const updateShopItem = (id, updates) => {
    setStore((prev) => ({
      ...prev,
      shopItems: prev.shopItems.map((s) => (s.id === id ? { ...s, ...updates } : s)),
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

  const updateWheelReward = (id, updates) => {
    setStore((prev) => ({
      ...prev,
      wheelRewards: prev.wheelRewards.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
  };

  // === Remove functions ===
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

  // File upload helper: persist as data URL in localStorage-backed store
  const uploadFile = async (file) => {
    if (!file) return "";
    const toDataUrl = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
    return await toDataUrl(file);
  };

  const value = useMemo(
    () => ({
      store,
      addCharacter,
      updateCharacter,
      addOcPackage,
      updateOcPackage,
      addShopItem,
      updateShopItem,
      addWheelReward,
      updateWheelReward,
      removeCharacter,
      removeOcPackage,
      removeShopItem,
      removeWheelReward,
      uploadFile,
    }),
    [store]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
