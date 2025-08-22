import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./user design/Layout";
import Navbar from "./user design/navbar"; // ✅ Navbar at top

// ✅ Main Pages
import Home from "./user design/home";
import Download from "./user design/Download";
import Support from "./user design/Support";
import Store from "./user design/Store";

// ✅ Profile Subpages
import Characters from "./user design/Characters";
import Coupons from "./user design/Coupons";
import Logs from "./user design/Logs";
import Settings from "./user design/Settings";

// ✅ Store Subpages
import PurchaseOC from "./user design/PurchaseOC";
import Shop from "./user design/Shop";
import FortuneWheel from "./user design/FortuneWheel"; // ✅ Added Fortune Wheel

export default function App() {
  return (
    <Router>
      {/* ✅ Navbar always at the top */}
      <Navbar />

      {/* ✅ Sidebar + Content handled inside Layout */}
      <Layout>
        <Routes>
          {/* ✅ Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/download" element={<Download />} />
          <Route path="/support" element={<Support />} />
          <Route path="/store" element={<Store />} />

          {/* ✅ Store Subpages */}
          <Route path="/store/purchase-oc" element={<PurchaseOC />} />
          <Route path="/store/shop" element={<Shop />} />
          <Route path="/store/fortune-wheel" element={<FortuneWheel />} /> {/* ✅ New route */}

          {/* ✅ Profile Subpages */}
          <Route path="/profile/characters" element={<Characters />} />
          <Route path="/profile/coupons" element={<Coupons />} />
          <Route path="/profile/logs" element={<Logs />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
