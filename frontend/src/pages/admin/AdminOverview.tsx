import React from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Tags, ArrowRight } from "lucide-react";

const activeSections = [
  {
    name: "Categories",
    description: "Create, reorder, and organize the departments shoppers browse.",
    icon: Tags,
    to: "/admin/categories"
  },
  {
    name: "Products",
    description: "Add phones, photos, specifications, pricing, and stock levels.",
    icon: Package,
    to: "/admin/products"
  },
  {
    name: "Orders",
    description: "Review, confirm, track, and fulfill customer Cash on Delivery orders.",
    icon: ShoppingCart,
    to: "/admin/orders"
  }
];

export const AdminOverview: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#d10024]">
          Overview
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#15161d]">
          Welcome to your store dashboard.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
          You are signed in as an administrator. Category, product, stock, and
          order management will appear here as each section is built.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {activeSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.name}
              to={section.to}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#d10024] hover:shadow-md block"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f5f7] text-[#15161d] group-hover:bg-red-50 group-hover:text-[#d10024] transition">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                  Active
                </span>
              </div>
              <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-[#15161d] group-hover:text-[#d10024] transition flex items-center justify-between">
                <span>{section.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {section.description}
              </p>
            </Link>
          );
        })}
      </section>
    </div>
  );
};
