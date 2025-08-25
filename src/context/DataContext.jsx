import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

const defaultData = {
  characters: [], // { id, name, image_url }
  ocPackages: [], // { id, coins, price, offer, offer_end_at }
  shopItems: [], // { id, name, price, color, offer, offer_end_at, icon, image_url }
  wheelRewards: [], // { id, name, color, icon }
};

const DataContext = createContext();

export function DataProvider({ children }) {
  const [store, setStore] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Don't load data automatically - wait for admin panel to request it
  useEffect(() => {
    // Only load if not already loaded and in admin context
    if (window.location.pathname.includes('/admin') && !dataLoaded) {
      loadAllData();
    }
  }, [dataLoaded]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [charactersRes, ocPackagesRes, shopItemsRes, wheelRewardsRes] = await Promise.all([
        supabase.from("characters").select("*").order("created_at", { ascending: false }),
        supabase.from("oc_packages").select("*").order("created_at", { ascending: false }),
        supabase.from("shop_items").select("*").order("created_at", { ascending: false }),
        supabase.from("wheel_rewards").select("*").order("created_at", { ascending: false })
      ]);

      setStore({
        characters: charactersRes.data || [],
        ocPackages: ocPackagesRes.data || [],
        shopItems: shopItemsRes.data || [],
        wheelRewards: wheelRewardsRes.data || [],
      });
      setDataLoaded(true);
    } catch {
      // Error loading data
    } finally {
      setLoading(false);
    }
  };

  // ============ CHARACTER OPERATIONS ============
  const addCharacter = async (character) => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .insert({
          name: character.name || "Unnamed",
          image_url: character.imageUrl || ""
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        characters: [data, ...prev.characters],
      }));

      return { success: true, data };
    } catch {
      // Error adding character
      return { success: false, error: error.message };
    }
  };

  const updateCharacter = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .update({
          name: updates.name,
          image_url: updates.imageUrl
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        characters: prev.characters.map((c) => (c.id === id ? data : c)),
      }));

      return { success: true, data };
    } catch {
      // Error updating character
      return { success: false, error: error.message };
    }
  };

  const removeCharacter = async (id) => {
    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        characters: prev.characters.filter((c) => c.id !== id),
      }));

      return { success: true };
    } catch {
      // Error removing character
      return { success: false, error: error.message };
    }
  };

  // ============ OC PACKAGE OPERATIONS ============
  const addOcPackage = async (pkg) => {
    try {
      const { data, error } = await supabase
        .from("oc_packages")
        .insert({
          coins: Number(pkg.coins) || 0,
          price: Number(pkg.price) || 0,
          offer: Boolean(pkg.offer) || false,
          offer_end_at: pkg.offerEndAt || null
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        ocPackages: [data, ...prev.ocPackages],
      }));

      return { success: true, data };
    } catch {
      // Error adding OC package
      return { success: false, error: error.message };
    }
  };

  const updateOcPackage = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("oc_packages")
        .update({
          coins: Number(updates.coins),
          price: Number(updates.price),
          offer: Boolean(updates.offer),
          offer_end_at: updates.offerEndAt || null
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        ocPackages: prev.ocPackages.map((p) => (p.id === id ? data : p)),
      }));

      return { success: true, data };
    } catch {
      // Error updating OC package
      return { success: false, error: error.message };
    }
  };

  const removeOcPackage = async (id) => {
    try {
      const { error } = await supabase
        .from("oc_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        ocPackages: prev.ocPackages.filter((p) => p.id !== id),
      }));

      return { success: true };
    } catch {
      // Error removing OC package
      return { success: false, error: error.message };
    }
  };

  // ============ SHOP ITEM OPERATIONS ============
  const addShopItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .insert({
          name: item.name || "Item",
          price: Number(item.price) || 0,
          color: item.color || "bg-gray-500",
          offer: Boolean(item.offer) || false,
          offer_end_at: item.offerEndAt || null,
          icon: item.icon || "🛒",
          image_url: item.imageUrl || ""
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        shopItems: [data, ...prev.shopItems],
      }));

      return { success: true, data };
    } catch {
      // Error adding shop item
      return { success: false, error: error.message };
    }
  };

  const updateShopItem = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .update({
          name: updates.name,
          price: Number(updates.price),
          color: updates.color,
          offer: Boolean(updates.offer),
          offer_end_at: updates.offerEndAt || null,
          icon: updates.icon,
          image_url: updates.imageUrl || ""
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        shopItems: prev.shopItems.map((s) => (s.id === id ? data : s)),
      }));

      return { success: true, data };
    } catch {
      // Error updating shop item
      return { success: false, error: error.message };
    }
  };

  const removeShopItem = async (id) => {
    try {
      const { error } = await supabase
        .from("shop_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        shopItems: prev.shopItems.filter((s) => s.id !== id),
      }));

      return { success: true };
    } catch {
      // Error removing shop item
      return { success: false, error: error.message };
    }
  };

  // ============ WHEEL REWARD OPERATIONS ============
  const addWheelReward = async (reward) => {
    try {
      const { data, error } = await supabase
        .from("wheel_rewards")
        .insert({
          name: reward.name || "Reward",
          color: reward.color || "bg-blue-500",
          icon: reward.icon || "🎁"
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        wheelRewards: [data, ...prev.wheelRewards],
      }));

      return { success: true, data };
    } catch {
      // Error adding wheel reward
      return { success: false, error: error.message };
    }
  };

  const updateWheelReward = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("wheel_rewards")
        .update({
          name: updates.name,
          color: updates.color,
          icon: updates.icon
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        wheelRewards: prev.wheelRewards.map((w) => (w.id === id ? data : w)),
      }));

      return { success: true, data };
    } catch {
      // Error updating wheel reward
      return { success: false, error: error.message };
    }
  };

  const removeWheelReward = async (id) => {
    try {
      const { error } = await supabase
        .from("wheel_rewards")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        wheelRewards: prev.wheelRewards.filter((w) => w.id !== id),
      }));

      return { success: true };
    } catch {
      // Error removing wheel reward
      return { success: false, error: error.message };
    }
  };

  // File upload helper: Optimized for speed - use data URL directly
  const uploadFile = async (file) => {
    if (!file) return "";

    // For faster uploads, convert directly to data URL
    // This is instant and works reliably
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Optional: If you want to try Supabase Storage first but with timeout
    /*
    try {
      // Set a timeout for Supabase upload
      const uploadPromise = new Promise(async (resolve, reject) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        resolve(publicUrl);
      });

      // Race between upload and timeout (3 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 3000)
      );

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch (error) {
      // Using data URL fallback for faster upload
      // Fast fallback to data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    */
  };

  const value = useMemo(
    () => ({
      store,
      loading,
      loadAllData,
      addCharacter,
      updateCharacter,
      removeCharacter,
      addOcPackage,
      updateOcPackage,
      removeOcPackage,
      addShopItem,
      updateShopItem,
      removeShopItem,
      addWheelReward,
      updateWheelReward,
      removeWheelReward,
      uploadFile,
    }),
    [store, loading]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}