import React from "react";
import { Link } from "react-router-dom";
import { Cpu, ShieldAlert, Award, ArrowRight } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-[#d10024] uppercase tracking-wider">
          <Cpu className="w-4 h-4" /> The Electro Standard
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#15161d] tracking-tight">
          We open everything first.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Technology without marketing theatre. We stock what we would buy ourselves,
          publish verified specifications, and stand behind our two-year bench warranty.
        </p>
      </div>

      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        <img
          src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=80"
          alt="Electro Bench Test facility"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <Award className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">1. Measured Performance</h3>
          <p className="text-gray-500 leading-relaxed">
            Manufacturer spec sheets round up battery runtime and peak burst frequencies.
            We record thermal throttling over 60 minutes of sustained benchmark runs.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <ShieldAlert className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">2. Repairability Score</h3>
          <p className="text-gray-500 leading-relaxed">
            A laptop or keyboard you can disassemble outlives two glued-together units.
            We inspect internal socket access, battery adhesive, and hot-swap switches.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <Cpu className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">3. 2-Year In-House Warranty</h3>
          <p className="text-gray-500 leading-relaxed">
            If hardware fails within 24 months, our bench technicians handle the repair or replacement
            directly in Manchester without passing you off to offshore service centers.
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#15161d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold">Ready to equip your workspace?</h3>
          <p className="text-xs text-gray-400 mt-1">Explore our current inventory of bench-certified hardware.</p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
