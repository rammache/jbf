import React from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#15161d] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d10024]" />
              <h2 className="text-lg font-bold">Shopping Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Your basket is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Nothing here yet. Explore our bench-tested tech catalog to find your gear.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-2 px-6 py-2.5 bg-[#15161d] hover:bg-[#d10024] text-white text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded bg-white flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.handle}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-sm text-[#15161d] hover:text-[#d10024] line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-gray-400 hover:text-red-600 transition ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedFinish && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Finish: <span className="font-semibold text-gray-700">{item.selectedFinish}</span>
                        </p>
                      )}

                      <p className="text-sm font-bold text-[#d10024] mt-1">
                        ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-r"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center text-base">
                <span className="font-semibold text-gray-600">Subtotal</span>
                <span className="font-extrabold text-xl text-[#15161d]">
                  ${cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Taxes and delivery calculated at checkout. Free shipping over $50.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md flex items-center justify-center gap-2 transition"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
