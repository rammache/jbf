import React from "react";
import { Package, ShoppingCart, Tags } from "lucide-react";

const upcomingSections = [
  {
    name: "Categories",
    description: "Create and organize the departments shoppers browse.",
    icon: Tags
  },
  {
    name: "Products",
    description: "Add phones, photos, specifications, and stock levels.",
    icon: Package
  },
  {
    name: "Orders",
    description: "Review, confirm, and fulfil customer orders.",
    icon: ShoppingCart
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
        {upcomingSections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.name}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f4f5f7] text-[#15161d]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Coming soon
                </span>
              </div>
              <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-[#15161d]">
                {section.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {section.description}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
};
