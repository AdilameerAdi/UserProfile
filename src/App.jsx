import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { AuthProvider } from "./signup/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./signup/ProtectedRoute";

// Always load critical components
import Layout from "./user design/Layout";
import Navbar from "./user design/navbar";
import AdminLayout from "./admin/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import SafetyButton from "./components/SafetyButton";
import { useAuth } from "./signup/AuthContext";

// Lazy load heavy components
const Login = lazy(() => import("./signup/Login"));
const Home = lazy(() => import("./user design/home"));
const Download = lazy(() => import("./user design/Download"));
const Support = lazy(() => import("./user design/Support"));
const Store = lazy(() => import("./user design/Store"));
const Characters = lazy(() => import("./user design/Characters"));
const Coupons = lazy(() => import("./user design/Coupons"));
const Logs = lazy(() => import("./user design/Logs"));
const Settings = lazy(() => import("./user design/Settings"));
const PurchaseOC = lazy(() => import("./user design/PurchaseOC"));
const Shop = lazy(() => import("./user design/Shop"));
const FortuneWheel = lazy(() => import("./user design/FortuneWheel"));
const Admin = lazy(() => import("./admin/Admin"));

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AdminWithLayout() {
  const [activeTab, setActiveTab] = useState("characters");
  
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Admin activeTab={activeTab} setActiveTab={setActiveTab} />
    </AdminLayout>
  );
}

function AppContent() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      setIsVisible(nowVisible);
      
      if (nowVisible) {
        setTimeout(() => {
          try {
            window.dispatchEvent(new Event('resize'));
          } catch (error) {
            console.error('Error dispatching resize:', error);
          }
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible]);

  return (
    <Router>
      <div 
        style={{ 
          opacity: isVisible ? 1 : 0.98, 
          transition: 'opacity 0.1s ease-in-out',
          minHeight: '100vh'
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Admin route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <NotificationProvider>
                    <AdminWithLayout />
                  </NotificationProvider>
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
                    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
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
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        <SafetyButton />
      </div>
    </Router>
  );
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
