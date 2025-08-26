import { createContext, useContext, useMemo, useState } from "react";
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
  const [error, setError] = useState(null);
  
  // Track which data has been loaded
  const [loadedTabs, setLoadedTabs] = useState({
    characters: false,
    ocPackages: false,
    shopItems: false,
    wheelRewards: false
  });

  // Don't load everything on mount - wait for specific requests

  // Load specific table data
  const loadTableData = async (tableName) => {
    const tableMap = {
      characters: 'characters',
      ocPackages: 'oc_packages',
      shopItems: 'shop_items',
      wheelRewards: 'wheel_rewards'
    };
    
    // Check if already loaded
    if (loadedTabs[tableName]) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create timeout for this specific query
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${tableName} loading timeout`)), 15000)
      );
      
      const queryPromise = supabase
        .from(tableMap[tableName])
        .select("*")
        .limit(100); // Add limit to speed up query
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      const { data, error } = result;
      
      if (error) {
        console.error(`Error loading ${tableName}:`, error);
        setError(`Failed to load ${tableName}: ${error.message}`);
      } else {
        setStore(prev => ({
          ...prev,
          [tableName]: data || []
        }));
        setLoadedTabs(prev => ({
          ...prev,
          [tableName]: true
        }));
      }
    } catch (error) {
      console.error(`❌ Failed to load ${tableName}:`, error);
      setError(`Failed to load ${tableName}: ${error.message}`);
      
      // Still mark as loaded with empty array so UI shows "no items" instead of loading forever
      setStore(prev => ({
        ...prev,
        [tableName]: []
      }));
      setLoadedTabs(prev => ({
        ...prev,
        [tableName]: true
      }));
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  const loadDataForTab = async (tab) => {
    switch(tab) {
      case 'characters':
        await loadTableData('characters');
        break;
      case 'ocPackages':
        await loadTableData('ocPackages');
        break;
      case 'shopItems':
        await loadTableData('shopItems');
        break;
      case 'wheelRewards':
        await loadTableData('wheelRewards');
        break;
      default:
        // Load all if no specific tab
        await loadAllData();
    }
  };

  const loadAllData = async () => {
    if (loading) return; // Prevent duplicate calls
    
    try {
      setLoading(true);
      setError(null);
      
      // Load all tables
      const [charactersRes, ocPackagesRes, shopItemsRes, wheelRewardsRes] = await Promise.all([
        supabase.from("characters").select("*"),
        supabase.from("oc_packages").select("*"),
        supabase.from("shop_items").select("*"),
        supabase.from("wheel_rewards").select("*")
      ]);
      
      // Process results
      const results = {
        characters: charactersRes.data || [],
        ocPackages: ocPackagesRes.data || [],
        shopItems: shopItemsRes.data || [],
        wheelRewards: wheelRewardsRes.data || []
      };
      
      // Mark all as loaded
      setLoadedTabs({
        characters: true,
        ocPackages: true,
        shopItems: true,
        wheelRewards: true
      });
      
      // Set the store with results
      setStore(results);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load data');
      
      // Set empty store so UI shows "no data" messages
      setStore(defaultData);
      
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
          image_url: character.imageUrl || character.image_url || ""
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        characters: [data, ...prev.characters],
      }));

      return { success: true, data };
    } catch (error) {
      // Error adding character
      return { success: false, error: error?.message || 'Failed to add character' };
    }
  };

  const updateCharacter = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .update({
          name: updates.name,
          image_url: updates.imageUrl || updates.image_url || ""
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
    } catch (error) {
      // Error updating character
      return { success: false, error: error?.message || 'Failed to update character' };
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
    } catch (error) {
      // Error removing character
      return { success: false, error: error?.message || 'Failed to remove character' };
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
    } catch (error) {
      // Error adding OC package
      return { success: false, error: error?.message || 'Failed to add OC package' };
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
    } catch (error) {
      // Error updating OC package
      return { success: false, error: error?.message || 'Failed to update OC package' };
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
    } catch (error) {
      // Error removing OC package
      return { success: false, error: error?.message || 'Failed to remove OC package' };
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
          image_url: item.imageUrl || item.image_url || ""
        })
        .select()
        .single();

      if (error) throw error;

      setStore((prev) => ({
        ...prev,
        shopItems: [data, ...prev.shopItems],
      }));

      return { success: true, data };
    } catch (error) {
      // Error adding shop item
      return { success: false, error: error?.message || 'Failed to add shop item' };
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
          image_url: updates.imageUrl || updates.image_url || ""
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
    } catch (error) {
      // Error updating shop item
      return { success: false, error: error?.message || 'Failed to update shop item' };
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
    } catch (error) {
      // Error removing shop item
      return { success: false, error: error?.message || 'Failed to remove shop item' };
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
    } catch (error) {
      // Error adding wheel reward
      return { success: false, error: error?.message || 'Failed to add wheel reward' };
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
    } catch (error) {
      // Error updating wheel reward
      return { success: false, error: error?.message || 'Failed to update wheel reward' };
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
    } catch (error) {
      // Error removing wheel reward
      return { success: false, error: error?.message || 'Failed to remove wheel reward' };
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
      error,
      loadAllData,
      loadDataForTab,
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
    [
      store, 
      loading, 
      error, 
      loadAllData, 
      loadDataForTab,
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
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}