import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { SearchModal } from "./components/SearchModal";
import { CheckoutModal } from "./components/CheckoutModal";

import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfb]">
          <div>
            <AnnouncementBar />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </div>
          <Footer />

          {/* Overlays / Drawers */}
          <CartDrawer />
          <SearchModal />
          <CheckoutModal />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
