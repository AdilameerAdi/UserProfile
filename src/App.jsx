import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./signup/AuthContext";
import ProtectedRoute from "./signup/ProtectedRoute";
import Login from "./signup/Login";

import Layout from "./user design/Layout";
import Navbar from "./user design/navbar";

// Main Pages
import Home from "./user design/home";
import Download from "./user design/Download";
import Support from "./user design/Support";
import Store from "./user design/Store";

// Profile
import Characters from "./user design/Characters";
import Coupons from "./user design/Coupons";
import Logs from "./user design/Logs";
import Settings from "./user design/Settings";

// Store
import PurchaseOC from "./user design/PurchaseOC";
import Shop from "./user design/Shop";
import FortuneWheel from "./user design/FortuneWheel";
import Admin from "./admin/Admin";

import { useAuth } from "./signup/AuthContext";
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Navbar />
                <Admin />
              </AdminRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/download" element={<Download />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/store" element={<Store />} />

                    <Route path="/store/purchase-oc" element={<PurchaseOC />} />
                    <Route path="/store/shop" element={<Shop />} />
                    <Route path="/store/fortune-wheel" element={<FortuneWheel />} />

                    <Route path="/profile/characters" element={<Characters />} />
                    <Route path="/profile/coupons" element={<Coupons />} />
                    <Route path="/profile/logs" element={<Logs />} />
                    <Route path="/profile/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
