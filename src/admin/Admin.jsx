import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

export default function Admin() {
  const { theme } = useContext(ThemeContext);
  const { store, addCharacter, addOcPackage, addShopItem, addWheelReward } = useData();

  // Local form states
  const [character, setCharacter] = useState({ name: "", imageUrl: "" });
  const [pkg, setPkg] = useState({ coins: "", price: "", offer: false, offerTimeLeft: 0 });
  const [item, setItem] = useState({ name: "", price: "", color: "bg-blue-500", offer: false, offerTimeLeft: 0, icon: "🛒" });
  const [reward, setReward] = useState({ name: "", color: "bg-yellow-500", icon: "🎁" });

  return (
    <div className="p-6 space-y-8" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* Characters */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h2 className="text-xl font-semibold mb-3">Add Character</h2>
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Character name" value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Image URL (optional)" value={character.imageUrl} onChange={(e) => setCharacter({ ...character, imageUrl: e.target.value })} />
            <button className="px-4 py-2 rounded bg-blue-600" onClick={() => { addCharacter(character); setCharacter({ name: "", imageUrl: "" }); }}>Add</button>
          </div>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h3 className="text-lg font-semibold mb-2">Existing Characters</h3>
          <ul className="space-y-1 text-sm">
            {store.characters.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* OC Packages */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h2 className="text-xl font-semibold mb-3">Add OC Package</h2>
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Coins" type="number" value={pkg.coins} onChange={(e) => setPkg({ ...pkg, coins: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Price" type="number" value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: e.target.value })} />
            <div className="flex items-center gap-2">
              <input id="pkgOffer" type="checkbox" checked={pkg.offer} onChange={(e) => setPkg({ ...pkg, offer: e.target.checked })} />
              <label htmlFor="pkgOffer">Offer</label>
            </div>
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Offer time (seconds)" type="number" value={pkg.offerTimeLeft} onChange={(e) => setPkg({ ...pkg, offerTimeLeft: e.target.value })} />
            <button className="px-4 py-2 rounded bg-blue-600" onClick={() => { addOcPackage(pkg); setPkg({ coins: "", price: "", offer: false, offerTimeLeft: 0 }); }}>Add</button>
          </div>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h3 className="text-lg font-semibold mb-2">Existing OC Packages</h3>
          <ul className="space-y-1 text-sm">
            {store.ocPackages.map((p) => (
              <li key={p.id}>{p.coins} coins — €{p.price} {p.offer ? `(offer ${p.offerTimeLeft}s)` : ""}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Shop Items */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h2 className="text-xl font-semibold mb-3">Add Shop Item</h2>
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Item name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Price" type="number" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Tailwind color class (e.g., bg-red-500)" value={item.color} onChange={(e) => setItem({ ...item, color: e.target.value })} />
            <div className="flex items-center gap-2">
              <input id="itemOffer" type="checkbox" checked={item.offer} onChange={(e) => setItem({ ...item, offer: e.target.checked })} />
              <label htmlFor="itemOffer">Offer</label>
            </div>
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Offer time (seconds)" type="number" value={item.offerTimeLeft} onChange={(e) => setItem({ ...item, offerTimeLeft: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Icon (emoji allowed)" value={item.icon} onChange={(e) => setItem({ ...item, icon: e.target.value })} />
            <button className="px-4 py-2 rounded bg-blue-600" onClick={() => { addShopItem(item); setItem({ name: "", price: "", color: "bg-blue-500", offer: false, offerTimeLeft: 0, icon: "🛒" }); }}>Add</button>
          </div>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h3 className="text-lg font-semibold mb-2">Existing Shop Items</h3>
          <ul className="space-y-1 text-sm">
            {store.shopItems.map((s) => (
              <li key={s.id}>{s.name} — {s.price} {s.offer ? `(offer ${s.offerTimeLeft}s)` : ""}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fortune Wheel Rewards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h2 className="text-xl font-semibold mb-3">Add Fortune Wheel Reward</h2>
          <div className="space-y-3">
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Reward name" value={reward.name} onChange={(e) => setReward({ ...reward, name: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Tailwind color class (e.g., bg-teal-500)" value={reward.color} onChange={(e) => setReward({ ...reward, color: e.target.value })} />
            <input className="w-full p-2 rounded bg-gray-800" placeholder="Icon (emoji allowed)" value={reward.icon} onChange={(e) => setReward({ ...reward, icon: e.target.value })} />
            <button className="px-4 py-2 rounded bg-blue-600" onClick={() => { addWheelReward(reward); setReward({ name: "", color: "bg-yellow-500", icon: "🎁" }); }}>Add</button>
          </div>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: theme.cardBackground, borderColor: theme.cardBorderColor }}>
          <h3 className="text-lg font-semibold mb-2">Existing Wheel Rewards</h3>
          <ul className="space-y-1 text-sm">
            {store.wheelRewards.map((w) => (
              <li key={w.id}>{w.name}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}