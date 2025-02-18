import type React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";
import { MyOrders } from "./pages/MyOrders";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  return loading !== null && !isAuthenticated ? (
    <Navigate to="/auth" />
  ) : (
    element
  );
};

function App() {
  return (
    <Router>
    <AuthProvider>
      <CartProvider>
        
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route
                path="/cart"
                element={<PrivateRoute element={<CartPage />} />}
              />
              <Route
                path="/checkout"
                element={<PrivateRoute element={<CheckoutPage />} />}
              />

              <Route
                path="/orders"
                element={<PrivateRoute element={<MyOrders />} />}
              />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
            <Toaster />
          </div>
        
      </CartProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
