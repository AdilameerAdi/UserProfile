import { useState } from "react";
import { useData } from "../context/DataContext";

export default function AdminPanel() {
  const { addCharacter, addOcPackage, addShopItem, addPrize } = useData();

  const [characterName, setCharacterName] = useState("");
  const [pkg, setPkg] = useState({ coins: "", price: "", offer: false });
  const [shop, setShop] = useState({ name: "", price: "", color: "", offer: false });
  const [prize, setPrize] = useState({ name: "", icon: "", color: "" });

  const handleAddCharacter = (e) => {
    e.preventDefault();
    addCharacter(characterName.trim());
    setCharacterName("");
  };

  const handleAddPackage = (e) => {
    e.preventDefault();
    addOcPackage({ coins: pkg.coins, price: pkg.price, offer: pkg.offer });
    setPkg({ coins: "", price: "", offer: false });
  };

  const handleAddShopItem = (e) => {
    e.preventDefault();
    addShopItem({ name: shop.name, price: shop.price, color: shop.color, offer: shop.offer });
    setShop({ name: "", price: "", color: "", offer: false });
  };

  const handleAddPrize = (e) => {
    e.preventDefault();
    addPrize({ name: prize.name, icon: prize.icon, color: prize.color });
    setPrize({ name: "", icon: "", color: "" });
  };

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Add Character</h2>
          <form className="flex gap-3" onSubmit={handleAddCharacter}>
            <input
              className="flex-1 p-2 rounded bg-gray-700 text-white"
              placeholder="Character Name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
            <button className="bg-blue-600 px-4 py-2 rounded" type="submit">Add</button>
          </form>
        </section>

        <section className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Add OC Package</h2>
          <form className="grid grid-cols-2 gap-3" onSubmit={handleAddPackage}>
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Coins" value={pkg.coins} onChange={(e) => setPkg({ ...pkg, coins: e.target.value })} />
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Price" value={pkg.price} onChange={(e) => setPkg({ ...pkg, price: e.target.value })} />
            <label className="col-span-2 flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="accent-blue-500" checked={pkg.offer} onChange={(e) => setPkg({ ...pkg, offer: e.target.checked })} />
              Is Limited Offer?
            </label>
            <button className="col-span-2 bg-blue-600 px-4 py-2 rounded" type="submit">Add Package</button>
          </form>
        </section>

        <section className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Add Shop Item</h2>
          <form className="grid grid-cols-2 gap-3" onSubmit={handleAddShopItem}>
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Item Name" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} />
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Price" value={shop.price} onChange={(e) => setShop({ ...shop, price: e.target.value })} />
            <input className="p-2 rounded bg-gray-700 text-white col-span-2" placeholder="Tailwind Color Class (e.g., bg-red-500)" value={shop.color} onChange={(e) => setShop({ ...shop, color: e.target.value })} />
            <label className="col-span-2 flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="accent-blue-500" checked={shop.offer} onChange={(e) => setShop({ ...shop, offer: e.target.checked })} />
              Is On Offer?
            </label>
            <button className="col-span-2 bg-blue-600 px-4 py-2 rounded" type="submit">Add Item</button>
          </form>
        </section>

        <section className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Add Fortune Wheel Prize</h2>
          <form className="grid grid-cols-2 gap-3" onSubmit={handleAddPrize}>
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Prize Name" value={prize.name} onChange={(e) => setPrize({ ...prize, name: e.target.value })} />
            <input className="p-2 rounded bg-gray-700 text-white" placeholder="Icon (emoji)" value={prize.icon} onChange={(e) => setPrize({ ...prize, icon: e.target.value })} />
            <input className="p-2 rounded bg-gray-700 text-white col-span-2" placeholder="Color Class (e.g., bg-teal-500)" value={prize.color} onChange={(e) => setPrize({ ...prize, color: e.target.value })} />
            <button className="col-span-2 bg-blue-600 px-4 py-2 rounded" type="submit">Add Prize</button>
          </form>
        </section>
      </div>
    </div>
  );
}