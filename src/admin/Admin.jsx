import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

function FilePicker({ onPick }) {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onPick(String(reader.result));
        reader.readAsDataURL(file);
      }}
    />
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border p-5 bg-[#0b1220] border-[#20304d]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function Admin() {
  const { theme } = useContext(ThemeContext);
  const {
    store,
    addCharacter, updateCharacter, deleteCharacter,
    addOcPackage, updateOcPackage, deleteOcPackage,
    addShopItem, updateShopItem, deleteShopItem,
    addWheelReward, updateWheelReward, deleteWheelReward,
  } = useData();

  // Forms
  const [character, setCharacter] = useState({ name: "", imageUrl: "" });
  const [pkg, setPkg] = useState({ coins: "", price: "", offer: false, offerTimeLeft: 0 });
  const [item, setItem] = useState({ name: "", price: "", color: "bg-blue-500", offer: false, offerTimeLeft: 0, icon: "", iconUrl: "" });
  const [reward, setReward] = useState({ name: "", color: "bg-yellow-500", icon: "", iconUrl: "" });

  return (
    <div className="min-h-screen" style={{ background: "#070d19", color: "#e5ecff", fontFamily: theme.fontFamily }}>
      {/* Distinct Admin Header */}
      <div className="sticky top-0 z-10 backdrop-blur bg-[#0a142b]/80 border-b border-[#20304d]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-lg font-extrabold tracking-wider">ADMIN CONSOLE</div>
          <div className="text-xs opacity-70">Manage game content</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Characters */}
        <Section title="Characters">
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Character name" value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value })} />
            <div className="flex items-center gap-3">
              <FilePicker onPick={(dataUrl) => setCharacter({ ...character, imageUrl: dataUrl })} />
              <span className="text-xs opacity-70">Upload character image</span>
            </div>
            <button className="px-4 py-2 rounded bg-[#3b82f6]" onClick={() => { addCharacter(character); setCharacter({ name: "", imageUrl: "" }); }}>Add</button>
          </div>
          <div className="mt-4 divide-y divide-[#20304d]">
            {store.characters.map((c) => (
              <div key={c.id} className="py-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded overflow-hidden bg-[#0e1a31] flex items-center justify-center">
                  {c.imageUrl ? <img src={c.imageUrl} className="w-full h-full object-cover" /> : <span>🧙</span>}
                </div>
                <input className="flex-1 p-2 rounded bg-[#0e1a31] border border-[#20304d]" value={c.name} onChange={(e) => updateCharacter(c.id, { name: e.target.value })} />
                <button className="px-3 py-1 rounded bg-[#10b981]" onClick={() => updateCharacter(c.id, { imageUrl: c.imageUrl })}>Save</button>
                <button className="px-3 py-1 rounded bg-[#ef4444]" onClick={() => deleteCharacter(c.id)}>Delete</button>
              </div>
            ))}
          </div>
        </Section>

        {/* OC Packages */}
        <Section title="OC Packages">
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Coins" type="number" value={pkg.coins} onChange={(e) => setPkg({ ...pkg, coins: e.target.value })} />
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Price" type="number" value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: e.target.value })} />
            <div className="flex items-center gap-2">
              <input id="pkgOffer" type="checkbox" checked={pkg.offer} onChange={(e) => setPkg({ ...pkg, offer: e.target.checked })} />
              <label htmlFor="pkgOffer" className="text-sm">Offer</label>
            </div>
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Offer time (seconds)" type="number" value={pkg.offerTimeLeft} onChange={(e) => setPkg({ ...pkg, offerTimeLeft: e.target.value })} />
            <button className="px-4 py-2 rounded bg-[#3b82f6]" onClick={() => { addOcPackage(pkg); setPkg({ coins: "", price: "", offer: false, offerTimeLeft: 0 }); }}>Add</button>
          </div>
          <div className="mt-4 divide-y divide-[#20304d]">
            {store.ocPackages.map((p) => (
              <div key={p.id} className="py-3 grid grid-cols-5 gap-2 items-center">
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" type="number" value={p.coins} onChange={(e) => updateOcPackage(p.id, { coins: Number(e.target.value) })} />
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" type="number" value={p.price} onChange={(e) => updateOcPackage(p.id, { price: Number(e.target.value) })} />
                <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={p.offer} onChange={(e) => updateOcPackage(p.id, { offer: e.target.checked })} /> Offer</label>
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" type="number" value={p.offerTimeLeft} onChange={(e) => updateOcPackage(p.id, { offerTimeLeft: Number(e.target.value) })} />
                <div className="flex items-center gap-2 justify-end">
                  <button className="px-3 py-1 rounded bg-[#10b981]" onClick={() => updateOcPackage(p.id, { ...p })}>Save</button>
                  <button className="px-3 py-1 rounded bg-[#ef4444]" onClick={() => deleteOcPackage(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Shop Items */}
        <Section title="Shop Items">
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Item name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Price" type="number" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Tailwind color class (e.g., bg-red-500)" value={item.color} onChange={(e) => setItem({ ...item, color: e.target.value })} />
            <div className="flex items-center gap-2">
              <input id="itemOffer" type="checkbox" checked={item.offer} onChange={(e) => setItem({ ...item, offer: e.target.checked })} />
              <label htmlFor="itemOffer" className="text-sm">Offer</label>
            </div>
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Offer time (seconds)" type="number" value={item.offerTimeLeft} onChange={(e) => setItem({ ...item, offerTimeLeft: e.target.value })} />
            <div className="flex flex-col gap-2">
              <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Icon (emoji e.g., 🗡️)" value={item.icon} onChange={(e) => setItem({ ...item, icon: e.target.value })} />
              <div className="flex items-center gap-3">
                <FilePicker onPick={(dataUrl) => setItem({ ...item, iconUrl: dataUrl })} />
                <span className="text-xs opacity-70">Or upload icon image</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded bg-[#3b82f6]" onClick={() => { addShopItem(item); setItem({ name: "", price: "", color: "bg-blue-500", offer: false, offerTimeLeft: 0, icon: "", iconUrl: "" }); }}>Add</button>
          </div>
          <div className="mt-4 divide-y divide-[#20304d]">
            {store.shopItems.map((s) => (
              <div key={s.id} className="py-3 grid grid-cols-7 gap-2 items-center">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white text-lg overflow-hidden`}>
                  {s.iconUrl ? <img src={s.iconUrl} className="w-full h-full object-cover" /> : (s.icon || "🛒")}
                </div>
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" value={s.name} onChange={(e) => updateShopItem(s.id, { name: e.target.value })} />
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" type="number" value={s.price} onChange={(e) => updateShopItem(s.id, { price: Number(e.target.value) })} />
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" value={s.color} onChange={(e) => updateShopItem(s.id, { color: e.target.value })} />
                <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={s.offer} onChange={(e) => updateShopItem(s.id, { offer: e.target.checked })} /> Offer</label>
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" type="number" value={s.offerTimeLeft} onChange={(e) => updateShopItem(s.id, { offerTimeLeft: Number(e.target.value) })} />
                <div className="flex items-center gap-2 justify-end">
                  <button className="px-3 py-1 rounded bg-[#10b981]" onClick={() => updateShopItem(s.id, { ...s })}>Save</button>
                  <button className="px-3 py-1 rounded bg-[#ef4444]" onClick={() => deleteShopItem(s.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Fortune Wheel Rewards */}
        <Section title="Fortune Wheel Rewards">
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Reward name" value={reward.name} onChange={(e) => setReward({ ...reward, name: e.target.value })} />
            <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Tailwind color class (e.g., bg-teal-500)" value={reward.color} onChange={(e) => setReward({ ...reward, color: e.target.value })} />
            <div className="flex flex-col gap-2">
              <input className="w-full p-2 rounded bg-[#0e1a31] border border-[#20304d]" placeholder="Icon (emoji e.g., 💎)" value={reward.icon} onChange={(e) => setReward({ ...reward, icon: e.target.value })} />
              <div className="flex items-center gap-3">
                <FilePicker onPick={(dataUrl) => setReward({ ...reward, iconUrl: dataUrl })} />
                <span className="text-xs opacity-70">Or upload icon image</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded bg-[#3b82f6]" onClick={() => { addWheelReward(reward); setReward({ name: "", color: "bg-yellow-500", icon: "", iconUrl: "" }); }}>Add</button>
          </div>
          <div className="mt-4 divide-y divide-[#20304d]">
            {store.wheelRewards.map((w) => (
              <div key={w.id} className="py-3 grid grid-cols-5 gap-2 items-center">
                <div className={`w-10 h-10 rounded-full ${w.color} flex items-center justify-center text-white text-lg overflow-hidden`}>
                  {w.iconUrl ? <img src={w.iconUrl} className="w-full h-full object-cover" /> : (w.icon || "🎁")}
                </div>
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" value={w.name} onChange={(e) => updateWheelReward(w.id, { name: e.target.value })} />
                <input className="p-2 rounded bg-[#0e1a31] border border-[#20304d]" value={w.color} onChange={(e) => updateWheelReward(w.id, { color: e.target.value })} />
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded bg-[#10b981]" onClick={() => updateWheelReward(w.id, { ...w })}>Save</button>
                  <button className="px-3 py-1 rounded bg-[#ef4444]" onClick={() => deleteWheelReward(w.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}