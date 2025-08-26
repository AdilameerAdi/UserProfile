import { useContext, useMemo, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

export default function Admin({ activeTab, setActiveTab }) {
  const { theme } = useContext(ThemeContext);
  const [localLoading, setLocalLoading] = useState(false);
  const {
    store,
    loading,
    loadAllData,
    loadDataForTab,
    uploadFile,
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
  } = useData();

  // Load data for the active tab when it changes
  useEffect(() => {
    if (activeTab) {
      loadDataForTab(activeTab);
    }
  }, [activeTab]);

  // activeTab and setActiveTab are now passed as props
  
  const [character, setCharacter] = useState({ name: "", imageUrl: "", _file: null, _previewUrl: "" });
  const [pkg, setPkg] = useState({ coins: "", price: "", offer: false, offerEndAt: "" });
  const [item, setItem] = useState({ name: "", price: "", color: "bg-blue-500", offer: false, offerEndAt: "", icon: "🛒", _file: null, imageUrl: "", _previewUrl: "" });
  const [reward, setReward] = useState({ name: "", color: "bg-yellow-500", icon: "🎁" });
  const [edit, setEdit] = useState({ type: null, id: null });
  const isEditing = useMemo(() => Boolean(edit.id && edit.type), [edit]);

  const resetAll = () => {
    setCharacter({ name: "", imageUrl: "", _file: null, _previewUrl: "" });
    setPkg({ coins: "", price: "", offer: false, offerEndAt: "" });
    setItem({ name: "", price: "", color: "bg-blue-500", offer: false, offerEndAt: "", icon: "🛒", _file: null, imageUrl: "", _previewUrl: "" });
    setReward({ name: "", color: "bg-yellow-500", icon: "🎁" });
    setEdit({ type: null, id: null });
  };

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.inputText,
    borderColor: theme.inputBorder,
  };

  const listRowStyle = {
    backgroundColor: theme.inactiveTabBg,
    borderColor: theme.cardBorderColor,
  };

  const saveCharacter = async () => {
    if (!character.name.trim()) return alert("Please enter character name");
    let finalImageUrl = character.imageUrl;
    if (character._file && typeof uploadFile === "function") {
      finalImageUrl = await uploadFile(character._file);
    }
    const payload = { name: character.name.trim(), imageUrl: finalImageUrl || "" };
    
    let result;
    if (isEditing && edit.type === "character") {
      result = await updateCharacter?.(edit.id, payload);
    } else {
      result = await addCharacter(payload);
    }
    
    if (result?.success) {
      resetAll();
    } else {
      alert(`Failed to save character: ${result?.error || 'Unknown error'}`);
    }
  };

  const savePkg = async () => {
    let offerEndAt = null;
    if (pkg.offer && pkg.offerDuration) {
      const days = parseInt(pkg.offerDuration, 10);
      offerEndAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }
    const payload = { coins: pkg.coins, price: pkg.price, offer: pkg.offer, offerEndAt };
    
    let result;
    if (isEditing && edit.type === "pkg") {
      result = await updateOcPackage?.(edit.id, payload);
    } else {
      result = await addOcPackage(payload);
    }
    
    if (result?.success) {
      resetAll();
    } else {
      alert(`Failed to save OC Package: ${result?.error || 'Unknown error'}`);
    }
  };

  const saveItem = async () => {
    let offerEndAt = null;
    if (item.offer && item.offerDuration) {
      const days = parseInt(item.offerDuration, 10);
      offerEndAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }

    let finalImageUrl = item.imageUrl;
    if (item._file && typeof uploadFile === "function") {
      finalImageUrl = await uploadFile(item._file);
    }

    const payload = { ...item, offerEndAt, imageUrl: finalImageUrl };
    
    let result;
    if (isEditing && edit.type === "item") {
      result = await updateShopItem?.(edit.id, payload);
    } else {
      result = await addShopItem(payload);
    }
    
    if (result?.success) {
      resetAll();
    } else {
      alert(`Failed to save shop item: ${result?.error || 'Unknown error'}`);
    }
  };

  const saveReward = async () => {
    if (!reward.name.trim()) return alert("Enter reward name");
    const payload = { name: reward.name.trim(), color: reward.color || "bg-yellow-500", icon: reward.icon || "🎁" };
    
    let result;
    if (isEditing && edit.type === "reward") {
      result = await updateWheelReward?.(edit.id, payload);
    } else {
      result = await addWheelReward(payload);
    }
    
    if (result?.success) {
      resetAll();
    } else {
      alert(`Failed to save wheel reward: ${result?.error || 'Unknown error'}`);
    }
  };

  const loadForEdit = (type, obj) => {
    setEdit({ type, id: obj.id });
    if (type === "character") {
      setCharacter({ name: obj.name || "", imageUrl: obj.image_url || "", _file: null, _previewUrl: "" });
      setActiveTab("characters");
    }
    if (type === "pkg") {
      setPkg({ coins: String(obj.coins ?? ""), price: String(obj.price ?? ""), offer: Boolean(obj.offer), offerEndAt: obj.offer_end_at || "" });
      setActiveTab("ocPackages");
    }
    if (type === "item") {
      setItem({ name: obj.name || "", price: String(obj.price ?? ""), color: obj.color || "bg-blue-500", offer: Boolean(obj.offer), offerEndAt: obj.offer_end_at || "", icon: obj.icon || "🛒", _file: null, imageUrl: obj.image_url || "", _previewUrl: "" });
      setActiveTab("shopItems");
    }
    if (type === "reward") {
      setReward({ name: obj.name || "", color: obj.color || "bg-yellow-500", icon: obj.icon || "🎁" });
      setActiveTab("wheelRewards");
    }
  };

  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;
    if (type === "character") await removeCharacter?.(id);
    if (type === "pkg") await removeOcPackage?.(id);
    if (type === "item") await removeShopItem?.(id);
    if (type === "reward") await removeWheelReward?.(id);
    if (isEditing && edit.id === id && edit.type === type) resetAll();
  };

  const renderTabContent = () => {
    // Show loading for specific tab if data is loading
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: theme.primary }}></div>
            <p className="text-sm">Loading {activeTab}...</p>
            <p className="text-xs mt-2" style={{ color: theme.subTextColor }}>
              This may take a moment due to network latency
            </p>
            <button 
              className="mt-2 px-3 py-1 text-xs rounded"
              style={{ background: theme.buttonColor, color: theme.buttonTextColor }}
              onClick={() => {
                setLocalLoading(false);
              }}
            >
              Skip Loading
            </button>
          </div>
        </div>
      );
    }
    
    switch (activeTab) {
      case "characters":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border space-y-3" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{isEditing && edit.type === "character" ? "Edit Character" : "Add Character"}</h2>
                {isEditing && edit.type === "character" && <button className="text-sm underline" onClick={resetAll}>Cancel edit</button>}
              </div>
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Character name" value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Image URL (optional)" value={character.imageUrl} onChange={(e) => setCharacter({ ...character, imageUrl: e.target.value, _file: null, _previewUrl: "" })} />
                <label className="block w-full">
                  <span className="text-sm">Upload image from device</span>
                  <input type="file" accept="image/*" className="w-full mt-1" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setCharacter({ ...character, imageUrl: "", _file: file, _previewUrl: preview });
                    }
                  }} />
                </label>
              </div>
              {(character.imageUrl || character._previewUrl) && <img src={character.imageUrl || character._previewUrl} alt="preview" className="h-24 w-24 object-cover rounded-lg border" style={{ borderColor: theme.cardBorderColor }} />}
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded" style={{ background: theme.buttonColor, color: theme.buttonTextColor }} onClick={saveCharacter}>{isEditing && edit.type === "character" ? "Update" : "Add"}</button>
                {isEditing && edit.type === "character" && <button className="px-4 py-2 rounded" style={{ background: theme.disabledButton, color: theme.textColor }} onClick={resetAll}>Cancel</button>}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <h3 className="text-lg font-semibold mb-2">Existing Characters</h3>
              <ul className="space-y-2 text-sm">
                {store.characters.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 p-2 rounded border" style={listRowStyle}>
                    <div className="flex items-center gap-2">
                      {c.image_url ? <img src={c.image_url} className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded border" style={{ background: theme.inactiveTabBg, borderColor: theme.cardBorderColor }} />}
                      <span>{c.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded" style={{ background: theme.activeBg, color: theme.activeText }} onClick={() => loadForEdit("character", c)}>Edit</button>
                      <button className="px-2 py-1 rounded" style={{ background: theme.disconnectButton, color: theme.buttonTextColor }} onClick={() => handleDelete("character", c.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "ocPackages":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border space-y-3" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{isEditing && edit.type === "pkg" ? "Edit OC Package" : "Add OC Package"}</h2>
                {isEditing && edit.type === "pkg" && <button className="text-sm underline" onClick={resetAll}>Cancel edit</button>}
              </div>
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Coins" type="number" value={pkg.coins} onChange={(e) => setPkg({ ...pkg, coins: e.target.value })} />
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Price" type="number" value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: e.target.value })} />
              <div className="flex items-center gap-2">
                <input id="pkgOffer" type="checkbox" checked={pkg.offer} onChange={(e) => setPkg({ ...pkg, offer: e.target.checked })} />
                <label htmlFor="pkgOffer">Offer</label>
              </div>
              {pkg.offer && (
                <label className="block">
                  <span className="text-sm">Offer Duration</span>
                  <select
                    className="w-full p-2 rounded border mt-1"
                    style={inputStyle}
                    value={pkg.offerDuration || ""}
                    onChange={(e) => setPkg({ ...pkg, offerDuration: e.target.value })}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                  </select>
                </label>
              )}
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded" style={{ background: theme.buttonColor, color: theme.buttonTextColor }} onClick={savePkg}>{isEditing && edit.type === "pkg" ? "Update" : "Add"}</button>
                {isEditing && edit.type === "pkg" && <button className="px-4 py-2 rounded" style={{ background: theme.disabledButton, color: theme.textColor }} onClick={resetAll}>Cancel</button>}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <h3 className="text-lg font-semibold mb-2">Existing OC Packages</h3>
              <ul className="space-y-2 text-sm">
                {store.ocPackages.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 p-2 rounded border" style={listRowStyle}>
                    <div className="flex items-center gap-3">
                      <span>{p.coins} coins — €{p.price}</span>
                      {p.offer && <span className="text-xs" style={{ color: theme.highlightColor }}>Offer until {p.offer_end_at ? new Date(p.offer_end_at).toLocaleString() : "?"}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded" style={{ background: theme.activeBg, color: theme.activeText }} onClick={() => loadForEdit("pkg", p)}>Edit</button>
                      <button className="px-2 py-1 rounded" style={{ background: theme.disconnectButton, color: theme.buttonTextColor }} onClick={() => handleDelete("pkg", p.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "shopItems":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border space-y-3" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{isEditing && edit.type === "item" ? "Edit Shop Item" : "Add Shop Item"}</h2>
                {isEditing && edit.type === "item" && <button className="text-sm underline" onClick={resetAll}>Cancel edit</button>}
              </div>
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Item name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Price" type="number" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Tailwind color class (e.g., bg-red-500)" value={item.color} onChange={(e) => setItem({ ...item, color: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Image URL (optional)" value={item.imageUrl} onChange={(e) => setItem({ ...item, imageUrl: e.target.value, _file: null, _previewUrl: "" })} />
                <label className="block w-full">
                  <span className="text-sm">Upload image from device</span>
                  <input type="file" accept="image/*" className="w-full mt-1" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setItem({ ...item, imageUrl: "", _file: file, _previewUrl: preview });
                    }
                  }} />
                </label>
              </div>
              {(item.imageUrl || item._previewUrl) && <img src={item.imageUrl || item._previewUrl} alt="preview" className="h-24 w-24 object-cover rounded-lg border" style={{ borderColor: theme.cardBorderColor }} />}
              <div className="flex items-center gap-2">
                <input id="itemOffer" type="checkbox" checked={item.offer} onChange={(e) => setItem({ ...item, offer: e.target.checked })} />
                <label htmlFor="itemOffer">Offer</label>
              </div>
              {item.offer && (
                <label className="block">
                  <span className="text-sm">Offer Duration</span>
                  <select
                    className="w-full p-2 rounded border mt-1"
                    style={inputStyle}
                    value={item.offerDuration || ""}
                    onChange={(e) => setItem({ ...item, offerDuration: e.target.value })}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                  </select>
                </label>
              )}
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Icon (emoji allowed)" value={item.icon} onChange={(e) => setItem({ ...item, icon: e.target.value })} />
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded" style={{ background: theme.buttonColor, color: theme.buttonTextColor }} onClick={saveItem}>{isEditing && edit.type === "item" ? "Update" : "Add"}</button>
                {isEditing && edit.type === "item" && <button className="px-4 py-2 rounded" style={{ background: theme.disabledButton, color: theme.textColor }} onClick={resetAll}>Cancel</button>}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <h3 className="text-lg font-semibold mb-2">Existing Shop Items</h3>
              <ul className="space-y-2 text-sm">
                {store.shopItems.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 p-2 rounded border" style={listRowStyle}>
                    <div className="flex items-center gap-2">
                      {s.image_url ? <img src={s.image_url} className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded border" style={{ background: theme.inactiveTabBg, borderColor: theme.cardBorderColor }} />}
                      <span>{s.name} — {s.price}</span>
                      {s.offer && <span className="text-xs" style={{ color: theme.highlightColor }}>Offer until {s.offer_end_at ? new Date(s.offer_end_at).toLocaleString() : "?"}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded" style={{ background: theme.activeBg, color: theme.activeText }} onClick={() => loadForEdit("item", s)}>Edit</button>
                      <button className="px-2 py-1 rounded" style={{ background: theme.disconnectButton, color: theme.buttonTextColor }} onClick={() => handleDelete("item", s.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "wheelRewards":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border space-y-3" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{isEditing && edit.type === "reward" ? "Edit Wheel Reward" : "Add Wheel Reward"}</h2>
                {isEditing && edit.type === "reward" && <button className="text-sm underline" onClick={resetAll}>Cancel edit</button>}
              </div>
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Reward name" value={reward.name} onChange={(e) => setReward({ ...reward, name: e.target.value })} />
              <input className="w-full p-2 rounded border" style={inputStyle} placeholder="Tailwind color class" value={reward.color} onChange={(e) => setReward({ ...reward, color: e.target.value })} />
              <div className="space-y-2">
                <label className="block text-sm" style={{ color: theme.textColor }}>
                  Icon (single emoji/symbol only)
                </label>
                <input 
                  className="w-full p-2 rounded border text-center text-lg" 
                  style={inputStyle} 
                  placeholder="🎁" 
                  value={reward.icon} 
                  maxLength={2}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow emojis and symbols - simplified validation
                    const commonEmojis = ['🎁', '🎉', '🎊', '🎈', '🏆', '🥇', '🥈', '🥉', '🏅', '💰', '💎', '⭐', '✨', '🌟', '💫', '🔥', '⚡', '❄️', '🌈', '🍀'];
                    
                    if (value === '' || commonEmojis.includes(value) || value.length <= 2) {
                      setReward({ ...reward, icon: value });
                    }
                  }}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs" style={{ color: theme.subTextColor }}>Quick select:</span>
                  {['🎁', '🎉', '🎊', '🎈', '🏆', '🥇', '🥈', '🥉', '🏅', '💰', '💎', '⭐', '✨', '🌟', '💫', '🔥', '⚡', '❄️', '🌈', '🍀'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setReward({ ...reward, icon: emoji })}
                      className="text-lg hover:bg-gray-200 rounded px-1 transition-colors duration-200"
                      style={{ backgroundColor: reward.icon === emoji ? theme.activeBg : 'transparent' }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded" style={{ background: theme.buttonColor, color: theme.buttonTextColor }} onClick={saveReward}>{isEditing && edit.type === "reward" ? "Update" : "Add"}</button>
                {isEditing && edit.type === "reward" && <button className="px-4 py-2 rounded" style={{ background: theme.disabledButton, color: theme.textColor }} onClick={resetAll}>Cancel</button>}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
              <h3 className="text-lg font-semibold mb-2">Existing Wheel Rewards</h3>
              <ul className="space-y-2 text-sm">
                {store.wheelRewards.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 p-2 rounded border" style={listRowStyle}>
                    <div className="flex items-center gap-2">
                      <span className={`${r.color} px-2 py-1 rounded`}>{r.icon}</span>
                      <span>{r.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded" style={{ background: theme.activeBg, color: theme.activeText }} onClick={() => loadForEdit("reward", r)}>Edit</button>
                      <button className="px-2 py-1 rounded" style={{ background: theme.disconnectButton, color: theme.buttonTextColor }} onClick={() => handleDelete("reward", r.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't block the whole UI for loading
  // Show loading indicator per tab instead

  return (
    <div className="space-y-8" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadAllData}
          disabled={loading}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
          style={{
            background: loading ? theme.disabledButton : theme.buttonColor,
            color: theme.buttonTextColor,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : '🔄 Refresh Data'}
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
}