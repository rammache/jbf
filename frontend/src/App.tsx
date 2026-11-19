import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import { GuestOnlyRoute, ProtectedRoute } from "./components/RouteGuards";
import { StorefrontLayout } from "./layouts/StorefrontLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Shipping } from "./pages/Shipping";
import { Returns } from "./pages/Returns";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { OrderTracking } from "./pages/OrderTracking";
import { NotFound } from "./pages/NotFound";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CategoryProvider>
            <Routes>
              <Route element={<GuestOnlyRoute />}>
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Route>

              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/track" element={<OrderTracking />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CategoryProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
