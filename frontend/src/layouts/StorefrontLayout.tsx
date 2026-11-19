import React from "react";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { SearchModal } from "../components/SearchModal";
import { CheckoutModal } from "../components/CheckoutModal";

export const StorefrontLayout: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfb]">
        <div>
          <AnnouncementBar />
          <Navbar />
          <main>
            <Outlet />
          </main>
        </div>
        <Footer />

        {/* Overlays / Drawers */}
        <CartDrawer />
        <SearchModal />
        <CheckoutModal />
      </div>
    </CartProvider>
  );
};
