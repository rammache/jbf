import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCategories } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { categories } = useCategories();
  const { admin } = useAuth();
  const { t, tCategory } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.shop"), path: "/shop" },
    ...categories.map((cat) => ({
      name: tCategory(cat.name),
      path: `/shop?category=${encodeURIComponent(cat.slug || cat.name)}`
    })),
    { name: t("nav.track"), path: "/track" },
    { name: t("nav.contact"), path: "/contact" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#15161d] text-white shadow-md border-b border-[#2b2d42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <BrandLogo variant="light" size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-4 rtl:space-x-reverse">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-semibold transition-colors duration-200 ${isActive ? "text-[#d10024]" : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
                <div className="flex items-center space-x-1.5 sm:space-x-3 rtl:space-x-reverse">
                  <div className="inline-flex">
                    <LanguageSwitcher variant="header" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                    aria-label={t("header.searchPlaceholder")}
                    title={t("header.searchPlaceholder")}
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  <Link
                    to={admin ? "/admin" : "/admin/login"}
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition hidden sm:inline-flex"
                    aria-label={admin ? `${t("nav.admin")} (${admin.name})` : t("nav.login")}
                    title={admin ? `${t("nav.admin")} (${admin.name})` : t("nav.login")}
                  >
                    <User className={`h-5 w-5 ${admin ? "text-[#d10024]" : ""}`} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                    aria-label={t("header.cartTitle")}
                    title={t("header.cartTitle")}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#d10024] text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-[#1e1f29] border-b border-gray-800 px-4 pt-2 pb-6 space-y-2">
                <div className="py-2 mb-2 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Langue / اللغة:</span>
                  <LanguageSwitcher variant="dark" />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </header>
        </>
        );
};
